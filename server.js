const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');
const KB_FILE = path.join(__dirname, 'knowledge-base.json');
const ADMIN_USER = '447051601';
const ADMIN_PASS = 'AzozS2005519';

const GEMINI_API_KEY = 'AIzaSyDmQrbecOdkcdRL4sfwmhqqk1US869ZnbU';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'");
    next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0, etag: false, lastModified: false }));

// Simple in-memory rate limiter
const rateLimitMap = {};
function rateLimit(key, maxRequests = 60, windowMs = 60000) {
    const now = Date.now();
    if (!rateLimitMap[key]) rateLimitMap[key] = [];
    rateLimitMap[key] = rateLimitMap[key].filter(t => now - t < windowMs);
    if (rateLimitMap[key].length >= maxRequests) return false;
    rateLimitMap[key].push(now);
    return true;
}

// Input sanitization
function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '').replace(/[<>"'']/g, '').trim();
}

// Email transporter (configurable)
let transporter = null;
try {
    const emailConfigPath = path.join(__dirname, 'mail-config.json');
    if (fs.existsSync(emailConfigPath)) {
        const mailConfig = JSON.parse(fs.readFileSync(emailConfigPath, 'utf8'));
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: mailConfig.email, pass: mailConfig.password }
        });
        console.log('✅ Email sender configured: ' + mailConfig.email);
    } else {
        console.log('⚠️ No mail-config.json — emails go to terminal only');
    }
} catch (e) {
    console.log('⚠️ Email config error:', e.message);
}

function sendOrLogEmail(to, subject, text) {
    if (transporter) {
        transporter.sendMail({ from: transporter.options.auth.user, to, subject, text }).catch(e => console.log('Email send error:', e.message));
    }
    console.log('[EMAIL to ' + to + '] ' + subject + ': ' + text);
}

let verificationCodes = {};
let chatHistory = {};

function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], tasks: {}, schedules: {}, courses: {}, feedback: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function readKB() {
    return JSON.parse(fs.readFileSync(KB_FILE, 'utf8'));
}

