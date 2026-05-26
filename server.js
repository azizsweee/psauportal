require('dotenv').config();
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

// Security headers & HTTPS Redirect
app.use((req, res, next) => {
    // Redirect HTTP to HTTPS if behind a reverse proxy (like PythonAnywhere, Render, Heroku)
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
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

let transporter = null;

function initTransporter() {
    const tryEnv = (prefix) => {
        const host = process.env[prefix + '_HOST'];
        const port = process.env[prefix + '_PORT'] || '587';
        const user = process.env[prefix + '_USER'];
        const pass = process.env[prefix + '_PASS'];
        if (host && user && pass) {
            transporter = nodemailer.createTransport({ host, port: parseInt(port), secure: port === '465', auth: { user, pass } });
            return { label: prefix + ' env', user };
        }
        return null;
    };

    let src = tryEnv('BREVO') || tryEnv('SMTP');

    if (!src) {
        try {
            const cfgPath = path.join(__dirname, 'mail-config.json');
            if (fs.existsSync(cfgPath)) {
                const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
                if (cfg.host && cfg.user && cfg.pass) {
                    transporter = nodemailer.createTransport({ host: cfg.host, port: cfg.port || 587, secure: (cfg.port || 587) === 465, auth: { user: cfg.user, pass: cfg.pass } });
                    src = { label: 'mail-config.json', user: cfg.user };
                }
            }
        } catch (e) { /* ignore */ }
    }

    if (transporter) {
        console.log('✅ SMTP configured via ' + src.label + ': ' + src.user);
        transporter.verify().then(ok => {
            if (ok) console.log('✅ SMTP connection verified successfully');
        }).catch(e => {
            console.log('❌ SMTP connection FAILED: ' + e.message);
            console.log('❌ Emails will NOT be sent. Check your SMTP credentials.');
            transporter = null;
        });
    } else {
        console.log('⚠️ No SMTP configured — OTP will be shown on screen only');
    }
}
initTransporter();

function htmlTemplate(title, bodyContent) {
    return '<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;padding:20px;background:#f5f5f5;margin:0"><div style="max-width:480px;margin:auto;background:white;border-radius:12px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,0.1)"><div style="text-align:center;margin-bottom:20px"><h2 style="color:#1a237e;margin:0">' + title + '</h2><p style="color:#666">بوابة طلابية ذكية</p></div><hr style="border:none;border-top:1px solid #eee">' + bodyContent + '<hr style="border:none;border-top:1px solid #eee"><p style="font-size:12px;color:#aaa;text-align:center">PSAU AI Portal &bull; بوابة غير رسمية</p></div></body></html>';
}

function otpHtml(name, code, minutes) {
    return htmlTemplate('جامعة الأمير سطام بن عبدالعزيز', '<p style="font-size:16px;color:#333">مرحباً <b>' + name + '</b>،</p><p style="font-size:16px;color:#333">رمز التحقق الخاص بك هو:</p><div style="text-align:center;margin:25px 0;padding:15px;background:#e8eaf6;border-radius:8px;direction:ltr"><span style="font-size:36px;font-weight:bold;color:#1a237e;letter-spacing:8px">' + code + '</span></div><p style="font-size:14px;color:#999">صلاحية هذا الرمز <b>' + minutes + '</b>. إذا لم تطلب هذا، تجاهل الرسالة.</p>');
}

async function sendMailWithRetry(to, subject, text, html, retries) {
    if (!transporter) {
        console.log('[EMAIL DEV] to ' + to + ' | ' + subject + ': ' + text);
        return false;
    }
    retries = retries || 2;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            let from = 'PSAU Portal <' + (transporter.options?.auth?.user || 'noreply@psau-portal.com') + '>';
            await transporter.sendMail({ from, to, subject, text, html });
            console.log('[EMAIL sent] to ' + to + ' (attempt ' + attempt + ')');
            return true;
        } catch (e) {
            console.log('[EMAIL ERROR] to ' + to + ' (attempt ' + attempt + '/' + retries + '): ' + e.message);
            if (attempt < retries) await new Promise(r => setTimeout(r, 2000));
        }
    }
    return false;
}

function sendOrLogEmail(to, subject, text, html) {
    return sendMailWithRetry(to, subject, text, html);
}

// OTP store: { key: { code, expires, username } }
const otpStore = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function cleanExpiredOTPs() {
    const now = Date.now();
    for (const key in otpStore) {
        if (otpStore[key].expires < now) delete otpStore[key];
    }
}
setInterval(cleanExpiredOTPs, 60000);
let chatHistory = {};

