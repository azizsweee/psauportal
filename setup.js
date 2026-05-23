const fs = require('fs');
const path = require('path');

console.log("Upgrading PSAU Student Portal to the Ultimate Modern UI Release...");

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

const files = {
    // 1. ملف package.json
    'package.json': `{
  "name": "psau-student-portal",
  "version": "2.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "nodemailer": "^6.9.13"
  }
}`,

    // 2. ملف server.js (معالجة الشكاوى والتقييمات وإرسالها للإيميل المحدد سرياً)
    'server.js': `const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// إرسال الإيميلات سرياً إلى بريدك المبرمج المعتمد
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com', 
        pass: 'YOUR_APP_PASSWORD'     
    }
});

let verificationCodes = {};

function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], tasks: {}, schedules: {}, courses: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// تسجيل حساب
app.post('/api/register', (req, res) => {
    const { username, email, password, phone } = req.body;
    const db = readDB();

    const saudiPhoneRegex = /^9665[0-9]{8}$/;
    if (!saudiPhoneRegex.test(phone)) {
        return res.status(400).json({ 
            err_ar: 'يجب إدخال رقم جوال سعودي صحيح يبدأ بـ 9665 ومكون من 12 رقماً.',
            err_en: 'Must enter a valid Saudi mobile number starting with 9665 (12 digits total).'
        });
    }

    if (db.users.find(u => u.username === username)) {
        return res.status(400).json({ err_ar: 'اسم المستخدم مكرر.', err_en: 'Username already exists.' });
    }
    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ err_ar: 'البريد الإلكتروني مكرر.', err_en: 'Email already exists.' });
    }

    db.users.push({ username, email, password, phone });
    db.tasks[username] = [];
    db.schedules[username] = [];
    db.courses[username] = [];
    writeDB(db);
    res.json({ msg_ar: 'تم التسجيل بنجاح!', msg_en: 'Registered successfully!' });
});

// تسجيل دخول
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(400).json({ err_ar: 'البيانات غير صحيحة.', err_en: 'Invalid credentials.' });
    }
    res.json({ username });
});

// إرسال كود الاستعادة
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ err_ar: 'الحساب غير مسجل.', err_en: 'Account not found.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = { code, password: user.password };

    const mailOptions = {
        from: 'YOUR_EMAIL@gmail.com',
        to: email,
        subject: 'PSAU Verification Code',
        text: 'كود التحقق الخاص بك هو: ' + code
    };

    console.log('[Simulation] Reset Code for ' + email + ' is: ' + code);

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.json({ 
                msg_ar: 'تم توليد كود التحقق بنجاح (راجع تيرمنال VS Code لرؤيته).', 
                msg_en: 'Code generated successfully (Check VS Code Terminal to see the code).' 
            });
        }
        res.json({ msg_ar: 'تم إرسال الكود بريدياً.', msg_en: 'Code sent to email.' });
    });
});

app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;
    const record = verificationCodes[email];
    if (!record || record.code !== code) {
        return res.status(400).json({ err_ar: 'الكود خاطئ.', err_en: 'Invalid code.' });
    }
    const oldPassword = record.password;
    delete verificationCodes[email];
    res.json({ oldPassword });
});

// الشكاوى والتقييمات - إرسال آمن لإيميل المطور عبدالعزيز العنزي
app.post('/api/feedback', (req, res) => {
    const { username, rating, comment } = req.body;
    
    const mailOptions = {
        from: 'YOUR_EMAIL@gmail.com',
        to: 'abdulazizsowaankau@gmail.com', // الإيميل المطلوب سرياً
        subject: 'New Student Portal Feedback & Suggestions',
        text: 'اسم الطالب: ' + username + '\\nالتقييم: ' + rating + '/10\\nالشكوى أو الاقتراح:\\n' + comment
    };

    console.log('[Feedback Received] User: ' + username + ' | Rating: ' + rating + '/10 | Msg: ' + comment);

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.json({ 
                msg_ar: 'تم استلام اقتراحك وسجل في تيرمنال السيرفر بنجاح (سيرسل للبريد فور تهيئة السيرفر بالإيميل الفعلي).', 
                msg_en: 'Feedback logged in VS Code terminal (it will email abdulazizsowaankau@gmail.com once server credentials are set).' 
            });
        }
        res.json({ msg_ar: 'شكراً لك! تم إرسال الشكوى/الاقتراح بنجاح للمبرمج عبدالعزيز العنزي.', msg_en: 'Thank you! Sent to Programmer Abdulaziz Al-Anazi.' });
    });
});

// المهام
app.get('/api/tasks/:username', (req, res) => {
    const db = readDB();
    res.json(db.tasks[req.params.username] || []);
});

app.post('/api/tasks/:username', (req, res) => {
    const { username } = req.params;
    const db = readDB();
    if (!db.tasks[username]) db.tasks[username] = [];
    db.tasks[username].push(req.body);
    writeDB(db);
    res.json({ success: true });
});

app.delete('/api/tasks/:username/:index', (req, res) => {
    const { username, index } = req.params;
    const db = readDB();
    if (db.tasks[username]) {
        db.tasks[username].splice(index, 1);
        writeDB(db);
    }
    res.json({ success: true });
});

// الجداول
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
    if (db.schedules[username]) {
        db.schedules[username].splice(index, 1);
        writeDB(db);
    }
    res.json({ success: true });
});

// المقررات المستقلة
app.get('/api/courses/:username', (req, res) => {
    const db = readDB();
    res.json(db.courses[req.params.username] || []);
});

app.post('/api/courses/:username', (req, res) => {
    const { username } = req.params;
    const db = readDB();
    if (!db.courses[username]) db.courses[username] = [];
    
    // منع التكرار
    if (db.courses[username].includes(req.body.name)) {
        return res.status(400).json({ err_ar: 'المقرر مضاف مسبقاً.', err_en: 'Course already added.' });
    }
    
    db.courses[username].push(req.body.name);
    writeDB(db);
    res.json({ success: true });
});

app.delete('/api/courses/:username/:index', (req, res) => {
    const { username, index } = req.params;
    const db = readDB();
    if (db.courses[username]) {
        db.courses[username].splice(index, 1);
        writeDB(db);
    }
    res.json({ success: true });
});

// الإعدادات وحذف الحساب
app.post('/api/settings/update', (req, res) => {
    const { currentUsername, newUsername, newPassword } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.username === currentUsername);

    if (userIndex === -1) return res.status(404).json({ err_ar: 'خطأ', err_en: 'Error' });

    if (newUsername && newUsername !== currentUsername) {
        if (db.users.find(u => u.username === newUsername)) {
            return res.status(400).json({ err_ar: 'اليوزر مأخوذ.', err_en: 'Username taken.' });
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

app.listen(PORT, () => {
    console.log('Server is running: http://localhost:' + PORT);
});`,

    // 3. ملف واجهة الدخول (public/index.html)
    'public/index.html': `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>جامعة الأمير سطام بن عبدالعزيز | PSAU Portal</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-body">
    <div class="lang-bar">
        <button class="btn-lang" onclick="toggleLanguage()">English / العربية</button>
    </div>

    <div class="login-container">
        <div class="logo-area">
            <div class="logo-circle">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="url(#satGrad)" />
                    <path d="M30 70 L50 30 L70 70 Z" fill="white" />
                    <path d="M42 70 L50 52 L58 70 Z" fill="#0A3D62" />
                    <defs>
                        <linearGradient id="satGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#0A3D62" />
                            <stop offset="1" stop-color="#3C91E6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <h1 class="psau-logo" id="logoText">جامعة الأمير سطام بن عبدالعزيز</h1>
        </div>

        <div id="loginCard" class="card modern-card">
            <h3 id="hLogin">تسجيل الدخول</h3>
            <div class="form-group">
                <label id="lblUser">اسم المستخدم</label>
                <input type="text" id="loginUser" placeholder="Username">
            </div>
            <div class="form-group">
                <label id="lblPass">كلمة المرور</label>
                <input type="password" id="loginPass" placeholder="••••••••">
            </div>
            <button class="btn" id="btnLogin" onclick="login()">دخول</button>
            <div class="links">
                <a href="#" id="linkCreate" onclick="toggleCard('registerCard')">إنشاء حساب جديد</a> | 
                <a href="#" id="linkForgot" onclick="toggleCard('forgotCard')">نسيت الرمز؟</a>
            </div>
        </div>

        <div id="registerCard" class="card modern-card hidden">
            <h3 id="hRegister">إنشاء حساب جديد</h3>
            <div class="form-group">
                <label id="lblRegUser">اسم المستخدم</label>
                <input type="text" id="regUser" placeholder="e.g. khalidal">
            </div>
            <div class="form-group">
                <label id="lblRegEmail">البريد الإلكتروني (Gmail)</label>
                <input type="email" id="regEmail" placeholder="user@gmail.com">
            </div>
            <div class="form-group">
                <label id="lblRegPhone">رقم الجوال الشخصي (السعودي)</label>
                <input type="text" id="regPhone" placeholder="9665xxxxxxxx">
            </div>
            <div class="form-group">
                <label id="lblRegPass">كلمة المرور</label>
                <input type="password" id="regPass" placeholder="••••••••">
            </div>
            <button class="btn" id="btnRegister" onclick="register()">إنشاء الحساب</button>
            <div class="links">
                <a href="#" id="linkBack" onclick="toggleCard('loginCard')">رجوع لتسجيل الدخول</a>
            </div>
        </div>

        <div id="forgotCard" class="card modern-card hidden">
            <h3 id="hForgot">استعادة الحساب</h3>
            <div id="step1">
                <div class="form-group">
                    <label id="lblForgotEmail">اكتب بريدك الإلكتروني (Gmail)</label>
                    <input type="email" id="forgotEmail" placeholder="user@gmail.com">
                </div>
                <button class="btn" id="btnSend" onclick="sendResetCode()">إرسال كود التحقق</button>
            </div>
            <div id="step2" class="hidden">
                <div class="form-group">
                    <label id="lblEnterCode">أدخل الكود المكون من 6 أرقام</label>
                    <input type="text" id="verificationCode" placeholder="xxxxxx">
                </div>
                <button class="btn" id="btnVerify" onclick="verifyResetCode()">التحقق وإظهار الرمز</button>
            </div>
            <div id="recoveryResult" class="recovery-box hidden">
                <p class="warning-text" id="lblScreen">⚠️ لا تنسى الرمز وقم بتصوير الشاشة فوراً لحفظه!</p>
                <div class="old-pass">
                    <span id="lblOldPass">رمزك القديم هو:</span> <strong id="oldPasswordText"></strong>
                </div>
            </div>
            <div class="links">
                <a href="#" id="linkBackLogin" onclick="toggleCard('loginCard')">رجوع</a>
            </div>
        </div>

        <footer class="footer-rights">
            <span id="lblRights">المبرمج عبدالعزيز العنزي</span>
        </footer>
    </div>
    <script src="app.js"></script>
</body>
</html>`,

    // 4. ملف لوحة التحكم الموحدة بمقررات مستقلة، وثيمات الجدول، والشكاوى والتقييمات (public/dashboard.html)
    'public/dashboard.html': `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بوابة الطلاب الموحدة | Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="dash-body" onload="checkAuth(); initDash();">
    
    <button class="menu-btn" onclick="toggleMenu()">☰</button>

    <div class="sidebar" id="sidebar">
        <div class="sidebar-brand" onclick="switchTab('hub')" title="الصفحة الرئيسية">
            <div class="brand-logo">
                <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="url(#sidebarGrad)" />
                    <path d="M30 70 L50 30 L70 70 Z" fill="white" />
                    <path d="M42 70 L50 52 L58 70 Z" fill="#0A3D62" />
                    <defs>
                        <linearGradient id="sidebarGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#3C91E6" />
                            <stop offset="1" stop-color="#ffffff" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <span class="brand-text">PSAU Portal</span>
            <span id="userDisp" class="user-pill">...</span>
        </div>
        <ul class="nav">
            <li><a href="#" id="mHub" onclick="switchTab('hub')" class="active">🏠 البوابة الموحدة</a></li>
            <li><a href="#" id="mTasks" onclick="switchTab('tasks')">📝 المهام</a></li>
            <li><a href="#" id="mGpa" onclick="switchTab('gpa')">📊 المعدلات</a></li>
            <li><a href="#" id="mSchedule" onclick="switchTab('schedule')">📅 الجدول الدراسي</a></li>
            <li><a href="#" id="mCourses" onclick="switchTab('courses')">📚 المقررات</a></li>
            <li><a href="#" id="mFeedback" onclick="switchTab('feedback')">💬 الشكاوى والآراء</a></li>
            <li><a href="#" id="mSettings" onclick="switchTab('settings')">⚙️ الإعدادات</a></li>
            <li><button class="btn-lang-dash" onclick="toggleLanguage()">English / العربية</button></li>
            <li><a href="#" id="mLogout" onclick="logout()" class="logout">🚪 خروج</a></li>
        </ul>

        <footer class="footer-rights-sidebar">
            <span id="lblRights">المبرمج عبدالعزيز العنزي</span>
        </footer>
    </div>

    <div class="content" onclick="closeMenu()">
        
        <!-- صفحة البوابة الموحدة (Hub) -->
        <div id="hub" class="tab animate-slide">
            <h2 id="hubWelcome">مرحباً بك في البوابة الطلابية الموحدة</h2>
            <p style="color:var(--text-muted); margin-bottom: 25px;" id="hubSub">اختر الخدمة التي تود الانتقال إليها لتفتح لك في شاشة مستقلة متكاملة:</p>
            <div class="hub-grid">
                <div class="hub-card" onclick="switchTab('tasks')">
                    <div class="hub-icon">📝</div>
                    <h3 id="hubTasksTitle">إدارة المهام والدراسة</h3>
                    <p id="hubTasksDesc">متابعة الواجبات، الاختبارات وتصنيفها حسب الأولوية الملونة.</p>
                </div>
                <div class="hub-card" onclick="switchTab('gpa')">
                    <div class="hub-icon">📊</div>
                    <h3 id="hubGpaTitle">حاسبة المعدل الجامعي</h3>
                    <p id="hubGpaDesc">احتساب المعدل الفصلي والتراكمي بطريقة عصرية وسلسة.</p>
                </div>
                <div class="hub-card" onclick="switchTab('schedule')">
                    <div class="hub-icon">📅</div>
                    <h3 id="hubSchedTitle">جدول المحاضرات</h3>
                    <p id="hubSchedDesc">تنظيم محاضراتك بـ 3 قوالب تفاعلية أنيقة وتصميم وقت مخصص.</p>
                </div>
                <div class="hub-card" onclick="switchTab('courses')">
                    <div class="hub-icon">📚</div>
                    <h3 id="hubCoursesTitle">مركز المقررات المستقلة</h3>
                    <p id="hubCoursesDesc">مركز ذكي لكل مقرر يعرض جدول محاضراته ومهامه بشكل مفرد ومنعزل.</p>
                </div>
                <div class="hub-card" onclick="switchTab('feedback')">
                    <div class="hub-icon">💬</div>
                    <h3 id="hubFeedTitle">الشكاوى والاقتراحات والتقييم</h3>
                    <p id="hubFeedDesc">تواصل آمن مع المبرمج لتقييم المنصة وإرسال رأيك سرياً.</p>
                </div>
                <div class="hub-card" onclick="switchTab('settings')">
                    <div class="hub-icon">⚙️</div>
                    <h3 id="hubSetTitle">إعدادات الحساب</h3>
                    <p id="hubSetDesc">تحديث يوزر الدخول ورمز المرور الخاص بك أو حذف الحساب.</p>
                </div>
            </div>
        </div>

        <!-- المهام مستقلة -->
        <div id="tasks" class="tab hidden animate-slide">
            <div class="header-inline">
                <button class="back-btn" onclick="switchTab('hub')">← البوابة الرئيسية</button>
                <h2 id="titleTasks">📝 نظام إدارة المهام</h2>
            </div>
            <div class="card modern-card">
                <h4 id="hAddTask">إضافة مهمة جديدة</h4>
                <div class="grid-inputs">
                    <input type="text" id="taskText" placeholder="اكتب المهمة أو الواجب...">
                    <select id="taskPriority">
                        <option value="urgent" id="pUrgent">🔴 عاجل جداً (Urgent)</option>
                        <option value="important" id="pImportant">⚠️ هام (Important)</option>
                        <option value="normal" id="pNormal" selected>🔵 اعتيادي (Normal)</option>
                    </select>
                    <select id="taskType">
                        <option value="daily" id="oDaily">يومية</option>
                        <option value="weekly" id="oWeekly">أسبوعية</option>
                        <option value="monthly" id="oMonthly">شهرية</option>
                        <option value="general" id="oGeneral">عامة</option>
                    </select>
                    <button class="btn" id="btnAddTask" onclick="addTask()">إضافة</button>
                </div>
            </div>
            <div class="tasks-container">
                <div class="col"><h4 id="cDaily">اليومية</h4><ul id="list-daily"></ul></div>
                <div class="col"><h4 id="cWeekly">الأسبوعية</h4><ul id="list-weekly"></ul></div>
                <div class="col"><h4 id="cMonthly">الشهرية</h4><ul id="list-monthly"></ul></div>
                <div class="col"><h4 id="cGeneral">عامة</h4><ul id="list-general"></ul></div>
            </div>
        </div>

        <!-- المعدل مستقلة -->
        <div id="gpa" class="tab hidden animate-slide">
            <div class="header-inline">
                <button class="back-btn" onclick="switchTab('hub')">← البوابة الرئيسية</button>
                <h2 id="titleGpa">📊 حاسبة المعدلات الذكية</h2>
            </div>
            
            <div class="gpa-toggle-container">
                <button class="tab-toggle-btn active" id="gpaSemTab" onclick="toggleGpaMode('semester')">الفصلي الحالي</button>
                <button class="tab-toggle-btn" id="gpaCumTab" onclick="toggleGpaMode('cumulative')">التراكمي العام</button>
            </div>

            <!-- المعدل الفصلي -->
            <div id="semesterGpaBox" class="card modern-card">
                <h3 id="lblSemTitle">حساب المعدل الفصلي</h3>
                <div id="gpa-rows">
                    <div class="gpa-row card-row">
                        <input type="text" placeholder="Course / المقرر" class="course-name">
                        <input type="number" class="hours" placeholder="S / الساعات">
                        <select class="grade">
                            <option value="5.00">A+ (5.0)</option>
                            <option value="4.75">A (4.75)</option>
                            <option value="4.50">B+ (4.5)</option>
                            <option value="4.00">B (4.0)</option>
                            <option value="3.50">C+ (3.5)</option>
                            <option value="3.00">C (3.0)</option>
                            <option value="2.50">D+ (2.5)</option>
                            <option value="2.00">D (2.0)</option>
                            <option value="0.00">F (0.0)</option>
                        </select>
                        <button class="delete-row-btn" onclick="this.parentElement.remove()">✕</button>
                    </div>
                </div>
                <div class="gpa-actions">
                    <button class="btn secondary" id="btnAddRow" onclick="addGpaRow()">+ إضافة مقرر جديد</button>
                    <button class="btn" id="btnCalc" onclick="calculateGPA()">احسب الفصلي</button>
                </div>
                <div class="result-box hidden" id="gpaResult">
                    <span id="lblRes">المعدل الفصلي:</span> <strong id="gpaVal">0.00</strong>
                </div>
            </div>

            <!-- المعدل التراكمي -->
            <div id="cumulativeGpaBox" class="card modern-card hidden">
                <h3 id="lblCumTitle">حساب المعدل التراكمي الشامل</h3>
                <div class="form-group">
                    <label id="lblPrevGpa">المعدل التراكمي السابق (GPA)</label>
                    <input type="number" id="prevGpa" placeholder="4.45" step="0.01" max="5">
                </div>
                <div class="form-group">
                    <label id="lblPrevHours">إجمالي الساعات المكتسبة السابقة</label>
                    <input type="number" id="prevHours" placeholder="60">
                </div>
                <div class="form-group">
                    <label id="lblCurrGpa">معدل الفصل الحالي المتوقع/الفعلي</label>
                    <input type="number" id="currGpa" placeholder="4.80" step="0.01" max="5">
                </div>
                <div class="form-group">
                    <label id="lblCurrHours">ساعات الفصل الحالي</label>
                    <input type="number" id="currHours" placeholder="15">
                </div>
                <button class="btn" id="btnCalcCum" onclick="calculateCumulativeGPA()">احسب التراكمي العام</button>
                <div class="result-box hidden" id="gpaCumResult">
                    <span id="lblCumRes">المعدل التراكمي الجديد:</span> <strong id="gpaCumVal">0.00</strong>
                </div>
            </div>
        </div>

        <!-- الجدول الدراسي مستقلة -->
        <div id="schedule" class="tab hidden animate-slide">
            <div class="header-inline">
                <button class="back-btn" onclick="switchTab('hub')">← البوابة الرئيسية</button>
                <h2 id="titleSchedule">📅 جدول المحاضرات الأسبوعي</h2>
            </div>
            
            <!-- أداة اختيار القالب/الثيم للجدول -->
            <div class="template-selector-container">
                <span id="lblSelectTheme" style="font-weight:bold; color:var(--primary);">قالب الجدول المفضل:</span>
                <div class="theme-chips">
                    <span class="theme-chip active" id="theme-grid" onclick="changeScheduleTheme('grid')">شبكي مبسط</span>
                    <span class="theme-chip" id="theme-timeline" onclick="changeScheduleTheme('timeline')">مخطط زمني</span>
                    <span class="theme-chip" id="theme-colorful" onclick="changeScheduleTheme('colorful')">بطاقات ملونة</span>
                </div>
            </div>

            <div class="card modern-card">
                <h4 id="hAddLecture">إضافة محاضرة جديدة</h4>
                <div class="grid-inputs">
                    <input type="text" id="schedSub" placeholder="اسم المقرر">
                    
                    <!-- تمرير أفقي أنيق لاختيار اليوم بدلاً من السيلكت التقليدي -->
                    <div class="custom-chips-scroll" id="dayScrollSelect">
                        <span class="scroll-chip active" data-day="Sunday">الأحد</span>
                        <span class="scroll-chip" data-day="Monday">الإثنين</span>
                        <span class="scroll-chip" data-day="Tuesday">الثلاثاء</span>
                        <span class="scroll-chip" data-day="Wednesday">الأربعاء</span>
                        <span class="scroll-chip" data-day="Thursday">الخميس</span>
                    </div>

                    <div class="time-picker-styled">
                        <input type="time" id="schedFrom">
                        <span>إلى</span>
                        <input type="time" id="schedTo">
                    </div>
                    <button class="btn" id="btnAddLecture" onclick="addSchedule()">حفظ</button>
                </div>
            </div>

            <!-- لوحة عرض الجدول المتجاوبة مع الثيم النشط -->
            <div class="schedule-grid theme-grid-layout" id="scheduleContainer">
                <div class="day-box" id="Sunday"><h5 id="hSun">الأحد</h5><ul></ul></div>
                <div class="day-box" id="Monday"><h5 id="hMon">الإثنين</h5><ul></ul></div>
                <div class="day-box" id="Tuesday"><h5 id="hTue">الثلاثاء</h5><ul></ul></div>
                <div class="day-box" id="Wednesday"><h5 id="hWed">الأربعاء</h5><ul></ul></div>
                <div class="day-box" id="Thursday"><h5 id="hThu">الخميس</h5><ul></ul></div>
            </div>
        </div>

        <!-- المقررات الدراسية المستقلة تفاعلياً -->
        <div id="courses" class="tab hidden animate-slide">
            <div class="header-inline">
                <button class="back-btn" onclick="switchTab('hub')">← البوابة الرئيسية</button>
                <h2 id="titleCourses">📚 مركز المقررات الذكي</h2>
            </div>
            
            <div class="card modern-card">
                <h4 id="hAddCourse">تسجيل مقرر أكاديمي جديد للرصد</h4>
                <div class="grid-inputs" style="position:relative;">
                    <input type="text" id="courseInputName" placeholder="اكتب اسم المقرر..." oninput="handleCourseAutocomplete(this.value)">
                    <button class="btn" id="btnAddCourse" onclick="addCourse()">تسجيل المقرر</button>
                    <!-- منبثقة الاقتراحات التلقائية الذكية لمنع الخطأ الإملائي -->
                    <div class="autocomplete-dropdown hidden" id="autoSuggestBox"></div>
                </div>
            </div>

            <div class="courses-layout-grid">
                <!-- قائمة المواد المضافة -->
                <div class="courses-sidebar-list">
                    <h4 id="lblMyCourses">مقرراتي المسجلة</h4>
                    <ul class="clean-list" id="myCoursesList"></ul>
                </div>
                <!-- تفاصيل المادة المستقلة (المحاضرات + المهام) تظهر هنا ديناميكياً -->
                <div class="course-details-display" id="courseDetailsPanel">
                    <div class="empty-state-details" id="emptyStateCourse">
                        <span style="font-size:40px;">📚</span>
                        <p id="lblSelectCourseHint">اختر مقرراً من القائمة الجانبية لعرض أوقاته ومحاضراته ومهامه المنفصلة.</p>
                    </div>
                    <div class="details-content-box hidden" id="courseDetailsContent">
                        <div class="details-header">
                            <h3 id="courseDetailTitle">اسم المادة</h3>
                            <button class="btn-delete-course" onclick="deleteActiveCourse()">حذف المقرر نهائياً</button>
                        </div>
                        <div class="details-body-grid">
                            <div class="detail-sec">
                                <h4 id="lblCourseTimes">📅 أوقات المحاضرات بالجدول</h4>
                                <ul class="clean-list" id="courseTimesList"></ul>
                            </div>
                            <div class="detail-sec">
                                <h4 id="lblCourseTasks">📝 المهام والواجبات المرتبطة</h4>
                                <ul class="clean-list" id="courseTasksList"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- الشكاوى والاقتراحات مستقلة -->
        <div id="feedback" class="tab hidden animate-slide">
            <div class="header-inline">
                <button class="back-btn" onclick="switchTab('hub')">← البوابة الرئيسية</button>
                <h2 id="titleFeedback">💬 الشكاوى والاقتراحات والتقييمات</h2>
            </div>
            <div class="card modern-card">
                <h3 id="lblSendOpinion">إرسال رأي سري للمطور عبدالعزيز العنزي</h3>
                <p style="color:var(--text-muted); font-size:12px; margin-bottom:15px;" id="feedbackDesc">آراؤك واقتراحاتك ستصل مباشرة بشكل آمن وإلكتروني دون كشف حساب بريدك أو إيميل المطور للمستخدمين الآخرين.</p>
                
                <!-- نظام التقييم التفاعلي بالايموجي من 10 نقاط -->
                <div class="rating-box-styled">
                    <label id="lblRate">تقييمك للمنصة والخدمات:</label>
                    <div class="slider-container">
                        <input type="range" id="ratingRange" min="1" max="10" value="8" oninput="updateEmoji(this.value)">
                        <div class="emoji-display">
                            <span id="emojiPic">🙂</span>
                            <span id="ratingVal">8 / 10</span>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label id="lblYourComment">رسالتك أو اقتراحك أو الشكوى بالتفصيل (إجباري)</label>
                    <textarea id="feedbackComment" rows="5" placeholder="اكتب اقتراحك أو الشكوى هنا بالتفصيل (يجب ملء هذا الحقل لتتمكن من الإرسال)..."></textarea>
                </div>
                <button class="btn" id="btnSendFeedback" onclick="submitFeedback()">إرسال الشكوى/الاقتراح</button>
            </div>
        </div>

        <!-- الإعدادات مستقلة -->
        <div id="settings" class="tab hidden animate-slide">
            <div class="header-inline">
                <button class="back-btn" onclick="switchTab('hub')">← البوابة الرئيسية</button>
                <h2 id="titleSettings">⚙️ الإعدادات</h2>
            </div>
            <div class="card modern-card">
                <h4 id="hUpdate">تحديث الحساب</h4>
                <div class="form-group">
                    <label id="lNewUser">اسم مستخدم جديد</label>
                    <input type="text" id="setNewUser" placeholder="New Username">
                </div>
                <div class="form-group">
                    <label id="lNewPass">كلمة مرور جديدة</label>
                    <input type="password" id="setNewPass" placeholder="••••••••">
                </div>
                <button class="btn" id="btnUpdate" onclick="updateSettings()">حفظ التحديث</button>
            </div>
            <div class="card danger-border">
                <h4 style="color:#b32d2d;" id="hDelete">منطقة الخطر</h4>
                <p id="pDeleteDesc">حذف الحساب نهائياً من النظام ومسح جميع المهام والجدول والمقررات.</p>
                <button class="btn danger" id="btnDelete" onclick="deleteAccount()">حذف الحساب</button>
            </div>
        </div>
    </div>
    <script src="app.js"></script>
</body>
</html>`,

    // 5. ملف التنسيقات المتجاوبة العصري والمذهل (public/style.css)
    'public/style.css': `:root {
    --primary: #0A3D62;      /* كحلي فخم للجامعة */
    --secondary: #3C91E6;    /* سماوي ساطع وعصري */
    --accent: #E2F0FD;       /* خلفيات زرقاء خفيفة */
    --bg: #F5F8FA;           /* خلفية الموقع الأساسية */
    --white: #ffffff;
    --danger: #d9534f;
    --warning-orange: #f0ad4e;
    --success-green: #5cb85c;
    --text: #2C3E50;
    --text-muted: #7F8C8D;
    --border: #E2E8F0;
    --radius-lg: 16px;
    --radius-md: 10px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

body {
    background-color: var(--bg);
    color: var(--text);
    direction: rtl;
}

body.en {
    direction: ltr;
}

.login-body {
    background: linear-gradient(135deg, #F5F8FA 0%, #E2F0FD 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.lang-bar {
    display: flex;
    justify-content: flex-end;
    padding: 15px;
}

.btn-lang {
    background: var(--white);
    border: 1.5px solid var(--secondary);
    color: var(--primary);
    padding: 8px 18px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    font-size: 13px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-lang:hover {
    background: var(--secondary);
    color: var(--white);
    box-shadow: 0 4px 10px rgba(60, 145, 230, 0.25);
}

.login-container {
    max-width: 460px;
    margin: auto;
    width: 100%;
    padding: 15px;
}

.logo-area {
    text-align: center;
    margin-bottom: 25px;
}

.logo-circle {
    display: inline-flex;
    margin-bottom: 12px;
}

.psau-logo {
    color: var(--primary);
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
}

.modern-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 30px;
    box-shadow: 0 10px 25px rgba(10, 61, 98, 0.05);
    border: 1px solid rgba(10, 61, 98, 0.02);
    transition: all 0.3s ease;
}

.modern-card:hover {
    box-shadow: 0 15px 35px rgba(10, 61, 98, 0.08);
}

h3 {
    margin-bottom: 20px;
    color: var(--primary);
    font-size: 18px;
    font-weight: 700;
    border-bottom: 2px solid var(--accent);
    padding-bottom: 12px;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    font-weight: 700;
    font-size: 13px;
    margin-bottom: 6px;
    color: var(--primary);
}

input[type="text"], 
input[type="password"], 
input[type="email"], 
input[type="number"], 
select, 
input[type="time"] {
    width: 100%;
    padding: 12px 16px;
    border: 2.2px solid var(--border);
    border-radius: var(--radius-md);
    background-color: var(--white);
    font-size: 14px;
    outline: none;
    color: var(--text);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

input:focus, select:focus {
    border-color: var(--secondary);
    box-shadow: 0 0 0 4px rgba(60, 145, 230, 0.15);
}

textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2.2px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 14px;
    outline: none;
    resize: none;
    transition: all 0.3s ease;
}

textarea:focus {
    border-color: var(--secondary);
    box-shadow: 0 0 0 4px rgba(60, 145, 230, 0.15);
}

.btn {
    width: 100%;
    padding: 12px;
    background: var(--primary);
    color: var(--white);
    border: none;
    border-radius: var(--radius-md);
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(10, 61, 98, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover {
    background: var(--secondary);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(60, 145, 230, 0.3);
}

.btn.secondary { 
    background: var(--white); 
    color: var(--primary);
    border: 1.5px solid var(--primary);
    box-shadow: none;
    margin-bottom: 12px;
}
.btn.secondary:hover {
    background: var(--accent);
    color: var(--primary);
}

.btn.danger { background: var(--danger); box-shadow: none;}
.btn.danger:hover { background: #b52b27; box-shadow: 0 4px 12px rgba(217, 83, 79, 0.3);}
.danger-border { border: 1.5px solid var(--danger); margin-top: 25px; }

.links {
    margin-top: 20px;
    text-align: center;
    font-size: 13px;
}

.links a {
    color: var(--secondary);
    text-decoration: none;
    font-weight: 700;
}

/* لوحة البوابة الموحدة */
.dash-body {
    display: flex;
    height: 100vh;
    background-color: var(--bg);
}

.sidebar {
    width: 270px;
    background: var(--primary);
    color: var(--white);
    padding: 25px 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 15px rgba(10, 61, 98, 0.05);
}

.sidebar-brand {
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding-bottom: 20px;
    margin-bottom: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.sidebar-brand:hover {
    transform: scale(1.03);
}

.brand-text {
    font-weight: 800;
    font-size: 18px;
    color: var(--white);
    display: block;
    margin-bottom: 5px;
}

.user-pill {
    background: rgba(255,255,255,0.12);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: bold;
    color: var(--secondary);
}

.nav {
    list-style: none;
}

.nav li { margin-bottom: 10px; }
.nav a {
    color: var(--white);
    text-decoration: none;
    padding: 12px 16px;
    display: block;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav a.active, .nav a:hover {
    background: var(--secondary);
    color: var(--white);
    box-shadow: 0 4px 12px rgba(60, 145, 230, 0.25);
}

.btn-lang-dash {
    background: transparent;
    color: var(--white);
    border: 1px solid rgba(255,255,255,0.3);
    padding: 8px;
    width: 100%;
    border-radius: var(--radius-md);
    margin-top: 15px;
    font-weight: bold;
    cursor: pointer;
}

.logout { background: var(--danger) !important; text-align: center; margin-top: 35px;}

.content {
    flex: 1;
    padding: 35px;
    overflow-y: auto;
}

.menu-btn {
    display: none;
    position: fixed;
    top: 15px;
    right: 15px;
    background: var(--primary);
    color: var(--white);
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    z-index: 1000;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(10, 61, 98, 0.2);
}

.hidden { display: none !important; }

/* شبكة البوابة الموحدة الرائعة */
.hub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 15px;
}

.hub-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 30px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.02);
    cursor: pointer;
    border: 1px solid rgba(0,0,0,0.01);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
}

.hub-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 35px rgba(10, 61, 98, 0.08);
    border-color: var(--secondary);
}

.hub-icon {
    font-size: 32px;
    margin-bottom: 15px;
}

.hub-card h3 {
    color: var(--primary);
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
}

.hub-card p {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
}

/* زر الرجوع للبوابة الرئيسية */
.header-inline {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
}

.back-btn {
    background: var(--accent);
    color: var(--primary);
    border: none;
    padding: 10px 18px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: var(--secondary);
    color: var(--white);
}

/* ألوان تصنيفات المهام المتعددة */
.priority-tag {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: bold;
    color: var(--white);
}
.tag-urgent { background: var(--danger); }
.tag-important { background: var(--warning-orange); }
.tag-normal { background: var(--secondary); }

/* حاسبة المعدل التراكمي */
.gpa-toggle-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tab-toggle-btn {
    background: var(--white);
    border: 1.5px solid var(--border);
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    font-size: 13px;
    transition: all 0.3s ease;
}

.tab-toggle-btn.active {
    background: var(--primary);
    color: var(--white);
    border-color: var(--primary);
}

/* ممرر الأيام الأفقي للجدول */
.custom-chips-scroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 8px 0;
    width: 100%;
    scrollbar-width: thin;
}

.scroll-chip {
    background: var(--white);
    border: 1.5px solid var(--border);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
}

.scroll-chip.active {
    background: var(--secondary);
    color: var(--white);
    border-color: var(--secondary);
}

/* اختيار قالب وثيمات الجدول */
.template-selector-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.theme-chips {
    display: flex;
    gap: 10px;
}

.theme-chip {
    background: var(--white);
    border: 1.5px solid var(--border);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.theme-chip.active {
    background: var(--primary);
    color: var(--white);
    border-color: var(--primary);
}

/* أنماط الجدول (Themes) */
/* الثيم الشبكي المبسط */
.schedule-grid.theme-grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
}

/* ثيم المخطط الزمني */
.schedule-grid.theme-timeline-layout {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.schedule-grid.theme-timeline-layout .day-box {
    border-top: none;
    border-right: 5px solid var(--secondary);
}

/* ثيم البطاقات الملونة */
.schedule-grid.theme-colorful-layout .day-box {
    background: linear-gradient(135deg, var(--white) 0%, var(--accent) 100%);
    border-top: 5px solid var(--primary);
}

.day-box {
    background: var(--white);
    padding: 15px;
    border-radius: var(--radius-lg);
    border-top: 5px solid var(--secondary);
    box-shadow: 0 4px 15px rgba(10, 61, 98, 0.03);
}

.day-box h5 { text-align: center; color: var(--primary); margin-bottom: 12px; font-weight: 700; font-size: 14px;}
.day-box ul { list-style: none; }
.day-box li {
    padding: 8px 10px;
    background: var(--bg);
    margin-bottom: 8px;
    border-radius: var(--radius-md);
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
}

/* المقررات المستقلة وأداة الإكمال التلقائي */
.courses-layout-grid {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 20px;
    margin-top: 20px;
}

@media (max-width: 768px) {
    .courses-layout-grid {
        grid-template-columns: 1fr;
    }
}

.courses-sidebar-list {
    background: var(--white);
    padding: 20px;
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.courses-sidebar-list h4 {
    color: var(--primary);
    margin-bottom: 15px;
    font-size: 14px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
}

.clean-list {
    list-style: none;
}

.clean-list li {
    padding: 10px;
    background: var(--bg);
    margin-bottom: 8px;
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.clean-list li:hover, .clean-list li.active {
    background: var(--secondary);
    color: var(--white);
}

.course-details-display {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 30px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    min-height: 300px;
}

.empty-state-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted);
    text-align: center;
    gap: 15px;
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--accent);
    padding-bottom: 15px;
    margin-bottom: 20px;
}

.btn-delete-course {
    background: transparent;
    border: 1px solid var(--danger);
    color: var(--danger);
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 11px;
    font-weight: bold;
    transition: all 0.3s ease;
}

.btn-delete-course:hover {
    background: var(--danger);
    color: var(--white);
}

.details-body-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
}

.detail-sec h4 {
    color: var(--primary);
    margin-bottom: 12px;
    font-size: 13px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 5px;
}

.autocomplete-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
}

.autocomplete-item {
    padding: 10px 15px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
}

.autocomplete-item:hover {
    background: var(--accent);
    color: var(--primary);
}

/* الشكاوى والتقييم */
.rating-box-styled {
    background: var(--accent);
    padding: 20px;
    border-radius: var(--radius-md);
    margin-bottom: 20px;
}

.slider-container {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
}

.slider-container input[type="range"] {
    flex: 1;
    height: 6px;
    background: var(--white);
    outline: none;
    border-radius: 10px;
    cursor: pointer;
}

.emoji-display {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--white);
    padding: 8px 16px;
    border-radius: 20px;
}

#emojiPic {
    font-size: 32px;
}

#ratingVal {
    font-weight: 800;
    color: var(--primary);
}

.footer-rights {
    text-align: center;
    font-size: 9px;
    color: #7f8c8d;
    padding: 15px 0;
    opacity: 0.65;
    width: 100%;
    margin-top: auto;
    font-weight: bold;
}

.footer-rights-sidebar {
    text-align: center;
    font-size: 9px;
    color: rgba(255, 255, 255, 0.45);
    margin-top: auto;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-weight: bold;
}

/* انتقالات ناعمة وحركات الظهور */
.animate-slide {
    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.time-picker-styled {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--white);
    border: 2.2px solid var(--border);
    border-radius: var(--radius-md);
    padding: 5px 12px;
    flex: 1;
    min-width: 200px;
}

.time-picker-styled input[type="time"] {
    border: none;
    padding: 5px;
    background: transparent;
    width: auto;
}

.time-picker-styled span {
    font-size: 12px;
    color: var(--primary);
    font-weight: bold;
}

.gpa-row select {
    max-width: 120px;
}

/* الحذف الفردي للمقررات */
.course-row-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

@media (max-width: 768px) {
    .dash-body {
        flex-direction: column;
    }
    .sidebar {
        position: fixed;
        right: -270px;
        top: 0;
        height: 100vh;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: -5px 0 15px rgba(0,0,0,0.1);
    }
    body.en .sidebar {
        right: auto;
        left: -270px;
    }
    .sidebar.active {
        right: 0;
    }
    body.en .sidebar.active {
        left: 0;
    }
    .menu-btn {
        display: block;
    }
    .content {
        padding: 75px 15px 15px;
    }
}
`,

    // 6. ملف الواجهة البرمجية التفاعلية مع دعم الترجمة وحفظ المقررات ومظهر التقييم بالايموجي (public/app.js)
    'public/app.js': `const translations = {
    ar: {
        logoText: "جامعة الأمير سطام بن عبدالعزيز",
        hLogin: "تسجيل الدخول", lblUser: "اسم المستخدم", lblPass: "كلمة المرور", btnLogin: "دخول",
        linkCreate: "إنشاء حساب جديد", linkForgot: "نسيت الرمز؟", hRegister: "إنشاء حساب جديد",
        lblRegUser: "اسم المستخدم", lblRegEmail: "البريد الإلكتروني (Gmail)", lblRegPhone: "رقم الجوال الشخصي (السعودي)",
        lblRegPass: "كلمة المرور",
        btnRegister: "إنشاء الحساب", linkBack: "رجوع لتسجيل الدخول", hForgot: "استعادة الحساب",
        lblForgotEmail: "اكتب بريدك الإلكتروني (Gmail)", btnSend: "إرسال كود التحقق", lblEnterCode: "أدخل الكود المكون من 6 أرقام",
        btnVerify: "التحقق وإظهار الرمز", lblScreen: "⚠️ لا تنسى الرمز وقم بتصوير الشاشة فوراً لحفظه!",
        lblOldPass: "رمزك القديم هو:", linkBackLogin: "رجوع",
        titleTasks: "📝 نظام إدارة المهام", hAddTask: "إضافة مهمة جديدة", btnAddTask: "إضافة",
        oDaily: "يومية", oWeekly: "أسبوعية", oMonthly: "شهرية", oGeneral: "عامة",
        cDaily: "اليومية", cWeekly: "الأسبوعية", cMonthly: "الشهرية", cGeneral: "عامة",
        titleGpa: "📊 حاسبة المعدلات الذكية", btnAddRow: "+ إضافة مقرر جديد", btnCalc: "احسب الفصلي",
        lblRes: "المعدل الفصلي:", titleSchedule: "📅 جدول المحاضرات الأسبوعي", hAddLecture: "إضافة محاضرة جديدة",
        daySun: "الأحد", dayMon: "الإثنين", dayTue: "الثلاثاء", dayWed: "الأربعاء", dayThu: "الخميس",
        hSun: "الأحد", hMon: "الإثنين", hTue: "الثلاثاء", hWed: "الأربعاء", hThu: "الخميس",
        btnAddLecture: "حفظ", titleSettings: "⚙️ الإعدادات", hUpdate: "تحديث الحساب",
        lNewUser: "اسم مستخدم جديد", lNewPass: "كلمة مرور جديدة", btnUpdate: "حفظ التحديث",
        hDelete: "منطقة الخطر", pDeleteDesc: "حذف الحساب نهائياً من النظام ومسح جميع المهام والجدول والمقررات.", btnDelete: "حذف الحساب",
        mHub: "🏠 البوابة الموحدة", mTasks: "📝 المهام", mGpa: "📊 المعدل", mSchedule: "📅 الجدول", mCourses: "📚 المقررات", mFeedback: "💬 الشكاوى والآراء", mSettings: "⚙️ الإعدادات", mLogout: "🚪 خروج",
        lblRights: "المبرمج عبدالعزيز العنزي",
        hubWelcome: "مرحباً بك في البوابة الطلابية الموحدة",
        hubSub: "اختر الخدمة التي تود الانتقال إليها لتفتح لك في شاشة مستقلة متكاملة:",
        hubTasksTitle: "إدارة المهام والدراسة", hubTasksDesc: "متابعة الواجبات، الاختبارات وتصنيفها حسب الأولوية الملونة.",
        hubGpaTitle: "حاسبة المعدل الجامعي", hubGpaDesc: "احتساب المعدل الفصلي والتراكمي بطريقة عصرية وسلسة.",
        hubSchedTitle: "جدول المحاضرات", hubSchedDesc: "تنظيم محاضراتك بـ 3 قوالب تفاعلية أنيقة وتصميم وقت مخصص.",
        hubCoursesTitle: "مركز المقررات المستقلة", hubCoursesDesc: "مركز ذكي لكل مقرر يعرض جدول محاضراته ومهامه بشكل مفرد ومنعزل.",
        hubFeedTitle: "الشكاوى والاقتراحات والتقييم", hubFeedDesc: "تواصل آمن مع المبرمج لتقييم المنصة وإرسال رأيك سرياً.",
        hubSetTitle: "إعدادات الحساب", hubSetDesc: "تعديل بيانات الدخول الخاصة بك أو حذف الحساب.",
        lblSelectTheme: "قالب الجدول المفضل:",
        gpaSemTab: "الفصلي الحالي", gpaCumTab: "التراكمي العام",
        lblSemTitle: "حساب المعدل الفصلي", lblCumTitle: "حساب المعدل التراكمي الشامل",
        lblPrevGpa: "المعدل التراكمي السابق (GPA)", lblPrevHours: "إجمالي الساعات المكتسبة السابقة",
        lblCurrGpa: "معدل الفصل الحالي المتوقع/الفعلي", lblCurrHours: "ساعات الفصل الحالي",
        btnCalcCum: "احسب التراكمي العام", lblCumRes: "المعدل التراكمي الجديد:",
        hAddCourse: "تسجيل مقرر أكاديمي جديد للرصد center", btnAddCourse: "تسجيل المقرر",
        lblMyCourses: "مقرراتي المسجلة", lblSelectCourseHint: "اختر مقرراً من القائمة الجانبية لعرض أوقاته ومحاضراته ومهامه المنفصلة.",
        lblCourseTimes: "📅 أوقات المحاضرات بالجدول", lblCourseTasks: "📝 المهام والواجبات المرتبطة",
        courseDetailTitle: "تفاصيل المقرر الدراسي", btnSendFeedback: "إرسال الشكوى/الاقتراح",
        titleFeedback: "💬 الشكاوى والاقتراحات والتقييمات", lblSendOpinion: "إرسال رأي سري للمطور عبدالعزيز العنزي",
        feedbackDesc: "آراؤك واقتراحاتك ستصل مباشرة بشكل آمن وإلكتروني دون كشف حساب بريدك أو إيميل المطور للمستخدمين الآخرين.",
        lblRate: "تقييمك للمنصة والخدمات:", lblYourComment: "رسالتك أو اقتراحك أو الشكوى بالتفصيل (إجباري)"
    },
    en: {
        logoText: "Prince Sattam bin Abdulaziz University",
        hLogin: "Student Login", lblUser: "Username", lblPass: "Password", btnLogin: "Login",
        linkCreate: "Create Account", linkForgot: "Forgot Password?", hRegister: "Register New Account",
        lblRegUser: "Username", lblRegEmail: "Email (Gmail)", lblRegPhone: "Saudi Mobile Number",
        lblRegPass: "Password",
        btnRegister: "Register Account", linkBack: "Back to Login", hForgot: "Account Recovery",
        lblForgotEmail: "Enter your Gmail address", btnSend: "Send Verification Code", lblEnterCode: "Enter the 6-digit Code",
        btnVerify: "Verify & Show Password", lblScreen: "⚠️ Don't forget the password, take a screenshot of it now!",
        lblOldPass: "Your old password was:", linkBackLogin: "Back",
        titleTasks: "📝 Task Management System", hAddTask: "Add New Task", btnAddTask: "Add",
        oDaily: "Daily", oWeekly: "Weekly", oMonthly: "Monthly", oGeneral: "General",
        cDaily: "Daily", cWeekly: "Weekly", cMonthly: "Monthly", cGeneral: "General",
        titleGpa: "📊 Smart GPA Calculators", btnAddRow: "+ Add New Course", btnCalc: "Calculate GPA",
        lblRes: "Semester GPA:", titleSchedule: "📅 Weekly Class Schedule", hAddLecture: "Add Lecture",
        daySun: "Sunday", dayMon: "Monday", dayTue: "Tuesday", dayWed: "Wednesday", dayThu: "Thursday",
        hSun: "Sunday", hMon: "Monday", hTue: "Tuesday", hWed: "Wednesday", hThu: "Thursday",
        btnAddLecture: "Save", titleSettings: "⚙️ Settings", hUpdate: "Update Account Information",
        lNewUser: "New Username", lNewPass: "New Password", btnUpdate: "Save Updates",
        hDelete: "Danger Zone", pDeleteDesc: "Permanently delete account and clear all schedules, courses and tasks.", btnDelete: "Delete Account",
        mHub: "🏠 Portal Hub", mTasks: "📝 Tasks", mGpa: "📊 GPA", mSchedule: "📅 Schedule", mCourses: "📚 Courses", mFeedback: "💬 Feedback & Help", mSettings: "⚙️ Settings", mLogout: "🚪 Logout",
        lblRights: "Programmer Abdulaziz Al-Anazi",
        hubWelcome: "Welcome to the Unified Student Portal",
        hubSub: "Choose a service to open in a fully integrated independent view:",
        hubTasksTitle: "Tasks & Study Management", hubTasksDesc: "Track homework and exams classified by colored priorities.",
        hubGpaTitle: "GPA Calculator Center", hubGpaDesc: "Compute semester and cumulative GPA in an elegant and easy way.",
        hubSchedTitle: "Lecture Schedule", hubSchedDesc: "Arrange lectures with 3 different layout templates of your choice.",
        hubCoursesTitle: "Courses Isolated Hub", hubCoursesDesc: "A smart dedicated center for each course showing its isolated schedules & tasks.",
        hubFeedTitle: "Feedback & Complaints Support", hubFeedDesc: "A secure channel to rate the platform and send your notes privately.",
        hubSetTitle: "Account Settings", hubSetDesc: "Update your login credentials or permanently close the account.",
        lblSelectTheme: "Preferred Schedule Template:",
        gpaSemTab: "Current Semester", gpaCumTab: "Cumulative Overall",
        lblSemTitle: "Semester GPA Calculation", lblCumTitle: "Cumulative GPA Calculation",
        lblPrevGpa: "Previous Cumulative GPA (GPA)", lblPrevHours: "Total Previous Earned Hours",
        lblCurrGpa: "Current Semester GPA (Expected/Real)", lblCurrHours: "Current Semester Hours",
        btnCalcCum: "Calculate Cumulative GPA", lblCumRes: "New Cumulative GPA:",
        hAddCourse: "Register a New Academic Course", btnAddCourse: "Register Course",
        lblMyCourses: "Registered Courses", lblSelectCourseHint: "Choose a course from the side list to view its isolated class hours & tasks.",
        lblCourseTimes: "📅 Scheduled Class Hours", lblCourseTasks: "📝 Related Tasks & Homework",
        courseDetailTitle: "Course Detail View", btnSendFeedback: "Submit Feedback",
        titleFeedback: "💬 Suggestions, Feedback & Ratings", lblSendOpinion: "Submit secure feedback to developer Abdulaziz Al-Anazi",
        feedbackDesc: "Your suggestions will be sent securely to the developer without exposing your email or theirs.",
        lblRate: "Rate Platform & Services:", lblYourComment: "Your Message, Suggestion or Complaint (Mandatory)"
    }
};

let currentLang = localStorage.getItem('lang') || 'ar';
let activeCourseName = ''; // لتعريف المقرر المختار حالياً

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', currentLang);
    applyLanguage();
}

function applyLanguage() {
    document.body.classList.toggle('en', currentLang === 'en');
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    const dictionary = translations[currentLang];
    for (const id in dictionary) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = dictionary[id];
        }
    }
}

function toggleCard(cardId) {
    document.getElementById('loginCard').classList.add('hidden');
    document.getElementById('registerCard').classList.add('hidden');
    document.getElementById('forgotCard').classList.add('hidden');
    document.getElementById(cardId).classList.remove('hidden');
}

function goHome() {
    switchTab('hub');
}

async function register() {
    const username = document.getElementById('regUser').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPass').value;

    if(!username || !email || !phone || !password) {
        alert(currentLang === 'ar' ? 'أكمل البيانات!' : 'Complete all fields!');
        return;
    }

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, phone })
    });
    const data = await res.json();
    if(res.ok) {
        alert(currentLang === 'ar' ? data.msg_ar : data.msg_en);
        toggleCard('loginCard');
    } else {
        alert(currentLang === 'ar' ? data.err_ar : data.err_en);
    }
}

async function login() {
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if(res.ok) {
        localStorage.setItem('currentUser', data.username);
        window.location.href = 'dashboard.html';
    } else {
        alert(currentLang === 'ar' ? data.err_ar : data.err_en);
    }
}

async function sendResetCode() {
    const email = document.getElementById('forgotEmail').value.trim();
    const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await res.json();
    alert(currentLang === 'ar' ? data.msg_ar : data.msg_en);
    if(res.ok) {
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
    }
}

async function verifyResetCode() {
    const email = document.getElementById('forgotEmail').value.trim();
    const code = document.getElementById('verificationCode').value.trim();
    const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if(res.ok) {
        document.getElementById('recoveryResult').classList.remove('hidden');
        document.getElementById('oldPasswordText').innerText = data.oldPassword;
    } else {
        alert(currentLang === 'ar' ? data.err_ar : data.err_en);
    }
}

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) window.location.href = 'index.html';
    applyLanguage();
}

function initDash() {
    const user = localStorage.getItem('currentUser');
    document.getElementById('userDisp').innerText = user;
    
    // ربط ممرر الأيام بالحدث التفاعلي
    initDayChips();
    
    loadTasks();
    loadSchedule();
    loadCourses();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    document.getElementById(tabId).classList.remove('hidden');
    
    const sideMap = { 'hub': 'mHub', 'tasks': 'mTasks', 'gpa': 'mGpa', 'schedule': 'mSchedule', 'courses': 'mCourses', 'feedback': 'mFeedback', 'settings': 'mSettings' };
    const navLink = document.getElementById(sideMap[tabId]);
    if(navLink) navLink.classList.add('active');
    
    closeMenu();
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}
function closeMenu() {
    document.getElementById('sidebar').classList.remove('active');
}

// 1. نظام تمرير الأيام (Chips Scroll) للجدول
function initDayChips() {
    const chips = document.querySelectorAll('.scroll-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });
}

function getSelectedDayFromChips() {
    const activeChip = document.querySelector('.scroll-chip.active');
    return activeChip ? activeChip.getAttribute('data-day') : 'Sunday';
}

// 2. إدارة وتحديث ثيمات جدول المحاضرات الـ 3
let activeScheduleTheme = 'grid'; // الافتراضي
function changeScheduleTheme(themeName) {
    const themes = ['grid', 'timeline', 'colorful'];
    themes.forEach(t => {
        document.getElementById('theme-' + t).classList.remove('active');
        document.getElementById('scheduleContainer').classList.remove('theme-' + t + '-layout');
    });

    document.getElementById('theme-' + themeName).classList.add('active');
    document.getElementById('scheduleContainer').classList.add('theme-' + themeName + '-layout');
    activeScheduleTheme = themeName;
}

// 3. الشكاوى والاقتراحات والتقييمات بالايموجي
function updateEmoji(val) {
    document.getElementById('ratingVal').innerText = val + ' / 10';
    const pic = document.getElementById('emojiPic');
    if (val >= 9) pic.innerText = '😍';
    else if (val >= 7) pic.innerText = '🙂';
    else if (val >= 5) pic.innerText = '😐';
    else if (val >= 3) pic.innerText = '🙁';
    else pic.innerText = '😭';
}

async function submitFeedback() {
    const user = localStorage.getItem('currentUser');
    const rating = document.getElementById('ratingRange').value;
    const comment = document.getElementById('feedbackComment').value.trim();

    // إلزامية التعليق للتقييم
    if (!comment) {
        alert(currentLang === 'ar' ? 'التعليق إجباري لرفع الشكوى أو الاقتراح!' : 'Comment is mandatory to submit feedback!');
        return;
    }

    const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, rating, comment })
    });
    const data = await res.json();
    if (res.ok) {
        alert(currentLang === 'ar' ? data.msg_ar : data.msg_en);
        document.getElementById('feedbackComment').value = '';
        switchTab('hub');
    }
}

// 4. نظام المهام مع التصنيف بالأولويات الملونة
async function loadTasks() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/tasks/' + user);
    const tasks = await res.json();

    document.getElementById('list-daily').innerHTML = '';
    document.getElementById('list-weekly').innerHTML = '';
    document.getElementById('list-monthly').innerHTML = '';
    document.getElementById('list-general').innerHTML = '';

    const priorityMap = {
        urgent: currentLang === 'ar' ? '🔴 عاجل' : '🔴 Urgent',
        important: currentLang === 'ar' ? '⚠️ هام' : '⚠️ Important',
        normal: currentLang === 'ar' ? '🔵 اعتيادي' : '🔵 Normal'
    };

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = '<div style="display:flex; flex-direction:column; gap:4px;"><span>' + task.text + '</span><span class="priority-tag tag-' + task.priority + '">' + priorityMap[task.priority] + '</span></div> <span style="color:var(--danger); cursor:pointer; font-weight:bold;" onclick="deleteTask(' + index + ')">✕</span>';
        document.getElementById('list-' + task.type).appendChild(li);
    });
}

async function addTask() {
    const text = document.getElementById('taskText').value.trim();
    const type = document.getElementById('taskType').value;
    const priority = document.getElementById('taskPriority').value;
    const user = localStorage.getItem('currentUser');
    if (!text) return;

    await fetch('/api/tasks/' + user, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type, priority })
    });
    document.getElementById('taskText').value = '';
    loadTasks();
}

async function deleteTask(index) {
    const user = localStorage.getItem('currentUser');
    await fetch('/api/tasks/' + user + '/' + index, { method: 'DELETE' });
    loadTasks();
}

// 5. التبديل الفصلي والتراكمي للمعدل وحساب التراكمي الشامل
function toggleGpaMode(mode) {
    if (mode === 'semester') {
        document.getElementById('gpaSemTab').classList.add('active');
        document.getElementById('gpaCumTab').classList.remove('active');
        document.getElementById('semesterGpaBox').classList.remove('hidden');
        document.getElementById('cumulativeGpaBox').classList.add('hidden');
    } else {
        document.getElementById('gpaSemTab').classList.remove('active');
        document.getElementById('gpaCumTab').classList.add('active');
        document.getElementById('semesterGpaBox').classList.add('hidden');
        document.getElementById('cumulativeGpaBox').classList.remove('hidden');
    }
}

function addGpaRow() {
    const container = document.getElementById('gpa-rows');
    const row = document.createElement('div');
    row.className = 'gpa-row card-row';
    row.innerHTML = '<input type="text" placeholder="Course / المقرر" class="course-name"> <input type="number" class="hours" placeholder="S / الساعات"> <select class="grade"> <option value="5.00">A+ (5.0)</option> <option value="4.75">A (4.75)</option> <option value="4.50">B+ (4.5)</option> <option value="4.00">B (4.0)</option> <option value="3.50">C+ (3.5)</option> <option value="3.00">C (3.0)</option> <option value="2.50">D+ (2.5)</option> <option value="2.00">D (2.0)</option> <option value="0.00">F (0.0)</option> </select> <button class="delete-row-btn" onclick="this.parentElement.remove()" title="حذف">✕</button>';
    container.appendChild(row);
}

function calculateGPA() {
    const hrs = document.querySelectorAll('.hours');
    const grds = document.querySelectorAll('.grade');
    let points = 0, totalHours = 0;

    for (let i = 0; i < hrs.length; i++) {
        const h = parseFloat(hrs[i].value);
        const g = parseFloat(grds[i].value);
        if(!isNaN(h) && h > 0) {
            points += (g * h);
            totalHours += h;
        }
    }

    if(totalHours === 0) return;
    const gpa = (points / totalHours).toFixed(2);
    document.getElementById('gpaResult').classList.remove('hidden');
    document.getElementById('gpaVal').innerText = gpa;
}

// حساب التراكمي الشامل الذكي
function calculateCumulativeGPA() {
    const prevGpa = parseFloat(document.getElementById('prevGpa').value);
    const prevHours = parseFloat(document.getElementById('prevHours').value);
    const currGpa = parseFloat(document.getElementById('currGpa').value);
    const currHours = parseFloat(document.getElementById('currHours').value);

    if (isNaN(prevGpa) || isNaN(prevHours) || isNaN(currGpa) || isNaN(currHours)) {
        alert(currentLang === 'ar' ? 'الرجاء تعبئة كافة حقول التراكمي!' : 'Please fill all cumulative fields!');
        return;
    }

    const totalPoints = (prevGpa * prevHours) + (currGpa * currHours);
    const totalHours = prevHours + currHours;
    const resultCumulative = (totalPoints / totalHours).toFixed(2);

    document.getElementById('gpaCumResult').classList.remove('hidden');
    document.getElementById('gpaCumVal').innerText = resultCumulative;
}

// 6. جدول المحاضرات مع ثيمات وحفظ التوقيت
async function loadSchedule() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/schedule/' + user);
    const list = await res.json();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    days.forEach(d => document.querySelector('#' + d + ' ul').innerHTML = '');

    list.forEach((s, i) => {
        const li = document.createElement('li');
        li.innerHTML = '<strong>' + s.subject + '</strong> <br>' + s.timeFrom + ' - ' + s.timeTo + ' <br><span style="color:var(--danger); cursor:pointer; font-weight:bold;" onclick="deleteSchedule(' + i + ')">✕</span>';
        document.querySelector('#' + s.day + ' ul').appendChild(li);
    });
}

async function addSchedule() {
    const user = localStorage.getItem('currentUser');
    const subject = document.getElementById('schedSub').value.trim();
    const day = getSelectedDayFromChips(); // جلب اليوم المختار تفاعلياً من الشيبس
    const timeFrom = document.getElementById('schedFrom').value;
    const timeTo = document.getElementById('schedTo').value;

    if (!subject || !timeFrom || !timeTo) return;

    await fetch('/api/schedule/' + user, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, day, timeFrom, timeTo })
    });
    document.getElementById('schedSub').value = '';
    loadSchedule();
}

async function deleteSchedule(index) {
    const user = localStorage.getItem('currentUser');
    await fetch('/api/schedule/' + user + '/' + index, { method: 'DELETE' });
    loadSchedule();
}

// 7. المقررات المستقلة وقائمة الاقتراحات التلقائية لمنع الخطأ الإملائي
async function getScheduleSubjects() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/schedule/' + user);
    const list = await res.json();
    const subjects = list.map(item => item.subject);
    return [...new Set(subjects)]; // قائمة فريدة
}

// الإكمال التلقائي
async function handleCourseAutocomplete(val) {
    const suggestBox = document.getElementById('autoSuggestBox');
    suggestBox.innerHTML = '';
    if (!val.trim()) {
        suggestBox.classList.add('hidden');
        return;
    }

    const subjects = await getScheduleSubjects();
    const filtered = subjects.filter(sub => sub.toLowerCase().includes(val.toLowerCase()));

    if (filtered.length > 0) {
        suggestBox.classList.remove('hidden');
        filtered.forEach(sub => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.innerText = sub;
            div.onclick = () => {
                document.getElementById('courseInputName').value = sub;
                suggestBox.classList.add('hidden');
            };
            suggestBox.appendChild(div);
        });
    } else {
        suggestBox.classList.add('hidden');
    }
}

async function loadCourses() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/courses/' + user);
    const list = await res.json();

    const ul = document.getElementById('myCoursesList');
    ul.innerHTML = '';

    list.forEach((c, index) => {
        const li = document.createElement('li');
        li.className = 'course-row-item';
        li.innerHTML = '<span>' + c + '</span> <span style="color:var(--danger);" onclick="deleteCourse(' + index + '); event.stopPropagation();">✕</span>';
        li.onclick = () => selectCourse(c, li);
        ul.appendChild(li);
    });
}

async function addCourse() {
    const user = localStorage.getItem('currentUser');
    const name = document.getElementById('courseInputName').value.trim();
    if (!name) return;

    const res = await fetch('/api/courses/' + user, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    if (res.ok) {
        document.getElementById('courseInputName').value = '';
        loadCourses();
    } else {
        const data = await res.json();
        alert(currentLang === 'ar' ? data.err_ar : data.err_en);
    }
}

async function deleteCourse(index) {
    const user = localStorage.getItem('currentUser');
    await fetch('/api/courses/' + user + '/' + index, { method: 'DELETE' });
    activeCourseName = '';
    document.getElementById('courseDetailsContent').classList.add('hidden');
    document.getElementById('emptyStateCourse').classList.remove('hidden');
    loadCourses();
}

// عرض المواعيد والمهام الخاصة بكل مادة منعزلة
async function selectCourse(courseName, element) {
    document.querySelectorAll('#myCoursesList li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
    activeCourseName = courseName;

    document.getElementById('emptyStateCourse').classList.add('hidden');
    document.getElementById('courseDetailsContent').classList.remove('hidden');
    document.getElementById('courseDetailTitle').innerText = courseName;

    const user = localStorage.getItem('currentUser');

    // جلب محاضرات المادة من الجدول
    const schedRes = await fetch('/api/schedule/' + user);
    const schedList = await schedRes.json();
    const courseTimes = schedList.filter(s => s.subject.toLowerCase() === courseName.toLowerCase());

    const timesUl = document.getElementById('courseTimesList');
    timesUl.innerHTML = '';
    if(courseTimes.length === 0) {
        timesUl.innerHTML = '<li>لا يوجد محاضرات مسجلة بالجدول لهذه المادة</li>';
    } else {
        courseTimes.forEach(t => {
            const li = document.createElement('li');
            li.innerText = t.day + ': ' + t.timeFrom + ' - ' + t.timeTo;
            timesUl.appendChild(li);
        });
    }

    // جلب المهام المرتبطة
    const tasksRes = await fetch('/api/tasks/' + user);
    const tasksList = await tasksRes.json();
    const courseTasks = tasksList.filter(t => t.text.toLowerCase().includes(courseName.toLowerCase()));

    const tasksUl = document.getElementById('courseTasksList');
    tasksUl.innerHTML = '';
    if(courseTasks.length === 0) {
        tasksUl.innerHTML = '<li>لا توجد مهام أو واجبات مرتبطة بهذه المادة</li>';
    } else {
        courseTasks.forEach(tk => {
            const li = document.createElement('li');
            li.innerText = tk.text;
            tasksUl.appendChild(li);
        });
    }
}

async function deleteActiveCourse() {
    if (!activeCourseName) return;
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/courses/' + user);
    const list = await res.json();
    const index = list.indexOf(activeCourseName);
    if (index !== -1) {
        deleteCourse(index);
    }
}

// تعديل الحساب من الإعدادات
async function updateSettings() {
    const currentUsername = localStorage.getItem('currentUser');
    const newUsername = document.getElementById('setNewUser').value.trim();
    const newPassword = document.getElementById('setNewPass').value;

    const res = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUsername, newUsername, newPassword })
    });
    const data = await res.json();
    if(res.ok) {
        if(newUsername) localStorage.setItem('currentUser', data.updatedUsername);
        alert(currentLang === 'ar' ? 'تم التحديث بنجاح!' : 'Updated!');
        initDash();
    } else {
        alert(currentLang === 'ar' ? data.err_ar : data.err_en);
    }
}

async function deleteAccount() {
    if(!confirm(currentLang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return;
    const username = localStorage.getItem('currentUser');
    await fetch('/api/settings/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    logout();
}

applyLanguage();`
};

for (const [filePath, content] of Object.entries(files)) {
    const absolutePath = path.join(__dirname, filePath);
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log("Created file: " + filePath);
}

console.log("\nPSAU Ultimate Modern Student Portal successfully generated!\n\nRun the system:\n1. Open VS Code Terminal.\n2. Run: npm start\n3. Enjoy the completely updated responsive platform at http://localhost:3000");