function localAnswer(userMessage, kb) {
    const q = userMessage.replace(/[؟?!,.\-;:]/g, '').trim().toLowerCase();
    const isAr = /[\u0600-\u06FF]/.test(q);

    const entries = [];

    function add(keys, answer) {
        entries.push({ keys: keys.map(k => k.toLowerCase().replace(/[؟?!,.\-;:]/g, '')), answer });
    }

    add(['تعريف', 'نبذة', 'psau', 'معلومات'], `🏛️ ${kb.university.name_ar} - ${kb.university.name_en}\n📍 ${kb.university.location_ar}\n👤 الرئيس: ${kb.university.president}\n🌐 ${kb.university.website}\n📅 تأسست: ${kb.university.established}\n🏷️ ${kb.university.type}`);
    add(['رئيس', 'مدير', 'مدير', 'president', 'rector'], `👤 رئيس الجامعة: ${kb.university.president}`);
    add(['موقع', 'مكان', 'عنوان', 'في', 'address', 'location', 'أين', 'وين'], `📍 ${kb.university.location_ar} / ${kb.university.location_en}\n📮 ${kb.contact.address_ar}`);
    add(['موقع', 'إلكتروني', 'الموقع', 'website', 'psau.edu.sa', 'صفحة', 'رابط', 'online'], `🌐 ${kb.university.website}`);
    add(['رؤية', 'رسالة', 'vision', 'mission'], `👁️ ${kb.university.vision_ar}\n🎯 ${kb.university.mission_ar}`);

    add(['كلية', 'كليات', 'تخصص', 'تخصصات', 'أقسام', 'college', 'faculty', 'major', 'fields', 'what college'], `تضم الجامعة ١٣ كلية:\n${kb.colleges.map((c, i) => `${i + 1}. ${c.name_ar} (${c.name_en}) - ${c.campus}`).join('\n')}`);
    add(['كلية', 'هندسة', 'engineering', 'engineer'], `🏗️ كلية الهندسة - الخرج\nCollege of Engineering - Al-Kharj`);
    add(['كلية', 'حاسب', 'حاسوب', 'computer', 'it', 'تقنية', 'برمجة', 'برمج'], `💻 كلية علوم الحاسب والمعلومات - الخرج\nCollege of Computer and Information Sciences - Al-Kharj`);
    add(['إدارة', 'أعمال', 'business', 'management', 'ادارة'], `📊 كلية إدارة الأعمال - الخرج\nCollege of Business Administration - Al-Kharj`);
    add(['طب', 'بشري', 'medicine', 'medical', 'doctor'], `🩺 كلية الطب - الخرج\nCollege of Medicine - Al-Kharj`);
    add(['صيدلة', 'pharmacy', 'صيدلي'], `💊 كلية الصيدلة - الخرج\nCollege of Pharmacy - Al-Kharj`);
    add(['أسنان', 'سن', 'dentistry', 'dental', 'dentist'], `🦷 كلية طب الأسنان - الخرج\nCollege of Dentistry - Al-Kharj`);
    add(['تمريض', 'nursing', 'ممرض'], `🏥 كلية التمريض - الخرج\nCollege of Nursing - Al-Kharj`);
    add(['طبية', 'تطبيقية', 'applied', 'medical', 'علوم'], `🔬 كلية العلوم الطبية التطبيقية - الخرج\nCollege of Applied Medical Sciences - Al-Kharj`);
    add(['علوم', 'science'], `🧪 كلية العلوم - الخرج\nCollege of Science - Al-Kharj`);
    add(['آداب', 'arts', 'أدب'], `📖 كلية الآداب والعلوم - وادي الدواسر\nCollege of Arts and Sciences - Wadi Al-Dawasir`);
    add(['تربية', 'education', 'teach', 'تعليم'], `📚 كلية التربية - الدلم\nCollege of Education - Al-Dalam`);
    add(['قانون', 'law', 'قضائي', 'حقوق'], `⚖️ كلية القانون - الخرج\nCollege of Law - Al-Kharj`);
    add(['مجتمع', 'community'], `🏘️ كلية المجتمع - الخرج\nCommunity College - Al-Kharj`);

    add(['شروط', 'قبول', 'تسجيل', 'تقديم', 'التقديم', 'admission', 'register', 'apply', 'قدرات', 'تحصيلي', 'وثائق', 'مستندات', 'شهادة', 'قبول'], `📋 شروط القبول:\n${kb.admission.requirements_ar}\n\n📄 الوثائق المطلوبة:\n${kb.admission.required_docs_ar.join('، ')}\n\n📅 فترة التقديم: ${kb.admission.application_period_ar}`);
    add(['عمادة', 'القبول', 'التسجيل', 'deanship', 'admission dept'], `📞 عمادة القبول والتسجيل: ${kb.contact.registration_ar}`);
    add(['وثائق', 'مستندات', 'أوراق', 'documents', 'docs', 'required'], `📄 الوثائق المطلوبة للقبول:\n${kb.admission.required_docs_ar.map(d => `• ${d}`).join('\n')}`);

    add(['معدل', 'gpa', 'g.p.a', 'تقدير', 'درجة', 'درجات', 'نقاط'], `📊 نظام المعدل التراكمي:\n${kb.admission.gpa_calculation_ar}`);
    add(['معدل', 'حساب', 'gpa', 'calculate', 'أحسب', 'المعدل'], `🧮 طريقة حساب المعدل:\n${kb.admission.gpa_calculation_en}\n\n💡 استخدم حاسبة GPA في لوحة التحكم!`);

    add(['اتصال', 'رقم', 'هاتف', 'جوال', 'phone', 'call', 'contact', 'اتصل', 'خدمة عملاء'], `📞 ${kb.contact.phone}\n📧 ${kb.contact.email}\n📍 ${kb.contact.address_ar}\n👨‍🎓 ${kb.contact.student_affairs_ar}\n📝 ${kb.contact.registration_ar}`);
    add(['بريد', 'إلكتروني', 'email', 'ايميل', 'info@'], `📧 البريد الإلكتروني: ${kb.contact.email}`);

    add(['حرم', 'جامعي', 'فرع', 'فروع', 'campus', 'branch', 'حرم'], `🏛️ المقر الرئيسي: ${kb.campus.main_campus_ar}\n🌍 الفروع: ${kb.campus.branches_ar.join('، ')}\n🏗️ المرافق: ${kb.campus.facilities_ar.join('، ')}`);
    add(['سكن', 'سكن', 'housing', 'dorm', 'مبيت'], `🛏️ ${kb.faq[6].answer_ar}`);
    add(['مكتبة', 'library', 'مكتبة', 'مصادر', 'كتب'], `📚 تضم الجامعة مكتبة مركزية ومصادر تعليمية متنوعة.`);

    add(['فصل', 'دراسي', 'semester', 'عام', 'دراسة', 'بداية', 'تقويم', 'أكاديمي', 'بداية'], `📅 ${kb.faq[5].answer_ar}\n\nعدد الفصول: ${kb.academic_calendar.semesters} + فصل صيفي\nأسابيع لكل فصل: ${kb.academic_calendar.weeks_per_semester}\nالبرامج: ${kb.academic_calendar.programs_ar.join('، ')}`);
    add(['بكالوريوس', 'ماجستير', 'دكتوراه', 'دبلوم', 'برامج', 'درجة', 'درجات', 'برنامج'], `🎓 البرامج الأكاديمية: ${kb.academic_calendar.programs_ar.join('، ')}`);

    add(['مكتبة', 'مركز', 'أبحاث', 'مختبر', 'facility', 'مرافق', 'ملعب', 'مطعم'], `🏗️ مرافق الجامعة:\n${kb.campus.facilities_ar.map(f => `• ${f}`).join('\n')}`);
    add(['شؤون', 'طلاب', 'student', 'affairs', 'عمادة', 'طلابية'], `👨‍🎓 ${kb.contact.student_affairs_ar}`);
    add(['رؤية', '2030', '2030', 'رؤية', 'السعودية', 'الرياض', 'تطوير', 'تحول'], `🇸🇦 تساهم الجامعة في تحقيق رؤية المملكة 2030 من خلال التعليم والبحث العلمي وخدمة المجتمع.`);

    add(['سجل', 'تسجيل', 'التسجيل', 'register', 'portal', 'بوابة', 'كيف'], `📝 ${kb.faq[0].answer_ar}`);
    add(['تخصصات', 'التخصصات', 'major', 'what major', 'محتوى'], `🎓 ${kb.faq[1].answer_ar}`);
    add(['حساب', 'المعدل', 'gpa', 'حساب', 'تقدير', 'نقاط'], `📊 ${kb.faq[2].answer_ar}`);
    add(['خدمة', 'عملاء', 'رقم', 'اتصال', 'phone', 'call', 'contact'], `📞 ${kb.faq[3].answer_ar}`);
    add(['أين', 'موقع', 'مكان', 'تقع', 'located', 'location'], `🏛️ ${kb.faq[4].answer_ar}`);
    add(['دراسة', 'بداية', 'فصل', 'semester', 'عام', 'academic', 'study'], `📅 ${kb.faq[5].answer_ar}`);
    add(['سكن', 'housing', 'dorm', 'مبيت', 'إقامة', 'مسكن'], `🛏️ ${kb.faq[6].answer_ar}`);

    const greetings = ['مرحبا', 'اهلا', 'السلام', 'hi', 'hello', 'hey', 'مرحب', 'good morning', 'مساء', 'صباح', 'morning', 'evening'];
    if (greetings.some(g => q.includes(g))) {
        return isAr
            ? '👋 مرحباً! أنا مساعد جامعة الأمير سطام بن عبدالعزيز الذكي. اسألني عن الكليات، القبول، الجداول، أو أي شيء عن الجامعة.'
            : '👋 Welcome! I am the PSAU AI assistant. Ask me about colleges, admission, schedules, or anything about the university.';
    }
    const thanks = ['شكر', 'تسلم', 'thank', 'thanks', 'thx'];
    if (thanks.some(t => q.includes(t))) {
        return isAr ? '🤝 العفو! نحن في الخدمة دائماً' : '🤝 You\'re welcome! Always happy to help.';
    }
    const bye = ['مع السلامة', 'وداعا', 'bye', 'goodbye', 'تصبح'];
    if (bye.some(b => q.includes(b))) {
        return isAr ? '👋 مع السلامة! راجعنا في أي وقت.' : '👋 Goodbye! Visit us anytime.';
    }

    let best = { score: 0, answer: '' };
    for (const entry of entries) {
        const matched = entry.keys.filter(k => q.includes(k)).length;
        const penalty = entry.keys.length < 3 ? 0.5 : 0;
        const score = (matched / Math.max(entry.keys.length, 3)) - penalty;
        if (score > best.score) best = { score, answer: entry.answer };
    }
    if (best.score > 0) return best.answer;

    return isAr
        ? '🔍 لم أجد إجابة محددة. اتصل بالجامعة: 0115888000 أو psau.edu.sa.\n💡 جرب: "كليات الجامعة"، "القبول والتسجيل"، "رقم الجامعة"، "المعدل التراكمي"'
        : '🔍 No specific answer found. Contact: 0115888000 or psau.edu.sa.\n💡 Try: "colleges", "admission", "phone", "GPA"';
}