function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], tasks: {}, schedules: {}, feedback: [], gpaData: {}, savedSchedules: {}, hourglass: {}, absence: {} }, null, 2));
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

// Temp storage for registration before email verification
const regTempStore = {};

app.post('/api/register', async (req, res) => {
    const { username, password, age, gender, college, email } = req.body;
    const su = sanitize(username), sp = sanitize(password);
    const se = email ? sanitize(email).trim().toLowerCase() : '';
    if (!su || !sp || !age || !gender || !college) {
        return res.status(400).json({ err_ar: 'أكمل جميع البيانات', err_en: 'Fill all fields' });
    }
    if (isNaN(age) || age < 15 || age > 80) {
        return res.status(400).json({ err_ar: 'العمر غير صالح', err_en: 'Invalid age' });
    }
    if (!se || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(se)) {
        return res.status(400).json({ err_ar: 'البريد الإلكتروني مطلوب', err_en: 'Email is required' });
    }
    const db = readDB();
    if (db.users.find(u => u.username === su)) {
        return res.status(400).json({ err_ar: 'اسم المستخدم مكرر', err_en: 'Username taken' });
    }
    if (db.users.find(u => u.email && u.email.toLowerCase() === se)) {
        return res.status(400).json({ err_ar: 'البريد مسجل مسبقاً', err_en: 'Email already registered' });
    }

    // Rate limit: max 1 OTP per 60 seconds per email
    if (!rateLimit('reg:' + se, 1, 60000)) {
        return res.status(429).json({ err_ar: 'انتظر دقيقة قبل طلب رمز جديد', err_en: 'Wait 1 min before new code' });
    }

    // Generate OTP and store temp data
    const code = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    const otpKey = 'reg:' + se;
    otpStore[otpKey] = { code, expires, email: se };
    regTempStore[se] = { username: su, password: sp, age: parseInt(age), gender, college };

    const subject = 'رمز التحقق - جامعة الأمير سطام بن عبدالعزيز';
    const text = `مرحباً ${su},
رمز التحقق للتسجيل في بوابة جامعة الأمير سطام بن عبدالعزيز هو:
${code}
صلاحية هذا الرمز 10 دقائق.
إذا لم تطلب هذا، تجاهل الرسالة.

PSAU AI Portal`;
    const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;padding:20px;background:#f5f5f5"><div style="max-width:480px;margin:auto;background:white;border-radius:12px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,0.1)"><div style="text-align:center;margin-bottom:20px"><h2 style="color:#1a237e;margin:0">جامعة الأمير سطام بن عبدالعزيز</h2><p style="color:#666">بوابة طلابية ذكية</p></div><hr style="border:none;border-top:1px solid #eee"><p style="font-size:16px;color:#333">مرحباً <b>${su}</b>،</p><p style="font-size:16px;color:#333">رمز التحقق الخاص بك هو:</p><div style="text-align:center;margin:25px 0;padding:15px;background:#e8eaf6;border-radius:8px;direction:ltr"><span style="font-size:36px;font-weight:bold;color:#1a237e;letter-spacing:8px">${code}</span></div><p style="font-size:14px;color:#999">صلاحية هذا الرمز <b>10 دقائق</b>. إذا لم تطلب هذا، تجاهل الرسالة.</p><hr style="border:none;border-top:1px solid #eee"><p style="font-size:12px;color:#aaa;text-align:center">PSAU AI Portal &bull; بوابة غير رسمية</p></div></body></html>`;

    const emailSent = await sendOrLogEmail(se, subject, text, html);

    const response = { msg_ar: 'تم إرسال الرمز إلى بريدك', msg_en: 'Code sent to your email', email: se.replace(/(.{3})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c) };
    if (!transporter) {
        response.msg_ar = '⚙️ وضع التطوير: الكود هو ' + code;
        response.msg_en = '⚙️ Dev mode — code: ' + code;
        response.dev_code = code;
    } else if (!emailSent) {
        response.msg_ar = '❌ فشل إرسال البريد الإلكتروني، حاول مرة أخرى';
        response.msg_en = '❌ Failed to send email, try again';
    }
    res.json(response);
});

// Resend OTP for registration (with rate limit bypass for help)
app.post('/api/reg-resend', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ err_ar: 'البريد مطلوب', err_en: 'Email required' });
    const se = sanitize(email).trim().toLowerCase();
    const otpKey = 'reg:' + se;
    const stored = otpStore[otpKey];
    if (!stored) return res.status(400).json({ err_ar: 'لا يوجد كود معلق لهذا البريد', err_en: 'No pending code for this email' });
    if (stored.expires < Date.now()) {
        delete otpStore[otpKey];
        return res.status(400).json({ err_ar: 'انتهت صلاحية الرمز، سجل مرة أخرى', err_en: 'Code expired, re-register' });
    }
    const text = `مرحباً،
رمز التحقق للتسجيل في بوابة جامعة الأمير سطام هو:
${stored.code}
صلاحية هذا الرمز: ${Math.round((stored.expires - Date.now()) / 60000)} دقائق.

PSAU AI Portal`;
    const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;padding:20px;background:#f5f5f5"><div style="max-width:480px;margin:auto;background:white;border-radius:12px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,0.1)"><div style="text-align:center;margin-bottom:20px"><h2 style="color:#1a237e;margin:0">جامعة الأمير سطام بن عبدالعزيز</h2><p style="color:#666">بوابة طلابية ذكية</p></div><hr style="border:none;border-top:1px solid #eee"><p style="font-size:16px;color:#333">رمز التحقق الخاص بك هو:</p><div style="text-align:center;margin:25px 0;padding:15px;background:#e8eaf6;border-radius:8px;direction:ltr"><span style="font-size:36px;font-weight:bold;color:#1a237e;letter-spacing:8px">${stored.code}</span></div><p style="font-size:14px;color:#999">صلاحية هذا الرمز: <b>${Math.round((stored.expires - Date.now()) / 60000)} دقائق</b></p><hr style="border:none;border-top:1px solid #eee"><p style="font-size:12px;color:#aaa;text-align:center">PSAU AI Portal &bull; بوابة غير رسمية</p></div></body></html>`;
    const sent = await sendOrLogEmail(se, 'رمز التحقق - جامعة الأمير سطام بن عبدالعزيز', text, html);
    if (sent) {
        res.json({ msg_ar: 'تم إعادة إرسال الرمز', msg_en: 'Code resent' });
    } else {
        res.json({ msg_ar: '⚙️ فشل الإرسال، الكود: ' + stored.code, msg_en: '⚙️ Send failed, code: ' + stored.code, dev_code: stored.code });
    }
});

app.post('/api/verify-email', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ err_ar: 'أكمل البيانات', err_en: 'Fill all fields' });
    const se = sanitize(email).trim().toLowerCase();
    const sc = sanitize(code).trim();
    if (!/^\d{6}$/.test(sc)) return res.status(400).json({ err_ar: 'الكود 6 أرقام', err_en: 'Code must be 6 digits' });

    const otpKey = 'reg:' + se;
    const stored = otpStore[otpKey];
    if (!stored) return res.status(400).json({ err_ar: 'لم يتم طلب رمز أو انتهت صلاحيته', err_en: 'No code requested or expired' });
    if (stored.expires < Date.now()) {
        delete otpStore[otpKey];
        return res.status(400).json({ err_ar: 'انتهت صلاحية الرمز، اطلب واحداً جديداً', err_en: 'Code expired, request a new one' });
    }
    if (stored.code !== sc) return res.status(400).json({ err_ar: 'الكود خطأ!', err_en: 'Wrong code!' });

    // Valid OTP – create user with verified=true
    delete otpStore[otpKey];
    const td = regTempStore[se];
    if (!td) return res.status(400).json({ err_ar: 'انتهت الجلسة، أعد التسجيل', err_en: 'Session expired, re-register' });
    delete regTempStore[se];

    const db = readDB();
    db.users.push({ username: td.username, password: td.password, email: se, age: td.age, gender: td.gender, college: td.college, phone: '', verified: true });
    db.tasks[td.username] = [];
    db.schedules[td.username] = [];
    writeDB(db);

    res.json({ msg_ar: '✅ تم إنشاء الحساب وتوثيقه بنجاح!', msg_en: '✅ Account created and verified!' });
});

const ADMIN_EMAIL = 'abdulazizsowaankau@gmail.com';