async function askGemini(userMessage, kb) {
    const collegeList = kb.colleges.map(c => `- ${c.name_ar} (${c.name_en})`).join('\n');
    const faqList = kb.faq.map(f => `س: ${f.question_ar}\nج: ${f.answer_ar}\nQ: ${f.question_en}\nA: ${f.answer_en}`).join('\n\n');

    const systemContext = `أنت مساعد ذكي رسمي لجامعة الأمير سطام بن عبدالعزيز (Prince Sattam bin Abdulaziz University - PSAU).
مهمتك الوحيدة: الإجابة عن الأسئلة المتعلقة بهذه الجامعة فقط.

معلومات الجامعة:
الاسم: ${kb.university.name_ar}
الموقع: ${kb.university.location_ar}
الكليات: ${collegeList}
القبول: ${kb.admission.requirements_ar}
نظام المعدل: ${kb.admission.gpa_calculation_ar}
جهات الاتصال: ${Object.entries(kb.contact).map(([k, v]) => `${k}: ${v}`).join(', ')}
الفروع: ${kb.campus.branches_ar.join('، ')}

الأسئلة الشائعة:
${faqList}

جاوب باللغة التي سأل بها المستخدم. استخدم المعلومات أعلاه فقط.`;

    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro'];
    let lastErr = '';

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent({
                contents: [
                    { role: 'user', parts: [{ text: systemContext + '\n\nسؤال: ' + userMessage }] }
                ],
                generationConfig: { temperature: 0.2, maxOutputTokens: 600, topP: 0.8 }
            });
            const text = result.response.text();
            if (text && text.length > 3) return text;
        } catch (err) {
            lastErr = err.message || String(err);
            console.error(`Gemini ${modelName}:`, lastErr.substring(0, 120));
        }
    }

    console.log('Gemini failed, using local KB fallback');
    return localAnswer(userMessage, kb);
}