// Admin send OTP code
app.post('/api/admin/send-code', async (req, res) => {
    const { username } = req.body;
    if (sanitize(username) !== ADMIN_USER) {
        return res.status(400).json({ err_ar: 'اسم المستخدم غير صحيح', err_en: 'Invalid admin username' });
    }

    if (!rateLimit('admin-otp', 1, 120000)) {
        return res.status(429).json({ err_ar: 'انتظر دقيقتين قبل طلب رمز جديد', err_en: 'Wait 2 min before new code' });
    }

    const code = generateOTP();
    const expires = Date.now() + 2 * 60 * 1000; // 2 minutes
    otpStore['admin:login'] = { code, expires };

    const subject = 'رمز دخول المشرف - PSAU Portal';
    const text = 'رمز دخول لوحة المشرف هو:\n' + code + '\nالصلاحية: دقيقتان.';
    const html = otpHtml('المشرف', code, 'دقيقتان');
    const emailSent = await sendOrLogEmail(ADMIN_EMAIL, subject, text, html);

    const response = { msg_ar: 'تم إرسال الرمز إلى بريد المشرف', msg_en: 'Code sent to admin email' };
    if (!transporter) {
        response.msg_ar = '⚙️ وضع التطوير: الكود هو ' + code;
        response.msg_en = '⚙️ Dev mode — code: ' + code;
        response.dev_code = code;
    } else if (!emailSent) {
        response.msg_ar = '❌ فشل إرسال البريد الإلكتروني، حاول مرة أخرى';
        response.msg_en = '❌ Failed to send email, try again';
    }
    res.json(response);
});

// Admin resend OTP
app.post('/api/admin/resend', async (req, res) => {
    const { username } = req.body;
    if (sanitize(username) !== ADMIN_USER) return res.status(400).json({ err_ar: 'اسم المستخدم غير صحيح', err_en: 'Invalid admin' });
    const stored = otpStore['admin:login'];
    if (!stored) return res.status(400).json({ err_ar: 'لا يوجد كود معلق', err_en: 'No pending code' });
    if (stored.expires < Date.now()) {
        delete otpStore['admin:login'];
        return res.status(400).json({ err_ar: 'انتهت الصلاحية، اطلب جديداً', err_en: 'Expired, request new' });
    }
    const text = 'رمز دخول لوحة المشرف هو: ' + stored.code + '\nالصلاحية: 2 دقيقة.';
    const sent = await sendOrLogEmail(ADMIN_EMAIL, 'رمز دخول المشرف - PSAU Portal', text, otpHtml('المشرف', stored.code, 'دقيقتان'));
    if (sent) {
        res.json({ msg_ar: 'تم إعادة الإرسال', msg_en: 'Resent' });
    } else {
        res.json({ msg_ar: '⚙️ الكود: ' + stored.code, msg_en: '⚙️ Code: ' + stored.code, dev_code: stored.code });
    }
});

// Admin verify OTP code
app.post('/api/admin/verify-code', (req, res) => {
    const { username, code } = req.body;
    if (sanitize(username) !== ADMIN_USER) {
        return res.status(400).json({ err_ar: 'اسم المستخدم غير صحيح', err_en: 'Invalid admin username' });
    }

    const sc = sanitize(code).trim();
    if (!/^\d{6}$/.test(sc)) {
        return res.status(400).json({ err_ar: 'الكود 6 أرقام', err_en: 'Code must be 6 digits' });
    }

    const stored = otpStore['admin:login'];
    if (!stored) {
        return res.status(400).json({ err_ar: 'لم يتم طلب رمز أو انتهت صلاحيته', err_en: 'No code requested or expired' });
    }
    if (stored.expires < Date.now()) {
        delete otpStore['admin:login'];
        return res.status(400).json({ err_ar: 'انتهت صلاحية الرمز (دقيقتان فقط)، اطلب واحداً جديداً', err_en: 'Code expired (2 min only), request new one' });
    }
    if (stored.code !== sc) {
        return res.status(400).json({ err_ar: 'الكود خطأ!', err_en: 'Wrong code!' });
    }

    delete otpStore['admin:login'];
    res.json({ username: ADMIN_USER, role: 'admin' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(400).json({ err_ar: 'البيانات غير صحيحة', err_en: 'Invalid credentials' });
    }
    res.json({ username, email: user.email, role: 'student', gender: user.gender, verified: !!user.verified });
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ err_ar: 'البريد الإلكتروني مطلوب', err_en: 'Email required' });
    const se = sanitize(email).trim().toLowerCase();
    const db = readDB();
    const user = db.users.find(u => u.email && u.email.toLowerCase() === se);
    if (!user) return res.status(404).json({ err_ar: 'لا يوجد حساب بهذا البريد', err_en: 'No account with this email' });

    if (!rateLimit('forgot:' + se, 1, 60000)) {
        return res.status(429).json({ err_ar: 'انتظر دقيقة قبل طلب رمز جديد', err_en: 'Wait 1 min before new code' });
    }

    const code = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000;
    const otpKey = 'reset:' + se;
    otpStore[otpKey] = { code, expires, email: se, username: user.username };

    const subject = 'إعادة تعيين كلمة المرور - جامعة الأمير سطام';
    const text = 'مرحباً ' + user.username + '،\nرمز إعادة تعيين كلمة المرور لبريدك ' + se + ' هو:\n' + code + '\nالصلاحية: 10 دقائق.';
    const html = otpHtml(user.username, code, '10 دقائق');
    const emailSent = await sendOrLogEmail(se, subject, text, html);

    const response = { msg_ar: 'تم إرسال الرمز إلى بريدك', msg_en: 'Code sent to your email', email: se.replace(/(.{3})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c) };
    if (!emailSent) {
        response.msg_ar = '⚙️ وضع التطوير: الكود هو ' + code;
        response.msg_en = '⚙️ Dev mode — code: ' + code;
        response.dev_code = code;
    }
    res.json(response);
});

app.post('/api/reset-password', (req, res) => {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return res.status(400).json({ err_ar: 'أكمل جميع البيانات', err_en: 'Fill all fields' });
    const se = sanitize(email).trim().toLowerCase();
    const sc = sanitize(code).trim();
    if (!/^\d{6}$/.test(sc)) return res.status(400).json({ err_ar: 'الكود 6 أرقام', err_en: 'Code must be 6 digits' });
    if (newPassword.length < 4) return res.status(400).json({ err_ar: 'كلمة المرور قصيرة', err_en: 'Password too short' });

    const otpKey = 'reset:' + se;
    const stored = otpStore[otpKey];
    if (!stored) return res.status(400).json({ err_ar: 'لم يتم طلب رمز أو انتهت صلاحيته', err_en: 'No code requested or expired' });
    if (stored.expires < Date.now()) {
        delete otpStore[otpKey];
        return res.status(400).json({ err_ar: 'انتهت صلاحية الرمز، اطلب واحداً جديداً', err_en: 'Code expired, request a new one' });
    }
    if (stored.code !== sc) return res.status(400).json({ err_ar: 'الكود خطأ!', err_en: 'Wrong code!' });

    delete otpStore[otpKey];
    const db = readDB();
    const user = db.users.find(u => u.email && u.email.toLowerCase() === se);
    if (user) user.password = newPassword;
    writeDB(db);

    res.json({ msg_ar: '✅ تم تغيير كلمة المرور بنجاح!', msg_en: '✅ Password reset successfully!' });
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

app.get('/api/admin/feedback', (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Forbidden' });
    if (!rateLimit('get-feedback', 30, 60000)) return res.status(429).json({ error: 'rate limit' });
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
    const feedback = (db.feedback || []).length;
    const males = db.users.filter(u => u.gender === 'طالب' || u.gender === 'male').length;
    const females = db.users.filter(u => u.gender === 'طالبة' || u.gender === 'female').length;
    const activeUsers = Object.keys(db.tasks || {}).filter(k => db.tasks[k] && db.tasks[k].length > 0).length;
    const usersWithSchedules = Object.keys(db.schedules || {}).filter(k => db.schedules[k] && db.schedules[k].length > 0).length;
    res.json({ users, tasks, schedules, feedback, males, females, activeUsers, usersWithSchedules });
});

app.get('/api/admin/users', (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Forbidden' });
    const db = readDB();
    const list = db.users.map(u => {
        const userTasks = db.tasks[u.username] || [];
        const totalTasks = userTasks.length;
        const completedTasks = userTasks.filter(t => t.completed).length;
        const scheduleCount = (db.schedules[u.username] || []).length;
        return {
            username: u.username,
            password: u.password,
            email: u.email || '',
            age: u.age,
            gender: u.gender,
            college: u.college,
            scheduleCount,
            taskCount: totalTasks,
            completedCount: completedTasks,
            completionPct: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
        };
    });
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
    const { text, description, course, type, priority } = req.body;
    const db = readDB();
    if (!db.tasks[username]) db.tasks[username] = [];
    db.tasks[username].push({ text: sanitize(text), description: sanitize(description || ''), course: sanitize(course || ''), type: sanitize(type), priority: sanitize(priority), completed: false });
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
    const list = db.schedules[req.params.username] || [];
    let changed = false;
    list.forEach(s => {
        if (!s._id) { s._id = Date.now().toString(36) + Math.random().toString(36).slice(2,6); changed = true; }
    });
    if (changed) writeDB(db);
    res.json(list);
});

app.post('/api/schedule/:username', (req, res) => {
    const { username } = req.params;
    const db = readDB();
    if (!db.schedules[username]) db.schedules[username] = [];
    const entry = { ...req.body, _id: Date.now().toString(36) + Math.random().toString(36).slice(2,6) };
    db.schedules[username].push(entry);
    writeDB(db);
    res.json({ success: true, _id: entry._id });
});

app.delete('/api/schedule/:username/:_id', (req, res) => {
    const { username, _id } = req.params;
    const db = readDB();
    if (db.schedules[username]) {
        db.schedules[username] = db.schedules[username].filter(s => s._id !== _id);
    }
    writeDB(db);
    res.json({ success: true });
});

// ====== GPA DATA ======
app.get('/api/gpa-data/:username', (req, res) => {
    const db = readDB();
    if (!db.gpaData) db.gpaData = {};
    res.json(db.gpaData[req.params.username] || []);
});

app.post('/api/gpa-data/:username', (req, res) => {
    const { username } = req.params;
    const { rows } = req.body;
    const db = readDB();
    if (!db.gpaData) db.gpaData = {};
    db.gpaData[username] = (rows || []).map(r => ({
        course: sanitize(r.course || ''),
        hours: parseInt(r.hours) || 0,
        grade: parseFloat(r.grade) || 0
    }));
    writeDB(db);
    res.json({ success: true });
});

// ====== SAVED SCHEDULES ======
app.get('/api/saved-schedules/:username', (req, res) => {
    const db = readDB();
    if (!db.savedSchedules) db.savedSchedules = {};
    res.json(db.savedSchedules[req.params.username] || []);
});

app.post('/api/saved-schedules/:username', (req, res) => {
    const { username } = req.params;
    const { name, data } = req.body;
    if (!name || !data) return res.status(400).json({ err_ar: 'الاسم والبيانات مطلوبة', err_en: 'Name and data required' });
    const db = readDB();
    if (!db.savedSchedules) db.savedSchedules = {};
    if (!db.savedSchedules[username]) db.savedSchedules[username] = [];
    db.savedSchedules[username].push({ id: Date.now().toString(), name: sanitize(name), data, savedAt: new Date().toISOString() });
    writeDB(db);
    res.json({ success: true });
});

app.delete('/api/saved-schedules/:username/:id', (req, res) => {
    const { username, id } = req.params;
    const db = readDB();
    if (!db.savedSchedules) db.savedSchedules = {};
    if (db.savedSchedules[username]) {
        db.savedSchedules[username] = db.savedSchedules[username].filter(s => s.id !== id);
    }
    writeDB(db);
    res.json({ success: true });
});

// ====== ABSENCE DATA ======
app.get('/api/absence/:username', (req, res) => {
    const db = readDB();
    if (!db.absence) db.absence = {};
    res.json(db.absence[req.params.username] || []);
});

app.post('/api/absence/:username', (req, res) => {
    const { username } = req.params;
    const { name, weekly, absent } = req.body;
    if (!name || weekly == null || absent == null) return res.status(400).json({ err_ar: 'أكمل البيانات', err_en: 'Complete data' });
    const db = readDB();
    if (!db.absence) db.absence = {};
    if (!db.absence[username]) db.absence[username] = [];
    db.absence[username].push({ id: Date.now().toString(), name: sanitize(name), weekly: parseFloat(weekly), absent: parseFloat(absent) });
    writeDB(db);
    res.json({ success: true });
});

app.patch('/api/absence/:username/:id', (req, res) => {
    const { username, id } = req.params;
    const { absent } = req.body;
    const db = readDB();
    if (!db.absence) db.absence = {};
    if (db.absence[username]) {
        const idx = db.absence[username].findIndex(a => a.id === id);
        if (idx !== -1) {
            db.absence[username][idx].absent = parseFloat(absent);
        }
    }
    writeDB(db);
    res.json({ success: true });
});

app.delete('/api/absence/:username/:id', (req, res) => {
    const { username, id } = req.params;
    const db = readDB();
    if (!db.absence) db.absence = {};
    if (db.absence[username]) {
        db.absence[username] = db.absence[username].filter(a => a.id !== id);
    }
    writeDB(db);
    res.json({ success: true });
});

// ====== HOURGLASS (COUNTDOWN) ======
app.get('/api/hourglass/:username', (req, res) => {
    const db = readDB();
    if (!db.hourglass) db.hourglass = {};
    res.json(db.hourglass[req.params.username] || []);
});

app.post('/api/hourglass/:username', (req, res) => {
    const { username } = req.params;
    const { name, targetDate } = req.body;
    if (!name || !targetDate) return res.status(400).json({ err_ar: 'الاسم والتاريخ مطلوبان', err_en: 'Name and date required' });
    const db = readDB();
    if (!db.hourglass) db.hourglass = {};
    if (!db.hourglass[username]) db.hourglass[username] = [];
    db.hourglass[username].push({ id: Date.now().toString(), name: sanitize(name), targetDate });
    writeDB(db);
    res.json({ success: true });
});

app.delete('/api/hourglass/:username/:id', (req, res) => {
    const { username, id } = req.params;
    const db = readDB();
    if (!db.hourglass) db.hourglass = {};
    if (db.hourglass[username]) {
        db.hourglass[username] = db.hourglass[username].filter(h => h.id !== id);
    }
    writeDB(db);
    res.json({ success: true });
});

// ====== SETTINGS ======
app.post('/api/settings/update', (req, res) => {
    const { currentUsername, newUsername, newPassword, newEmail } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.username === currentUsername);
    if (userIndex === -1) return res.status(404).json({ err_ar: 'خطأ', err_en: 'Error' });
    if (newUsername && newUsername !== currentUsername) {
        if (db.users.find(u => u.username === newUsername)) {
            return res.status(400).json({ err_ar: 'مأخوذ', err_en: 'Taken' });
        }
        db.tasks[newUsername] = db.tasks[currentUsername];
        db.schedules[newUsername] = db.schedules[currentUsername];
        delete db.tasks[currentUsername];
        delete db.schedules[currentUsername];
        db.users[userIndex].username = newUsername;
    }
    if (newPassword) db.users[userIndex].password = newPassword;
    writeDB(db);
    res.json({ updatedUsername: db.users[userIndex].username });
});

// Send OTP to new email for email change
app.post('/api/settings/send-new-email-code', async (req, res) => {
    const { username, newEmail } = req.body;
    if (!username || !newEmail) return res.status(400).json({ err_ar: 'أكمل البيانات', err_en: 'Fill all fields' });
    const se = sanitize(newEmail).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(se)) {
        return res.status(400).json({ err_ar: 'البريد غير صالح', err_en: 'Invalid email' });
    }
    if (!rateLimit('newemail:' + username, 1, 60000)) {
        return res.status(429).json({ err_ar: 'انتظر دقيقة قبل طلب رمز جديد', err_en: 'Wait 1 min before new code' });
    }
    const code = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000;
    const otpKey = 'newemail:' + sanitize(username);
    otpStore[otpKey] = { code, expires, newEmail: se };
    const subject = 'تغيير البريد الإلكتروني - جامعة الأمير سطام';
    const text = 'مرحباً ' + sanitize(username) + '،\nرمز تغيير البريد الإلكتروني إلى ' + se + ' هو:\n' + code + '\nالصلاحية: 10 دقائق.';
    const html = otpHtml(sanitize(username), code, '10 دقائق');
    const emailSent = await sendOrLogEmail(se, subject, text, html);
    const response = { msg_ar: 'تم إرسال الرمز إلى بريدك الجديد', msg_en: 'Code sent to your new email', email: se.replace(/(.{3})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c) };
    if (!emailSent) {
        response.msg_ar = '⚙️ وضع التطوير: الكود هو ' + code;
        response.msg_en = '⚙️ Dev mode — code: ' + code;
        response.dev_code = code;
    }
    res.json(response);
});