// ====== AUTH ======

app.post('/api/register', (req, res) => {
    const { username, password, age, gender, college } = req.body;
    const su = sanitize(username), sp = sanitize(password);
    if (!su || !sp || !age || !gender || !college) {
        return res.status(400).json({ err_ar: 'أكمل جميع البيانات', err_en: 'Fill all fields' });
    }
    if (isNaN(age) || age < 15 || age > 80) {
        return res.status(400).json({ err_ar: 'العمر غير صالح', err_en: 'Invalid age' });
    }
    const db = readDB();
    if (db.users.find(u => u.username === su)) {
        return res.status(400).json({ err_ar: 'اسم المستخدم مكرر', err_en: 'Username taken' });
    }
    db.users.push({ username: su, password: sp, age: parseInt(age), gender, college, phone: '' });
    db.tasks[su] = [];
    db.schedules[su] = [];
    db.courses[su] = [];
    writeDB(db);
    res.json({ msg_ar: 'تم التسجيل بنجاح!', msg_en: 'Registered successfully!' });
});

app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    if (role === 'admin') {
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            return res.json({ username, role: 'admin' });
        }
        return res.status(400).json({ err_ar: 'بيانات المشرف غير صحيحة', err_en: 'Invalid admin credentials' });
    }
    const db = readDB();
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(400).json({ err_ar: 'البيانات غير صحيحة', err_en: 'Invalid credentials' });
    }
    res.json({ username, email: user.email, role: 'student', gender: user.gender });
});