// Verify OTP and update email
app.post('/api/settings/verify-new-email', (req, res) => {
    const { username, code } = req.body;
    if (!username || !code) return res.status(400).json({ err_ar: 'أكمل البيانات', err_en: 'Fill all fields' });
    const su = sanitize(username);
    const sc = sanitize(code).trim();
    if (!/^\d{6}$/.test(sc)) return res.status(400).json({ err_ar: 'الكود 6 أرقام', err_en: 'Code must be 6 digits' });
    const otpKey = 'newemail:' + su;
    const stored = otpStore[otpKey];
    if (!stored) return res.status(400).json({ err_ar: 'لم يتم طلب رمز أو انتهت صلاحيته', err_en: 'No code requested or expired' });
    if (stored.expires < Date.now()) {
        delete otpStore[otpKey];
        return res.status(400).json({ err_ar: 'انتهت صلاحية الرمز، اطلب واحداً جديداً', err_en: 'Code expired, request a new one' });
    }
    if (stored.code !== sc) return res.status(400).json({ err_ar: 'الكود خطأ!', err_en: 'Wrong code!' });
    delete otpStore[otpKey];
    const db = readDB();
    const user = db.users.find(u => u.username === su);
    if (!user) return res.status(404).json({ err_ar: 'المستخدم غير موجود', err_en: 'User not found' });
    user.email = stored.newEmail;
    if (user.verified) user.verified = false;
    writeDB(db);
    res.json({ msg_ar: '✅ تم تحديث البريد بنجاح', msg_en: '✅ Email updated successfully' });
});

app.post('/api/settings/delete', (req, res) => {
    const { username } = req.body;
    let db = readDB();
    db.users = db.users.filter(u => u.username !== username);
    delete db.tasks[username];
    delete db.schedules[username];
    writeDB(db);
    res.json({ success: true });
});

// ====== EMAIL VERIFICATION (OTP) ======

// Request OTP – send 6-digit code to user's email
app.post('/api/verify-request', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ err_ar: 'اسم المستخدم مطلوب', err_en: 'Username required' });
    const db = readDB();
    const user = db.users.find(u => u.username === sanitize(username));
    if (!user) return res.status(404).json({ err_ar: 'المستخدم غير موجود', err_en: 'User not found' });
    if (!user.email) return res.status(400).json({ err_ar: 'لا يوجد بريد إلكتروني مسجل', err_en: 'No email registered' });
    if (user.verified) return res.json({ msg_ar: 'الحساب موثق مسبقاً', msg_en: 'Already verified', already: true });

    // Rate limit: max 1 OTP per 60 seconds per user
    const key = 'otp:' + user.username;
    if (!rateLimit(key, 1, 60000)) {
        return res.status(429).json({ err_ar: 'انتظر دقيقة قبل طلب رمز جديد', err_en: 'Wait 1 min before new code' });
    }

    const code = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore[key] = { code, expires, username: user.username, email: user.email };

    const subject = 'رمز توثيق حساب جامعة الأمير سطام';
    const text = 'مرحباً ' + user.username + '،\nرمز توثيق حسابك هو:\n' + code + '\nالصلاحية: 10 دقائق.';
    const html = otpHtml(user.username, code, '10 دقائق');
    const emailSent = await sendOrLogEmail(user.email, subject, text, html);
    const response = { msg_ar: 'تم إرسال الرمز إلى بريدك', msg_en: 'Code sent to your email', email: user.email.replace(/(.{3})(.*)(@.*)/, (_,a,b,c) => a + '*'.repeat(b.length) + c) };
    if (!emailSent) {
        response.msg_ar = '⚙️ وضع التطوير: الكود هو ' + code;
        response.msg_en = '⚙️ Dev mode — code: ' + code;
        response.dev_code = code;
    }
    res.json(response);
});