app.post('/api/forgot-password', (req, res) => {
    const { username } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === sanitize(username));
    if (user) {
        return res.json({ found: true, password: user.password });
    }
    res.json({ found: false });
});

app.post('/api/forgot-verify-identity', (req, res) => {
    const { username, college, age, gender } = req.body;
    const db = readDB();
    const user = db.users.find(u =>
        u.username === sanitize(username) &&
        u.college === sanitize(college) &&
        parseInt(u.age) === parseInt(age) &&
        u.gender === sanitize(gender)
    );
    if (user) {
        return res.json({ found: true, password: user.password });
    }
    res.json({ found: false });
});

// ====== FEEDBACK ======
app.post('/api/feedback', (req, res) => {
    const { username, rating, comment } = req.body;
    const db = readDB();
    if (!db.feedback) db.feedback = [];
    db.feedback.push({ username: sanitize(username), rating: parseInt(rating), comment: sanitize(comment), date: new Date().toISOString() });
    writeDB(db);
    console.log('[Feedback] User: ' + username + ' | Rating: ' + rating + '/10 | Msg: ' + comment);
    res.json({ msg_ar: 'شكراً لك! تم استلام ملاحظاتك', msg_en: 'Thank you! Feedback received.' });
});

app.get('/api/feedback', (req, res) => {
    if (!rateLimit('get-feedback', 30, 60000)) return res.status(429).json({ error: 'rate limit' });
    if (req.query.user !== ADMIN_USER) return res.status(403).json({ error: 'Forbidden' });
    const db = readDB();
    res.json(db.feedback || []);
});

// ====== ADMIN STATS ======
function isAdmin(req) { return req.query.user === ADMIN_USER; }

app.get('/api/admin/stats', (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Forbidden' });
    const db = readDB();
    const users = db.users.length;
    const tasks = Object.values(db.tasks || {}).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0);
    const schedules = Object.values(db.schedules || {}).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0);
    const courses = Object.values(db.courses || {}).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0);
    const feedback = (db.feedback || []).length;
    const males = db.users.filter(u => u.gender === 'ذكر' || u.gender === 'male').length;
    const females = db.users.filter(u => u.gender === 'أنثى' || u.gender === 'female').length;
    const activeUsers = Object.keys(db.tasks || {}).filter(k => db.tasks[k] && db.tasks[k].length > 0).length;
    const usersWithCourses = Object.keys(db.courses || {}).filter(k => db.courses[k] && db.courses[k].length > 0).length;
    const usersWithSchedules = Object.keys(db.schedules || {}).filter(k => db.schedules[k] && db.schedules[k].length > 0).length;
    res.json({ users, tasks, schedules, courses, feedback, males, females, activeUsers, usersWithCourses, usersWithSchedules });
});

app.get('/api/admin/users', (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Forbidden' });
    const db = readDB();
    const list = db.users.map(u => ({
        username: u.username,
        age: u.age,
        gender: u.gender,
        college: u.college,
        password: u.password
    }));
    res.json(list);
});

app.get('/api/is-admin', (req, res) => {
    res.json({ admin: req.query.role === 'admin' });
});

app.get('/api/users/:username/gender', (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.username === req.params.username);
    if (user) return res.json({ gender: user.gender });
    res.json({ gender: null });
});

// ====== TASKS ======
app.get('/api/tasks/:username', (req, res) => {
    const db = readDB();
    res.json(db.tasks[req.params.username] || []);
});

app.post('/api/tasks/:username', (req, res) => {
    const { username } = req.params;
    const { text, type, priority } = req.body;
    const db = readDB();
    if (!db.tasks[username]) db.tasks[username] = [];
    db.tasks[username].push({ text: sanitize(text), type: sanitize(type), priority: sanitize(priority), completed: false });
    writeDB(db);
    res.json({ success: true });
});