// Confirm OTP – verify the code
app.post('/api/verify-confirm', (req, res) => {
    const { username, code } = req.body;
    if (!username || !code) return res.status(400).json({ err_ar: 'أكمل البيانات', err_en: 'Fill all fields' });
    const su = sanitize(username);
    const sc = sanitize(code).trim();
    if (!/^\d{6}$/.test(sc)) return res.status(400).json({ err_ar: 'الكود 6 أرقام', err_en: 'Code must be 6 digits' });

    const key = 'otp:' + su;
    const stored = otpStore[key];
    if (!stored) return res.status(400).json({ err_ar: 'لم يتم طلب رمز أو انتهت صلاحيته', err_en: 'No code requested or expired' });
    if (stored.expires < Date.now()) {
        delete otpStore[key];
        return res.status(400).json({ err_ar: 'انتهت صلاحية الرمز، اطلب واحداً جديداً', err_en: 'Code expired, request a new one' });
    }
    if (stored.code !== sc) return res.status(400).json({ err_ar: 'الكود خطأ!', err_en: 'Wrong code!' });

    // Success – mark user as verified
    delete otpStore[key];
    const db = readDB();
    const user = db.users.find(u => u.username === su);
    if (user) {
        user.verified = true;
        writeDB(db);
    }
    res.json({ msg_ar: '✅ تم توثيق الحساب بنجاح!', msg_en: '✅ Account verified successfully!' });
});

// Check verification status
app.get('/api/user/:username/verified', (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.username === sanitize(req.params.username));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ verified: !!user.verified, email: user.email || '' });
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