app.patch('/api/tasks/:username/:index/toggle', (req, res) => {
    const { username, index } = req.params;
    const db = readDB();
    if (db.tasks[username] && db.tasks[username][index]) {
        db.tasks[username][index].completed = !db.tasks[username][index].completed;
        writeDB(db);
        res.json({ success: true, completed: db.tasks[username][index].completed });
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.delete('/api/tasks/:username/:index', (req, res) => {
    const { username, index } = req.params;
    const db = readDB();
    if (db.tasks[username]) db.tasks[username].splice(index, 1);
    writeDB(db);
    res.json({ success: true });
});

// ====== SCHEDULE ======
app.get('/api/schedule/:username', (req, res) => {
    const db = readDB();
    res.json(db.schedules[req.params.username] || []);
});

app.post('/api/schedule/:username', (req, res) => {
    const { username } = req.params;
    const db = readDB();
    if (!db.schedules[username]) db.schedules[username] = [];
    db.schedules[username].push(req.body);
    writeDB(db);
    res.json({ success: true });
});

app.delete('/api/schedule/:username/:index', (req, res) => {
    const { username, index } = req.params;
    const db = readDB();
    if (db.schedules[username]) db.schedules[username].splice(index, 1);
    writeDB(db);
    res.json({ success: true });
});

// ====== COURSES ======
app.get('/api/courses/:username', (req, res) => {
    const db = readDB();
    res.json(db.courses[req.params.username] || []);
});

app.post('/api/courses/:username', (req, res) => {
    const { username } = req.params;
    const db = readDB();
    if (!db.courses[username]) db.courses[username] = [];
    if (db.courses[username].includes(req.body.name)) {
        return res.status(400).json({ err_ar: 'المقرر مضاف', err_en: 'Course exists' });
    }
    db.courses[username].push(req.body.name);
    writeDB(db);
    res.json({ success: true });
});

app.delete('/api/courses/:username/:index', (req, res) => {
    const { username, index } = req.params;
    const db = readDB();
    if (db.courses[username]) db.courses[username].splice(index, 1);
    writeDB(db);
    res.json({ success: true });
});

// ====== SETTINGS ======
app.post('/api/settings/update', (req, res) => {
    const { currentUsername, newUsername, newPassword } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.username === currentUsername);
    if (userIndex === -1) return res.status(404).json({ err_ar: 'خطأ', err_en: 'Error' });
    if (newUsername && newUsername !== currentUsername) {
        if (db.users.find(u => u.username === newUsername)) {
            return res.status(400).json({ err_ar: 'مأخوذ', err_en: 'Taken' });
        }
        db.tasks[newUsername] = db.tasks[currentUsername];
        db.schedules[newUsername] = db.schedules[currentUsername];
        db.courses[newUsername] = db.courses[currentUsername];
        delete db.tasks[currentUsername];
        delete db.schedules[currentUsername];
        delete db.courses[currentUsername];
        db.users[userIndex].username = newUsername;
    }
    if (newPassword) db.users[userIndex].password = newPassword;
    writeDB(db);
    res.json({ updatedUsername: db.users[userIndex].username });
});

app.post('/api/settings/delete', (req, res) => {
    const { username } = req.body;
    let db = readDB();
    db.users = db.users.filter(u => u.username !== username);
    delete db.tasks[username];
    delete db.schedules[username];
    delete db.courses[username];
    writeDB(db);
    res.json({ success: true });
});

// ====== CHAT ======
app.post('/api/chat', async (req, res) => {
    const { message, username } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message required' });
    const kb = readKB();
    const reply = await askGemini(message, kb);
    if (username) {
        if (!chatHistory[username]) chatHistory[username] = [];
        if (chatHistory[username].length > 50) chatHistory[username] = chatHistory[username].slice(-50);
        chatHistory[username].push({ role: 'user', message });
        chatHistory[username].push({ role: 'assistant', message: reply });
    }
    res.json({ reply_ar: reply, reply_en: reply, reply });
});

app.post('/api/chat/history', (req, res) => {
    const { username } = req.body;
    res.json(username && chatHistory[username] ? chatHistory[username] : []);
});

app.listen(PORT, () => {
    console.log('PSAU AI Portal running: http://localhost:' + PORT);
    console.log('AI مزود بـ Google Gemini');
});
