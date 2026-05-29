console.log('PSAU app.js loaded');
const translations = {
    ar: {
        logoText: "جامعة الأمير سطام بن عبدالعزيز",
        subtitleText: "بوابة طلابية غير رسمية - مستقلة عن جامعة الأمير سطام بن عبدالعزيز",
        hLogin: "تسجيل الدخول", lblUser: "اسم المستخدم", lblPass: "كلمة المرور", btnLogin: "دخول",
        linkCreate: "إنشاء حساب جديد", linkForgot: "نسيت الرمز؟", hRegister: "إنشاء حساب جديد",
        lblRegUser: "اسم المستخدم", lblRegEmail: "البريد الإلكتروني (Gmail)", lblRegPhone: "رقم الجوال (سعودي)",
        lblRegPass: "كلمة المرور", btnRegister: "إنشاء الحساب", linkBack: "رجوع لتسجيل الدخول",
        hForgot: "استعادة الحساب", lblForgotEmail: "البريد الإلكتروني (Gmail)", btnSend: "إرسال كود التحقق",
        lblEnterCode: "أدخل الكود (6 أرقام)", btnVerify: "التحقق وإظهار الرمز",
        lblScreen: "⚠️ قم بتصوير الشاشة فوراً لحفظ الرمز!", lblOldPass: "رمزك القديم هو:", linkBackLogin: "رجوع",
        lblRights: "جامعة الأمير سطام بن عبدالعزيز | PSAU",
        contactLabel: "للتواصل:", contactName: "عبدالعزيز العنزي", contactWhatsapp: "واتساب",
        hubWelcome: "مرحباً بك في البوابة الطلابية الذكية", hubSub: "اختر الخدمة التي تريدها من البطاقات أدناه",
        hubAITitle: "المساعد الذكي AI", hubAIDesc: "تحت الصيانة - سيتم العودة قريباً",
        hubTasksTitle: "إدارة المهام", hubTasksDesc: "متابعة الواجبات والاختبارات وتصنيفها حسب الأولوية",
        hubGpaTitle: "حاسبة المعدل", hubGpaDesc: "احتساب المعدل الفصلي والتراكمي بطريقة ذكية",
        hubSchedTitle: "جدول المحاضرات", hubSchedDesc: "تنظيم المحاضرات بقوالب تفاعلية متعددة",
        hubFeedTitle: "اقتراحات وتقييم", hubFeedDesc: "شاركنا رأيك وتقييمك للمنصة",
        hubAbsenceTitle: "الغيابات", hubAbsenceDesc: "حساب نسبة الغياب والتنبيه عند الخطر",
        hubChannelsTitle: "القنوات", hubChannelsDesc: "قنوات تليجرام الجامعة الرسمية",
        hubShrouhatTitle: "الشروحات", hubShrouhatDesc: "تحت الصيانة - سيتم العودة قريباً",
        hubResourcesTitle: "المصادر", hubResourcesDesc: "تحت الصيانة - سيتم العودة قريباً",
        hubSetTitle: "الإعدادات", hubSetDesc: "تحديث بيانات الدخول أو حذف الحساب",

        titleAdminFeedback: "📋 الاقتراحات والتقييم",
        adminFeedbackEmpty: "لا توجد شكاوى أو اقتراحات حتى الآن",
        btnRefreshFeed: "🔄 تحديث",
        mHub: "🏠 البوابة", mAI: "🤖 المساعد AI", mTasks: "📝 المهام", mGpa: "📊 المعدل",
        mSchedule: "📅 الجدول", mAbsence: "🧮 الغيابات", mHourglass: "⌛ الساعة الرملية", mChannels: "📡 القنوات", mShrouhat: "📺 الشروحات", mResources: "📚 المصادر", mFeedback: "💬 اقتراحات وتقييم", mSettings: "⚙️ الإعدادات", mLogout: "🚪 خروج",
        titleAI: "🤖 المساعد الذكي لجامعة الأمير سطام",
        aiDesc: "اسأل عن كل ما يخص جامعة الأمير سطام بن عبدالعزيز: الكليات، القبول، الجداول، التواصل، وأكثر.",
        suggestLabel: "أسئلة مقترحة:",
        welcomeMsg: "مرحباً بك في مساعد جامعة الأمير سطام بن عبدالعزيز الذكي! أنا هنا للإجابة عن جميع استفساراتك حول الجامعة. ماذا تريد أن تعرف؟",
        titleTasks: "📝 إدارة المهام", hAddTask: "إضافة مهمة جديدة", btnAddTask: "➕ إضافة",
        pUrgent: "🔴 عاجل", pImportant: "⚠️ هام", pNormal: "🔵 اعتيادي",
        oDaily: "يومية", oWeekly: "أسبوعية", oMonthly: "شهرية", oGeneral: "عامة",
        cDaily: "📅 اليومية", cWeekly: "📅 الأسبوعية", cMonthly: "📅 الشهرية", cGeneral: "📋 عامة",
        titleGpa: "📊 حاسبة المعدل", gpaSemTab: "📘 الفصلي", gpaCumTab: "📊 التراكمي",
        lblSemTitle: "حساب المعدل الفصلي", lblRes: "المعدل الفصلي:", btnAddRow: "+ إضافة مقرر",
        lblCumTitle: "المعدل التراكمي", lblPrevGpa: "المعدل التراكمي السابق", lblPrevHours: "الساعات السابقة",
        lblCurrGpa: "معدل الفصل الحالي", lblCurrHours: "ساعات الفصل الحالي", lblCumRes: "المعدل التراكمي:",
        titleSchedule: "📅 جدول المحاضرات",
        hAddLecture: "إضافة محاضرة", hSun: "الأحد", hMon: "الإثنين", hTue: "الثلاثاء", hWed: "الأربعاء", hThu: "الخميس",
        titleAbsence: "🧮 حاسبة الغيابات",
        titleChannels: "📡 القنوات",
        titleHourglass: "⏳ الساعة الرملية",
        hubHourglassTitle: "الساعة الرملية", hubHourglassDesc: "مؤقت عكسي للاختبارات والمواعيد المهمة",
        mHourglass: "⌛ الساعة الرملية",
        titleShrouhat: "📺 الشروحات",
        titleResources: "📚 المصادر",
        lblAbsenceWeekly: "عدد الساعات الأسبوعية للمادة:",
        lblAbsenceAbsent: "عدد الساعات التي غابها الطالب:",
        titleFeedback: "💬 اقتراحات وتقييم", lblSendOpinion: "شاركنا رأيك",
        feedbackDesc: "نحن نقدر ملاحظاتك لتطوير المنصة", lblRate: "التقييم:", lblYourComment: "رسالتك",
        titleSettings: "⚙️ الإعدادات", hUpdate: "تحديث الحساب", lNewUser: "اسم مستخدم جديد", lNewPass: "كلمة مرور جديدة", lNewEmail: "البريد الإلكتروني",
        pDeleteDesc: "حذف الحساب وجميع البيانات نهائياً",
        lblPrevGpa: "المعدل التراكمي السابق", lblPrevHours: "الساعات السابقة",
        lblCurrGpa: "معدل الفصل الحالي", lblCurrHours: "ساعات الفصل الحالي",
        btnCalcCum: "💻 احسب التراكمي", lblCumRes: "المعدل التراكمي:",
        hubAdminStatsTitle: "الإحصائيات", hubAdminStatsDesc: "بيانات الموقع والرسومات البيانية",
        mAdminStatsLabel: "الإحصائيات", titleAdminStats: "📈 الإحصائيات",
        statsTabUsersLabel: "جدول المستخدمين", statsTabChartsLabel: "رسومات بيانية",
        lblForgotUser2: "1. اسم المستخدم", lblForgotAge2: "2. العمر", lblForgotGender2: "3. الجنس", lblForgotCollege2: "4. الكلية",
        lblThemeLabel: "الوضع:",

    }
};

function applyLanguage() {
    document.body.classList.remove('en');
    document.body.dir = 'rtl';
    const dict = translations.ar;
    for (const id in dict) {
        const el = document.getElementById(id);
        if (el) el.innerText = dict[id];
    }
}

function toggleCard(cardId) {
    document.getElementById('loginCard').classList.add('hidden');
    document.getElementById('registerCard').classList.add('hidden');
    document.getElementById('forgotCard').classList.add('hidden');
    document.getElementById(cardId).classList.remove('hidden');
}

function goHome() { switchTab('hub'); }

async function registerStudent() {
    try {
    const username = document.getElementById('regUser').value.trim();
    const password = document.getElementById('regPass').value;
    const email = document.getElementById('regEmail').value.trim();
    const age = document.getElementById('regAge').value;
    const gender = document.getElementById('regGender').value;
    const college = document.getElementById('regCollege').value;
    if (!username || !password || !email || !age || !gender || !college) {
        alert(true ? 'أكمل جميع البيانات!' : 'Fill all fields!');
        return;
    }
    if (username.length < 4 || !/^[a-zA-Z0-9]+$/.test(username)) {
        alert(true ? 'اسم المستخدم: 4 أحرف أو أرقام على الأقل، ويمنع استخدام الرموز' : 'Username: at least 4 letters/numbers, no symbols');
        return;
    }
    if (password.length < 6 || !/^[a-zA-Z0-9]+$/.test(password)) {
        alert(true ? 'الرمز السري: 6 أحرف أو أرقام على الأقل، ويمنع استخدام الرموز' : 'Password: at least 6 letters/numbers, no symbols');
        return;
    }
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, age, gender, college })
    });
    const data = await res.json();
    if (res.ok) {
        // Show OTP verification
        document.getElementById('regOtpArea').classList.remove('hidden');
        document.getElementById('regSubmitArea').classList.add('hidden');
        document.getElementById('regOtpMsg').innerHTML = '📧 ' + (data.msg_ar || 'تم إرسال الرمز');
        document.getElementById('regOtpEmail').value = email;
        document.getElementById('regHelpLink').style.display = 'block';
    } else {
        alert(true ? data.err_ar : data.err_en);
    }
    } catch(e) { alert('Register error: ' + e.message); }
}

async function regHelpResend() {
    const email = document.getElementById('regOtpEmail').value;
    const msg = document.getElementById('regOtpMsg');
    const link = document.getElementById('regHelpLink');
    if (!email) return;
    link.style.display = 'none';
    msg.innerHTML = '🔄 جاري إعادة الإرسال...';
    const res = await fetch('/api/reg-resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await res.json();
    msg.innerHTML = '📧 ' + (data.msg_ar || 'تم');
}

function resendRegOtp() {
    document.getElementById('regOtpMsg').innerHTML = '🔄 جاري إعادة الإرسال...';
    registerStudent();
}

function editRegEmail() {
    document.getElementById('regOtpArea').classList.add('hidden');
    document.getElementById('regSubmitArea').classList.remove('hidden');
    document.getElementById('regOtpMsg').innerHTML = '...';
    document.getElementById('regOtpInput').value = '';
    document.getElementById('regEmail').focus();
}

async function verifyEmailOtp() {
    const email = document.getElementById('regOtpEmail').value;
    const code = document.getElementById('regOtpInput').value.trim();
    const msg = document.getElementById('regOtpMsg');
    if (!code || code.length !== 6) {
        msg.innerHTML = '❌ أدخل 6 أرقام';
        return;
    }
    msg.innerHTML = '<span class="spinner"></span> جاري التحقق...';
    const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (res.ok) {
        msg.innerHTML = '✅ ' + (data.msg_ar || 'تم التوثيق!');
        setTimeout(() => { toggleCard('loginCard'); }, 1500);
    } else {
        msg.innerHTML = '❌ ' + (data.err_ar || 'خطأ');
    }
}

let currentRole = 'student';

function setRole(role) {
    currentRole = role;
    document.getElementById('roleStudent').classList.toggle('active', role === 'student');
    document.getElementById('roleAdmin').classList.toggle('active', role === 'admin');
    const isAdmin = role === 'admin';
    document.getElementById('loginLinks').style.display = isAdmin ? 'none' : '';
    document.getElementById('passGroup').style.display = isAdmin ? 'none' : '';
    document.getElementById('btnLogin').style.display = isAdmin ? 'none' : '';
    document.getElementById('adminOtpArea').classList.toggle('hidden', !isAdmin);
    document.getElementById('loginTitleText').innerText = isAdmin
        ? (true ? 'دخول المشرفين' : 'Admin Login')
        : (true ? 'تسجيل الدخول' : 'Student Login');
    document.getElementById('loginUser').placeholder = isAdmin ? '447051601' : 'Username';
    // Reset admin OTP fields
    document.getElementById('adminOtpInput').value = '';
    document.getElementById('adminOtpMsg').innerHTML = '';
    document.getElementById('btnAdminSendCode').textContent = '📨 إرسال الكود';
    document.getElementById('btnAdminSendCode').disabled = false;
}

async function adminSendCode() {
    const username = document.getElementById('loginUser').value.trim();
    const btn = document.getElementById('btnAdminSendCode');
    const msg = document.getElementById('adminOtpMsg');
    if (!username) { msg.innerHTML = '❌ أدخل اسم المستخدم'; msg.style.color = '#ef4444'; return; }
    btn.disabled = true;
    msg.innerHTML = '<span class="spinner"></span> جاري الإرسال...';
    msg.style.color = 'var(--text)';
    const res = await fetch('/api/admin/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (res.ok) {
        msg.innerHTML = '📧 ' + (data.msg_ar || 'تم الإرسال');
        msg.style.color = '#22c55e';
        btn.textContent = '🔄 إعادة إرسال';
        if (data.dev_code) document.getElementById('adminOtpInput').value = data.dev_code;
    } else {
        msg.innerHTML = '❌ ' + (data.err_ar || 'خطأ');
        msg.style.color = '#ef4444';
    }
    btn.disabled = false;
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 5000);
    if (data.dev_code) {
        document.getElementById('adminHelpLink').style.display = 'none';
    } else if (res.ok) {
        document.getElementById('adminHelpLink').style.display = 'block';
    }
}

async function adminHelpResend() {
    const username = document.getElementById('loginUser').value.trim();
    const msg = document.getElementById('adminOtpMsg');
    const link = document.getElementById('adminHelpLink');
    if (!username) return;
    link.style.display = 'none';
    msg.innerHTML = '🔄 جاري الإعادة...';
    msg.style.color = 'var(--text)';
    const res = await fetch('/api/admin/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    const data = await res.json();
    msg.innerHTML = '📧 ' + (data.msg_ar || 'تم');
    msg.style.color = '#22c55e';
    if (data.dev_code) {
        document.getElementById('adminOtpInput').value = data.dev_code;
        msg.innerHTML = '⚙️ ' + (data.msg_ar || data.dev_code);
    }
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 6000);
}

async function adminVerifyCode() {
    const username = document.getElementById('loginUser').value.trim();
    const code = document.getElementById('adminOtpInput').value.trim();
    const msg = document.getElementById('adminOtpMsg');
    if (!username) { msg.innerHTML = '❌ أدخل اسم المستخدم'; msg.style.color = '#ef4444'; return; }
    if (!code || code.length !== 6) { msg.innerHTML = '❌ أدخل الكود (6 أرقام)'; msg.style.color = '#ef4444'; return; }
    msg.innerHTML = '<span class="spinner"></span> جاري التحقق...';
    msg.style.color = 'var(--text)';
    const res = await fetch('/api/admin/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code })
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('currentUser', data.username);
        localStorage.setItem('currentRole', 'admin');
        window.location.href = 'dashboard.html';
    } else {
        msg.innerHTML = '❌ ' + (data.err_ar || 'خطأ');
        msg.style.color = '#ef4444';
    }
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 5000);
}

async function login() {
    try {
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value;
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: currentRole })
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('currentUser', data.username);
        localStorage.setItem('currentRole', data.role || 'student');
        if (data.gender) localStorage.setItem('userGender', data.gender);
        window.location.href = 'dashboard.html';
    } else {
        alert(true ? data.err_ar : data.err_en);
    }
    } catch(e) { alert('Login error: ' + e.message); }
}

async function forgotSendCode() {
    const email = document.getElementById('forgotEmail').value.trim();
    const msg = document.getElementById('forgotMsg');
    if (!email) {
        msg.innerHTML = '❌ أدخل بريدك الإلكتروني';
        msg.style.color = '#ef4444';
        return;
    }
    msg.innerHTML = '<span class="spinner"></span> جاري الإرسال...';
    msg.style.color = 'var(--text)';
    const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
        msg.innerHTML = '✅ ' + (data.msg_ar || 'تم الإرسال');
        msg.style.color = '#22c55e';
        document.getElementById('forgotStep2').classList.remove('hidden');
        if (data.dev_code) {
            const inp = document.getElementById('forgotCode');
            inp.value = data.dev_code;
        }
    } else {
        msg.innerHTML = '❌ ' + (data.err_ar || 'خطأ');
        msg.style.color = '#ef4444';
    }
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 6000);
}

async function forgotResetPass() {
    const email = document.getElementById('forgotEmail').value.trim();
    const code = document.getElementById('forgotCode').value.trim();
    const newPass = document.getElementById('forgotNewPass').value;
    const msg = document.getElementById('forgotResetMsg');
    if (!code || !newPass) {
        msg.innerHTML = '❌ أكمل جميع الحقول';
        msg.style.color = '#ef4444';
        return;
    }
    if (newPass.length < 4) {
        msg.innerHTML = '❌ كلمة المرور قصيرة (4 أحرف فأكثر)';
        msg.style.color = '#ef4444';
        return;
    }
    msg.innerHTML = '<span class="spinner"></span> جاري التحقق...';
    msg.style.color = 'var(--text)';
    const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: newPass })
    });
    const data = await res.json();
    if (res.ok) {
        msg.innerHTML = '✅ ' + (data.msg_ar || 'تم التغيير!');
        msg.style.color = '#22c55e';
        setTimeout(() => { toggleCard('loginCard'); }, 2000);
    } else {
        msg.innerHTML = '❌ ' + (data.err_ar || 'خطأ');
        msg.style.color = '#ef4444';
    }
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 6000);
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
    if (res.ok) {
        document.getElementById('recoveryResult').classList.remove('hidden');
        document.getElementById('oldPasswordText').innerText = data.oldPassword;
    } else {
        alert(true ? data.err_ar : data.err_en);
    }
}

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) window.location.href = 'index.html';
}

async function initDash() {
    const user = localStorage.getItem('currentUser');
    const role = localStorage.getItem('currentRole');
    document.getElementById('userDisp').innerText = user;
    initTheme();
    // Force admin elements hidden; only show if truly admin
    const adminCards = document.querySelectorAll('.hub-admin-only');
    adminCards.forEach(el => el.style.display = 'none');
    document.getElementById('mAdminFeedback').style.display = 'none';
    document.getElementById('mAdminStats').style.display = 'none';
    document.getElementById('mAdminData').style.display = 'none';
    if (role === 'admin') {
        document.getElementById('mAdminFeedback').style.display = '';
        document.getElementById('mAdminData').style.display = '';
        adminCards.forEach(el => {
            if (el.id !== 'hubAdminStatsCard') el.style.display = '';
        });
        document.getElementById('hubAdminDataCard').style.display = '';
    }
    loadTasks();
    await loadSchedule();
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userGender');
    localStorage.removeItem('currentRole');
    window.location.href = 'index.html';
}

function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    document.getElementById(tabId).classList.remove('hidden');
    const map = { 'hub': 'mHub', 'ai': 'mAI', 'tasks': 'mTasks', 'gpa': 'mGpa',
        'schedule': 'mSchedule', 'absence': 'mAbsence', 'hourglass': 'mHourglass', 'channels': 'mChannels', 'shrouhat': 'mShrouhat', 'resources': 'mResources', 'feedback': 'mFeedback',
        'settings': 'mSettings', 'adminFeedback': 'mAdminFeedback', 'adminStats': 'mAdminStats', 'adminData': 'mAdminData' };
    const link = document.getElementById(map[tabId]);
    if (link) link.classList.add('active');
    if (tabId !== 'gpa') saveGpaData();
    if (tabId === 'adminFeedback') { loadAdminFeedback(); }
    if (tabId === 'adminStats') { loadAdminStatsPage(); }
    if (tabId === 'adminData') { loadAdminDataPage(); }
    if (tabId === 'settings') { loadVerifyStatus(); }
    if (tabId === 'gpa') { loadGpaData(); populateGpaDatalist(); }
    if (tabId === 'schedule') { renderSchedGrid(); loadSavedSchedules(); }
    if (tabId === 'hourglass') { loadHourglass(); }
    if (tabId === 'absence') { loadAbsenceSubjects(); }
    closeMenu();
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebarOverlay').classList.toggle('active');
}
function closeMenu() {
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('sidebarOverlay').classList.remove('active');
}

/* ===== SCHEDULE GRID ===== */
let schedGridColor = localStorage.getItem('schedGridColor') || 'blue';
const schedGridHours = [];
for (let h = 8; h <= 20; h++) {
    schedGridHours.push(h);
}

function setSchedGridColor(color) {
    schedGridColor = color;
    localStorage.setItem('schedGridColor', color);
    document.querySelectorAll('.sched-color-btn').forEach(b => b.classList.toggle('active', b.dataset.color === color));
    document.getElementById('schedGridTable').className = 'sched-grid sched-grid-theme-' + color;
}

const subjectColors = ['blue','purple','green','red','black','orange','pink','brown'];

async function renderSchedGrid() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/schedule/' + user);
    const list = await res.json();
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday'];
    const tbody = document.getElementById('schedGridBody');

    const lookup = {};
    list.forEach(s => {
        const fromHour = parseInt(s.timeFrom ? s.timeFrom.split(':')[0] : 0);
        if (!isNaN(fromHour) && fromHour >= 8 && fromHour <= 20) {
            const key = s.day + '-' + fromHour;
            if (!lookup[key]) lookup[key] = [];
            lookup[key].push({ subject: s.subject, _id: s._id, color: s.color || schedGridColor });
        }
    });

    let html = '';
    schedGridHours.forEach(h => {
        const label = h >= 12 ? (h === 12 ? 12 : h - 12) + ' م' : h + ' ص';
        html += '<tr><td><span>' + label + '</span></td>';
        days.forEach(day => {
            const key = day + '-' + h;
            const cells = lookup[key] || [];
            html += '<td><div class="sched-grid-cell" data-day="' + day + '" data-hour="' + h + '" onclick="openSchedCell(this)">';
            cells.forEach(c => {
                html += '<div class="cell-subject cell-subj-' + c.color + '"><span class="cell-del" onclick="event.stopPropagation();deleteSchedGridItem(\'' + c._id + '\')">🗑️</span>' + c.subject + '</div>';
            });
            html += '</div></td>';
        });
        html += '</tr>';
    });
    tbody.innerHTML = html;
    setSchedGridColor(schedGridColor);
}

async function loadSchedule() {
    await renderSchedGrid();
}

async function deleteSchedGridItem(id) {
    const user = localStorage.getItem('currentUser');
    try {
        const r = await fetch('/api/schedule/' + user + '/' + id, { method: 'DELETE' });
        const d = await r.json();
        if (!d.success) { alert('فشل الحذف'); return; }
        renderSchedGrid();
    } catch(e) { alert('خطأ: ' + e.message); }
}

function openSchedCell(el) {
    if (el.querySelector('.cell-subject')) return;
    const day = el.dataset.day;
    const hour = el.dataset.hour;
    const dayName = day === 'Sunday'?'الأحد':day==='Monday'?'الإثنين':day==='Tuesday'?'الثلاثاء':day==='Wednesday'?'الأربعاء':'الخميس';

    const old = document.getElementById('schedModalOverlay');
    if (old) old.remove();

    const colorBtns = subjectColors.map(c => {
        const names = { blue:'أزرق',purple:'بنفسجي',green:'أخضر',red:'أحمر',black:'أسود',orange:'برتقالي',pink:'وردي',brown:'بني' };
        return '<button class="subj-color-btn" data-subj-color="' + c + '" title="' + names[c] + '"></button>';
    }).join('');

    const overlay = document.createElement('div');
    overlay.id = 'schedModalOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';

    const box = document.createElement('div');
    box.style.cssText = 'background:var(--surface,#0d1526);border:1px solid var(--border,#1e3a5f);border-radius:14px;padding:24px;width:360px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,0.5);';

    box.innerHTML = '<div style="text-align:center;margin-bottom:16px;"><div style="font-size:13px;color:var(--text-muted);margin-bottom:4px;">' + dayName + ' · ' + hour + ':00</div><h3 style="margin:0;font-size:16px;">أضف مادة</h3></div>' +
        '<input type="text" id="schedModalInput" placeholder="اسم المادة" style="width:100%;padding:12px 14px;background:var(--bg,#060c1a);color:var(--text);border:1px solid var(--border,#1e3a5f);border-radius:8px;font-size:15px;box-sizing:border-box;margin-bottom:12px;" maxlength="60" autofocus>' +
        '<div style="margin-bottom:12px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">اختر لون المادة:</div><div class="subj-color-picker">' + colorBtns + '</div></div>' +
        '<div style="display:flex;gap:8px;">' +
        '<button id="schedModalConfirm" class="btn btn-primary" style="flex:1;">إضافة</button>' +
        '<button id="schedModalCancel" class="btn btn-sm" style="flex:0;">إلغاء</button></div>';

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    let selectedColor = schedGridColor;
    document.querySelectorAll('.subj-color-btn').forEach(b => {
        b.addEventListener('click', function() {
            document.querySelectorAll('.subj-color-btn').forEach(x => x.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.dataset.subjColor;
        });
    });
    const defaultBtn = document.querySelector('.subj-color-btn[data-subj-color="' + schedGridColor + '"]') || document.querySelector('.subj-color-btn');
    if (defaultBtn) defaultBtn.classList.add('active');

    const input = document.getElementById('schedModalInput');
    input.focus();

    function submitName() {
        const subject = input.value.trim();
        if (!subject) { input.style.borderColor = '#ef4444'; input.focus(); return; }
        const user = localStorage.getItem('currentUser');
        fetch('/api/schedule/' + user, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, day, timeFrom: hour.toString().padStart(2,'0') + ':00', timeTo: (hour + 1).toString().padStart(2,'0') + ':00', color: selectedColor })
        }).then(() => { overlay.remove(); renderSchedGrid(); });
    }

    document.getElementById('schedModalConfirm').onclick = submitName;
    document.getElementById('schedModalCancel').onclick = function() { overlay.remove(); };
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    input.onkeydown = function(e) { if (e.key === 'Enter') submitName(); };
}

async function saveSchedule() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/schedule/' + user);
    const list = await res.json();
    if (!list.length) { alert('الجدول فارغ، أضف مواد أولاً'); return; }
    const name = prompt('أدخل اسم الجدول:');
    if (!name || !name.trim()) return;
    await fetch('/api/saved-schedules/' + user, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), data: list })
    });
    loadSavedSchedules();
}

async function loadSavedSchedules() {
    const user = localStorage.getItem('currentUser');
    const container = document.getElementById('savedSchedulesList');
    const countEl = document.getElementById('savedSchedCount');
    if (!container) return;
    const res = await fetch('/api/saved-schedules/' + user);
    const list = await res.json();
    if (countEl) countEl.textContent = list.length ? '(' + list.length + ')' : '';
    if (!list.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:10px;font-size:13px;">لا توجد جداول محفوظة</p>';
        return;
    }
    let html = '';
    list.slice().reverse().forEach(s => {
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface-2);border-radius:10px;margin-bottom:6px;">' +
            '<div><strong style="font-size:14px;">' + s.name + '</strong><br><span style="font-size:11px;color:var(--text-muted);">' + new Date(s.savedAt).toLocaleDateString('ar-SA') + ' · ' + s.data.length + ' مواد</span></div>' +
            '<div style="display:flex;gap:6px;">' +
            '<button class="btn btn-sm" onclick="loadSavedSchedule(\'' + s.id + '\')" style="font-size:11px;">📂 تحميل</button>' +
            '<button class="btn-danger-sm" onclick="deleteSavedSchedule(\'' + s.id + '\')" style="font-size:11px;padding:4px 10px;border-radius:8px;background:rgba(239,68,68,0.12);color:#ef4444;border:1px solid rgba(239,68,68,0.2);cursor:pointer;">🗑️</button></div></div>';
    });
    container.innerHTML = html;
}

async function loadSavedSchedule(id) {
    if (!confirm('تحميل هذا الجدول سيحل محل الجدول الحالي. هل تريد المتابعة؟')) return;
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/saved-schedules/' + user);
    const list = await res.json();
    const item = list.find(s => s.id === id);
    if (!item) return;
    // Replace current schedule with saved data
    // First delete all existing schedule items
    const currRes = await fetch('/api/schedule/' + user);
    const currList = await currRes.json();
    for (let i = 0; i < currList.length; i++) {
        await fetch('/api/schedule/' + user + '/0', { method: 'DELETE' });
    }
    // Then add saved items
    for (const itemData of item.data) {
        await fetch('/api/schedule/' + user, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });
    }
    renderSchedGrid();
}

async function deleteSavedSchedule(id) {
    if (!confirm('حذف الجدول المحفوظ؟')) return;
    const user = localStorage.getItem('currentUser');
    await fetch('/api/saved-schedules/' + user + '/' + id, { method: 'DELETE' });
    loadSavedSchedules();
}

// Apply saved color on load
document.addEventListener('DOMContentLoaded', function() {
    setSchedGridColor(schedGridColor);
});

/* ===== TASKS ===== */
async function loadTasks() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/tasks/' + user);
    const tasks = await res.json();
    ['daily','weekly','monthly','general','completed'].forEach(t => document.getElementById('list-' + t).innerHTML = '');
    const priorityMap = { urgent:'🔴 عاجل', important:'⚠️ هام', normal:'🔵 اعتيادي' };
    let pendingCount = 0, doneCount = 0;
    tasks.forEach((task, index) => {
        if (task.completed) { doneCount++; } else { pendingCount++; }
        const list = task.completed ? 'completed' : task.type;
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.style.opacity = '0.55';
        li.innerHTML = '<label class="task-check-wrap"><input type="checkbox" ' + (task.completed ? 'checked' : '') + ' onchange="toggleTaskComplete(' + index + ')"><span class="check-mark"></span></label>' +
            '<div style="flex:1;min-width:0;">' +
            '<div class="task-text' + (task.completed ? ' task-text-done' : '') + '">' + task.text + '</div>' +
            (task.description ? '<div class="task-desc">' + task.description + '</div>' : '') +
            '<div class="task-meta">' +
            (task.course ? '<span class="task-course-tag">' + task.course + '</span>' : '') +
            '<span class="btn-priority btn-priority-' + task.priority + '">' + priorityMap[task.priority] + '</span>' +
            '</div></div>' +
            '<span style="color:var(--danger);cursor:pointer;font-weight:bold;flex-shrink:0;margin-right:6px;" onclick="deleteTask(' + index + ')">🗑️</span>';
        document.getElementById('list-' + list).appendChild(li);
    });
    const total = pendingCount + doneCount;
    document.getElementById('taskStatsBox').classList.toggle('hidden', total === 0);
    document.getElementById('taskStatsPending').textContent = pendingCount;
    document.getElementById('taskStatsDone').textContent = doneCount;
    const pct = total ? Math.round(doneCount / total * 100) : 0;
    document.getElementById('batteryFill').style.width = pct + '%';
    document.getElementById('batteryLabel').textContent = pct + '%';
    populateGpaDatalist();
}

async function toggleTaskComplete(index) {
    const user = localStorage.getItem('currentUser');
    await fetch('/api/tasks/' + user + '/' + index + '/toggle', { method: 'PATCH' });
    loadTasks();
}

async function addTask() {
    const text = document.getElementById('taskText').value.trim();
    const type = document.getElementById('taskType').value;
    const priority = document.getElementById('taskPriority').value;
    const course = document.getElementById('taskCourse').value.trim();
    const description = document.getElementById('taskDesc').value.trim();
    const user = localStorage.getItem('currentUser');
    if (!text) return;
    await fetch('/api/tasks/' + user, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type, priority, course, description })
    });
    document.getElementById('taskText').value = '';
    document.getElementById('taskCourse').value = '';
    document.getElementById('taskDesc').value = '';
    loadTasks();
}

async function deleteTask(index) {
    const user = localStorage.getItem('currentUser');
    await fetch('/api/tasks/' + user + '/' + index, { method: 'DELETE' });
    loadTasks();
}

async function suggestTaskCourse(val) {
    const names = await getScheduleSubjects();
    const box = document.getElementById('taskCourseSuggestBox');
    box.innerHTML = '';
    if (!val.trim()) { box.classList.add('hidden'); return; }
    const q = val.toLowerCase();
    const filtered = names.filter(s => s.toLowerCase().startsWith(q));
    if (!filtered.length) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    filtered.forEach(s => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.innerText = s;
        div.onclick = () => { document.getElementById('taskCourse').value = s; box.classList.add('hidden'); };
        box.appendChild(div);
    });
}

/* ===== GPA UI ===== */
function toggleGpaMode(mode) {
    ['gpaSemTab','gpaCumTab','gpaSpecTab'].forEach(id => document.getElementById(id).classList.toggle('active', id === 'gpa' + mode.charAt(0).toUpperCase() + mode.slice(1) + 'Tab'));
    document.getElementById('semesterGpaBox').classList.toggle('hidden', mode !== 'semester');
    document.getElementById('cumulativeGpaBox').classList.toggle('hidden', mode !== 'cumulative');
    document.getElementById('specializationGpaBox').classList.toggle('hidden', mode !== 'specialization');
}

function addGpaRow() {
    const container = document.getElementById('gpa-rows');
    const row = document.createElement('div');
    row.className = 'gpa-row card-row';
    row.innerHTML = '<input type="text" placeholder="المقرر" class="course-name" list="gpaCourseList"> <input type="number" class="hours" placeholder="الساعات"> <select class="grade"><option value="5.00">A+ (5.0)</option><option value="4.75">A (4.75)</option><option value="4.50">B+ (4.5)</option><option value="4.00">B (4.0)</option><option value="3.50">C+ (3.5)</option><option value="3.00">C (3.0)</option><option value="2.50">D+ (2.5)</option><option value="2.00">D (2.0)</option><option value="0.00">F (0.0)</option></select> <button class="delete-row-btn" onclick="this.parentElement.remove()" title="حذف">🗑️</button>';
    container.appendChild(row);
}

/* Specialization data */
const specData = {
    applied: { name:'الكلية التطبيقية', fields: 'custom' },
    science: { name:'كلية العلوم', fields: 'custom' },
    se: { name:'هندسة البرمجيات', fields: 'custom' },
    ce: { name:'هندسة الحاسب', fields: 'custom' },
    cs: { name:'علوم الحاسب', fields: 'custom' },
    is: { name:'نظم المعلومات', fields: 'custom' }
};

const gradeOptions = '<option value="">اختر</option><option value="5.00">A+ (5.0)</option><option value="4.75">A (4.75)</option><option value="4.50">B+ (4.5)</option><option value="4.00">B (4.0)</option><option value="3.50">C+ (3.5)</option><option value="3.00">C (3.0)</option><option value="2.50">D+ (2.5)</option><option value="2.00">D (2.0)</option><option value="0.00">F (0.0)</option>';

function updateSpecForm() {
    const major = document.getElementById('specMajorSelect').value;
    const data = specData[major];
    const container = document.getElementById('specFieldsContainer');
    if (!data) { container.innerHTML = ''; return; }
    document.getElementById('specGpaResult').classList.add('hidden');

    if (data.fields === 'custom') {
        if (major === 'applied') {
            container.innerHTML =
                '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">المتطلبات:</div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تراكمي التحضيري</span>' +
                '<input type="number" id="specPrepGpa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">نسبة الطالب المركبة</span>' +
                '<input type="number" id="specCompScore" step="0.01" min="0" max="100" placeholder="من 100" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير الكيمياء العضوية 106 كيم</span>' +
                '<select id="specChemGrade" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير علم الأحياء العام 106 حيا</span>' +
                '<select id="specBioGrade" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>';
        } else if (major === 'science') {
            container.innerHTML =
                '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">المتطلبات:</div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">المعدل التراكمي</span>' +
                '<input type="number" id="specScienceGpa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">الموزونة</span>' +
                '<input type="number" id="specScienceWeight" step="0.01" min="0" max="100" placeholder="من 100" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير الفيزياء</span>' +
                '<select id="specPhysicsGrade" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير التفاضل</span>' +
                '<select id="specDiffGrade" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير التكامل</span>' +
                '<select id="specIntGrade" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>';
        } else if (major === 'se') {
            container.innerHTML =
                '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">المتطلبات:</div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير التصميم المنطقي (1111هال)</span>' +
                '<select id="specSEA" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير برمجة الحاسب 1 (1301عال)</span>' +
                '<select id="specSEB" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">المعدل التراكمي</span>' +
                '<input type="number" id="specSEGpa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">المعدل الفصلي</span>' +
                '<input type="number" id="specSESa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>';
        } else if (major === 'ce') {
            container.innerHTML =
                '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">المتطلبات:</div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير التصميم المنطقي (1111هال)</span>' +
                '<select id="specCEA" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير الرياضيات المتقطعة (1112عال)</span>' +
                '<select id="specCEB" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">المعدل التراكمي</span>' +
                '<input type="number" id="specCEGpa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">المعدل الفصلي</span>' +
                '<input type="number" id="specCESa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>';
        } else if (major === 'cs') {
            container.innerHTML =
                '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">المتطلبات:</div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير الرياضيات المتقطعة (1112عال)</span>' +
                '<select id="specCSA" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير برمجة الحاسب 1 (1301عال)</span>' +
                '<select id="specCSB" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">المعدل التراكمي</span>' +
                '<input type="number" id="specCSGpa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">المعدل الفصلي</span>' +
                '<input type="number" id="specCSSa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>';
        } else if (major === 'is') {
            container.innerHTML =
                '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">المتطلبات:</div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير برمجة الحاسب 1 (1301عال)</span>' +
                '<select id="specISA" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">تقدير التصميم المنطقي (1111هال)</span>' +
                '<select id="specISB" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;">' + gradeOptions + '</select></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">المعدل التراكمي</span>' +
                '<input type="number" id="specISGpa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>' +
                '<div class="gpa-row card-row" style="grid-template-columns:1fr 200px;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:13px;font-weight:600;">المعدل الفصلي</span>' +
                '<input type="number" id="specISSa" step="0.01" min="0" max="5" placeholder="من 5.00" style="padding:8px 10px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;"></div>';
        }
        return;
    }

    let html = '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">المقررات المطلوبة لتخصص "' + data.name + '":</div>';
    data.courses.forEach((c, i) => {
        html += '<div class="gpa-row card-row spec-row" style="grid-template-columns:1fr 80px 120px 30px;">' +
            '<span style="display:flex;align-items:center;font-size:13px;font-weight:600;color:var(--text);padding:0 4px;">' + c.name + '</span>' +
            '<span style="display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--text-muted);">' + c.hours + ' س</span>' +
            '<select class="grade spec-grade" data-idx="' + i + '">' + gradeOptions + '</select>' +
            '<span style="display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--text-muted);" class="spec-points">0.00</span></div>';
    });
    container.innerHTML = html;
}

function calculateSpecGpa() {
    const major = document.getElementById('specMajorSelect').value;
    const data = specData[major];
    if (!data) return;

    if (major === 'applied') {
        const prepGpa = parseFloat(document.getElementById('specPrepGpa').value);
        const compScore = parseFloat(document.getElementById('specCompScore').value);
        const chem = parseFloat(document.getElementById('specChemGrade').value);
        const bio = parseFloat(document.getElementById('specBioGrade').value);
        if (isNaN(prepGpa) || isNaN(compScore) || isNaN(chem) || isNaN(bio)) {
            alert('الرجاء إدخال جميع القيم'); return;
        }
        const result = (prepGpa * 0.5) + (compScore * 0.3 * 0.05) + (chem * 0.1) + (bio * 0.1);
        document.getElementById('specGpaResult').classList.remove('hidden');
        document.getElementById('specGpaVal').textContent = result.toFixed(2);
        return;
    }

    if (major === 'science') {
        const gpa = parseFloat(document.getElementById('specScienceGpa').value);
        const weight = parseFloat(document.getElementById('specScienceWeight').value);
        const physics = parseFloat(document.getElementById('specPhysicsGrade').value);
        const diff = parseFloat(document.getElementById('specDiffGrade').value);
        const integ = parseFloat(document.getElementById('specIntGrade').value);
        if (isNaN(gpa) || isNaN(weight) || isNaN(physics) || isNaN(diff) || isNaN(integ)) {
            alert('الرجاء إدخال جميع القيم'); return;
        }
        const result = (gpa * 0.5) + (weight * 0.3 * 0.05) + (physics * 0.1) + (diff * 0.05) + (integ * 0.05);
        document.getElementById('specGpaResult').classList.remove('hidden');
        document.getElementById('specGpaVal').textContent = result.toFixed(2);
        return;
    }

    if (major === 'se') {
        const A = parseFloat(document.getElementById('specSEA').value);
        const B = parseFloat(document.getElementById('specSEB').value);
        const GPA = parseFloat(document.getElementById('specSEGpa').value);
        const SA = parseFloat(document.getElementById('specSESa').value);
        if (isNaN(A) || isNaN(B) || isNaN(GPA) || isNaN(SA)) { alert('الرجاء إدخال جميع القيم'); return; }
        const result = (SA + GPA + A * 0.5 + B * 0.5) / 3;
        document.getElementById('specGpaResult').classList.remove('hidden');
        document.getElementById('specGpaVal').textContent = result.toFixed(2);
        return;
    }

    if (major === 'ce') {
        const A = parseFloat(document.getElementById('specCEA').value);
        const B = parseFloat(document.getElementById('specCEB').value);
        const GPA = parseFloat(document.getElementById('specCEGpa').value);
        const SA = parseFloat(document.getElementById('specCESa').value);
        if (isNaN(A) || isNaN(B) || isNaN(GPA) || isNaN(SA)) { alert('الرجاء إدخال جميع القيم'); return; }
        const result = (SA + GPA + A * 0.75 + B * 0.25) / 3;
        document.getElementById('specGpaResult').classList.remove('hidden');
        document.getElementById('specGpaVal').textContent = result.toFixed(2);
        return;
    }

    if (major === 'cs') {
        const A = parseFloat(document.getElementById('specCSA').value);
        const B = parseFloat(document.getElementById('specCSB').value);
        const GPA = parseFloat(document.getElementById('specCSGpa').value);
        const SA = parseFloat(document.getElementById('specCSSa').value);
        if (isNaN(A) || isNaN(B) || isNaN(GPA) || isNaN(SA)) { alert('الرجاء إدخال جميع القيم'); return; }
        const result = (SA + GPA + A * 0.25 + B * 0.75) / 3;
        document.getElementById('specGpaResult').classList.remove('hidden');
        document.getElementById('specGpaVal').textContent = result.toFixed(2);
        return;
    }

    if (major === 'is') {
        const A = parseFloat(document.getElementById('specISA').value);
        const B = parseFloat(document.getElementById('specISB').value);
        const GPA = parseFloat(document.getElementById('specISGpa').value);
        const SA = parseFloat(document.getElementById('specISSa').value);
        if (isNaN(A) || isNaN(B) || isNaN(GPA) || isNaN(SA)) { alert('الرجاء إدخال جميع القيم'); return; }
        const result = (SA + GPA + A * 0.75 + B * 0.25) / 3;
        document.getElementById('specGpaResult').classList.remove('hidden');
        document.getElementById('specGpaVal').textContent = result.toFixed(2);
        return;
    }

    const grades = document.querySelectorAll('#specFieldsContainer .spec-grade');
    let points = 0, totalHours = 0;
    grades.forEach((sel, i) => {
        const val = parseFloat(sel.value);
        if (!isNaN(val)) {
            points += val * data.courses[i].hours;
            totalHours += data.courses[i].hours;
            document.querySelectorAll('#specFieldsContainer .spec-points')[i].textContent = val.toFixed(2);
        }
    });
    if (totalHours === 0) return;
    const gpa = (points / totalHours).toFixed(2);
    document.getElementById('specGpaResult').classList.remove('hidden');
    document.getElementById('specGpaVal').textContent = gpa;
}

function calculateGPA() {
    const hrs = document.querySelectorAll('#gpa-rows .hours');
    const grds = document.querySelectorAll('#gpa-rows .grade');
    let points = 0, totalHours = 0;
    for (let i = 0; i < hrs.length; i++) {
        const h = parseFloat(hrs[i].value);
        const g = parseFloat(grds[i].value);
        if(!isNaN(h) && h > 0) { points += (g * h); totalHours += h; }
    }
    if(totalHours === 0) return;
    const gpa = (points / totalHours).toFixed(2);
    document.getElementById('gpaResult').classList.remove('hidden');
    document.getElementById('gpaVal').innerText = gpa;
}

function calculateCumulativeGPA() {
    const prevGpa = parseFloat(document.getElementById('prevGpa').value);
    const prevHours = parseFloat(document.getElementById('prevHours').value);
    const currGpa = parseFloat(document.getElementById('currGpa').value);
    const currHours = parseFloat(document.getElementById('currHours').value);
    if (isNaN(prevGpa) || isNaN(prevHours) || isNaN(currGpa) || isNaN(currHours)) {
        alert('الرجاء تعبئة كافة حقول التراكمي!'); return;
    }
    const totalPoints = (prevGpa * prevHours) + (currGpa * currHours);
    const totalHours = prevHours + currHours;
    const result = (totalPoints / totalHours).toFixed(2);
    document.getElementById('gpaCumResult').classList.remove('hidden');
    document.getElementById('gpaCumVal').innerText = result;
}

function calculateAbsence() {
    const weekly = parseFloat(document.getElementById('absenceWeeklyHours').value);
    const absent = parseFloat(document.getElementById('absenceAbsentHours').value);
    if (isNaN(weekly) || isNaN(absent) || weekly <= 0) {
        alert('الرجاء إدخال القيم بشكل صحيح'); return;
    }
    const maxAllowed = weekly * 15;
    const percent = Math.min((absent / maxAllowed) * 100, 100);
    document.getElementById('absencePercent').textContent = percent.toFixed(2) + '%';

    const fill = document.getElementById('absenceBatteryFill');
    const icon = document.getElementById('absenceStatusIcon');
    const text = document.getElementById('absenceStatusText');
    let color, status, emoji;
    if (percent <= 10) {
        color = '#22c55e'; status = 'آمان'; emoji = '🟢';
    } else if (percent < 20) {
        color = '#eab308'; status = 'انتباه'; emoji = '🟡';
    } else if (percent <= 25) {
        color = '#f97316'; status = 'خطر'; emoji = '🟠';
    } else {
        color = '#ef4444'; status = 'حرمان'; emoji = '🔴';
    }
    fill.style.width = percent + '%';
    fill.style.setProperty('background', color);
    icon.textContent = emoji;
    text.textContent = status;
    document.getElementById('absenceBatteryBox').classList.remove('hidden');
    // Store for save
    window._lastAbsence = { weekly, absent, percent: percent.toFixed(2) };
}

let absenceData = [];

async function loadAbsenceSubjects() {
    const user = localStorage.getItem('currentUser');
    if (!user) return;
    const res = await fetch('/api/absence/' + user);
    absenceData = await res.json();
    renderAbsenceSubjects();
}

async function saveAbsenceSubject() {
    const user = localStorage.getItem('currentUser');
    if (!user) return;
    const name = document.getElementById('absSubjectName').value.trim();
    if (!name) { alert('أدخل اسم المادة'); return; }
    if (!window._lastAbsence) { alert('احسب نسبة الغياب أولاً'); return; }
    const { weekly, absent, percent } = window._lastAbsence;
    const res = await fetch('/api/absence/' + user, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, weekly, absent })
    });
    if (res.ok) {
        document.getElementById('absSubjectName').value = '';
        loadAbsenceSubjects();
    }
}

async function deleteAbsenceSubject(id) {
    const user = localStorage.getItem('currentUser');
    if (!user) return;
    const res = await fetch('/api/absence/' + user + '/' + id, { method: 'DELETE' });
    if (res.ok) loadAbsenceSubjects();
}

async function adjustAbsence(id, delta) {
    const user = localStorage.getItem('currentUser');
    if (!user) return;
    const item = absenceData.find(d => d.id === id);
    if (!item) return;
    const newAbsent = Math.max(0, item.absent + delta);
    const res = await fetch('/api/absence/' + user + '/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ absent: newAbsent })
    });
    if (res.ok) loadAbsenceSubjects();
}

function renderAbsenceSubjects() {
    const container = document.getElementById('absenceSubjectsList');
    if (!container) return;
    if (absenceData.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:12px;">لا توجد مواد محفوظة</p>';
        return;
    }
    let html = '';
    absenceData.forEach(d => {
        const maxAllowed = d.weekly * 15;
        const percent = Math.min((d.absent / maxAllowed) * 100, 100);
        const pctStr = percent.toFixed(2);
        let status, color;
        if (percent <= 10) { color = '#22c55e'; status = '🟢 آمان'; }
        else if (percent < 20) { color = '#eab308'; status = '🟡 انتباه'; }
        else if (percent <= 25) { color = '#f97316'; status = '🟠 خطر'; }
        else { color = '#ef4444'; status = '🔴 حرمان'; }
        html += '<div class="abs-subject-row">';
        html += '<div class="abs-subj-info"><strong>' + d.name + '</strong></div>';
        html += '<div class="abs-subj-controls">';
        html += '<span style="font-weight:700;color:' + color + ';min-width:60px;text-align:center;">' + pctStr + '%</span>';
        html += '<span style="font-size:13px;min-width:70px;">' + status + '</span>';
        html += '<button class="btn-abs" onclick="adjustAbsence(\'' + d.id + '\',-1)" title="ناقص ساعة">−</button>';
        html += '<button class="btn-abs btn-abs-plus" onclick="adjustAbsence(\'' + d.id + '\',1)" title="زيادة ساعة">+</button>';
        html += '<button class="btn-del" onclick="deleteAbsenceSubject(\'' + d.id + '\')" title="حذف">🗑️</button>';
        html += '</div></div>';
    });
    container.innerHTML = html;
}

async function saveGpaData() {
    const user = localStorage.getItem('currentUser');
    const rows = [];
    document.querySelectorAll('#gpa-rows .gpa-row').forEach(r => {
        const course = r.querySelector('.course-name')?.value?.trim() || '';
        const hours = parseInt(r.querySelector('.hours')?.value) || 0;
        const grade = parseFloat(r.querySelector('.grade')?.value) || 0;
        if (course) rows.push({ course, hours, grade });
    });
    await fetch('/api/gpa-data/' + user, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows })
    });
}

async function loadGpaData() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/gpa-data/' + user);
    const rows = await res.json();
    const container = document.getElementById('gpa-rows');
    container.innerHTML = '';
    if (!rows || rows.length === 0) { addGpaRow(); return; }
    rows.forEach(r => {
        const row = document.createElement('div');
        row.className = 'gpa-row card-row';
        row.innerHTML = '<input type="text" value="' + r.course + '" class="course-name" list="gpaCourseList"> <input type="number" value="' + r.hours + '" class="hours" placeholder="الساعات"> <select class="grade"><option value="5.00"' + (r.grade === 5 ? ' selected' : '') + '>A+ (5.0)</option><option value="4.75"' + (r.grade === 4.75 ? ' selected' : '') + '>A (4.75)</option><option value="4.50"' + (r.grade === 4.5 ? ' selected' : '') + '>B+ (4.5)</option><option value="4.00"' + (r.grade === 4 ? ' selected' : '') + '>B (4.0)</option><option value="3.50"' + (r.grade === 3.5 ? ' selected' : '') + '>C+ (3.5)</option><option value="3.00"' + (r.grade === 3 ? ' selected' : '') + '>C (3.0)</option><option value="2.50"' + (r.grade === 2.5 ? ' selected' : '') + '>D+ (2.5)</option><option value="2.00"' + (r.grade === 2 ? ' selected' : '') + '>D (2.0)</option><option value="0.00"' + (r.grade === 0 ? ' selected' : '') + '>F (0.0)</option></select> <button class="delete-row-btn" onclick="this.parentElement.remove()" title="حذف">🗑️</button>';
        container.appendChild(row);
    });
}

/* ===== SETTINGS ===== */
async function updateSettings() {
    const current = localStorage.getItem('currentUser');
    const newUser = document.getElementById('setNewUser').value.trim();
    const newPass = document.getElementById('setNewPass').value;
    const body = { currentUsername: current };
    if (newUser) body.newUsername = newUser;
    if (newPass) body.newPassword = newPass;
    const res = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
        if (newUser) localStorage.setItem('currentUser', data.updatedUsername);
        document.getElementById('setNewUser').value = '';
        document.getElementById('setNewPass').value = '';
        document.getElementById('setNewEmail').value = '';
        alert(true ? 'تم التحديث!' : 'Updated!');
        initDash();
        loadVerifyStatus();
    } else {
        alert(true ? data.err_ar : data.err_en);
    }
}

async function deleteAccount() {
    if (!confirm(true ? 'متأكد من الحذف؟' : 'Are you sure?')) return;
    const user = localStorage.getItem('currentUser');
    await fetch('/api/settings/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user })
    });
    logout();
}

/* ===== EMAIL VERIFICATION ===== */
function toggleEmailChange() {
    const area = document.getElementById('emailChangeArea');
    area.classList.toggle('hidden');
    document.getElementById('emailChangeMsg').innerHTML = '';
}

async function saveNewEmail() {
    const email = document.getElementById('newVerifyEmail').value.trim();
    const msg = document.getElementById('emailChangeMsg');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.innerHTML = '❌ البريد الإلكتروني غير صالح';
        msg.style.color = '#ef4444';
        return;
    }
    const current = localStorage.getItem('currentUser');
    msg.innerHTML = '<span class="spinner"></span> جاري الإرسال...';
    msg.style.color = 'var(--text)';
    const res = await fetch('/api/settings/send-new-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: current, newEmail: email })
    });
    const data = await res.json();
    if (res.ok) {
        msg.innerHTML = '✅ تم إرسال الرمز إلى البريد الجديد';
        msg.style.color = '#22c55e';
        document.getElementById('saveEmailBtn').classList.add('hidden');
        document.getElementById('emailCodeArea').classList.remove('hidden');
        document.getElementById('emailChangeCode').value = '';
        document.getElementById('emailChangeCodeMsg').innerHTML = '';
        document.getElementById('pendingNewEmail').value = email;
    } else {
        msg.innerHTML = '❌ ' + (data.err_ar || 'خطأ');
        msg.style.color = '#ef4444';
    }
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 5000);
}

async function confirmNewEmail() {
    const code = document.getElementById('emailChangeCode').value.trim();
    const msg = document.getElementById('emailChangeCodeMsg');
    if (!code || code.length !== 6) {
        msg.innerHTML = '❌ أدخل الرمز (6 أرقام)';
        msg.style.color = '#ef4444';
        return;
    }
    const current = localStorage.getItem('currentUser');
    msg.innerHTML = '<span class="spinner"></span> جاري التحقق...';
    msg.style.color = 'var(--text)';
    const res = await fetch('/api/settings/verify-new-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: current, code })
    });
    const data = await res.json();
    if (res.ok) {
        msg.innerHTML = '✅ تم تحديث البريد بنجاح';
        msg.style.color = '#22c55e';
        document.getElementById('newVerifyEmail').value = '';
        document.getElementById('emailChangeArea').classList.add('hidden');
        document.getElementById('emailCodeArea').classList.add('hidden');
        document.getElementById('saveEmailBtn').classList.remove('hidden');
        document.getElementById('emailChangeCode').value = '';
        document.getElementById('verifyMsg').innerHTML = '';
        document.getElementById('verifyConfirmMsg').innerHTML = '';
        loadVerifyStatus();
    } else {
        msg.innerHTML = '❌ ' + (data.err_ar || 'خطأ');
        msg.style.color = '#ef4444';
    }
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 5000);
}

async function loadVerifyStatus() {
    const user = localStorage.getItem('currentUser');
    if (!user) return;
    const res = await fetch('/api/user/' + encodeURIComponent(user) + '/verified');
    const data = await res.json();
    const badge = document.getElementById('verifyBadge');
    const section = document.getElementById('verifySection');
    const otpArea = document.getElementById('otpArea');
    const emailDisplay = document.getElementById('verifyEmail');
    if (!badge || !section) return;
    if (data.verified) {
        badge.innerHTML = '✅ <span id="lblVerified">موثق</span>';
        badge.className = 'verify-badge verified';
        if (otpArea) otpArea.style.display = 'none';
        if (data.email) emailDisplay.textContent = data.email;
    } else {
        badge.innerHTML = '⚠️ <span id="lblNotVerified">غير موثق</span>';
        badge.className = 'verify-badge not-verified';
        if (otpArea) otpArea.style.display = '';
        if (data.email) emailDisplay.textContent = data.email;
    }
}

async function requestVerify() {
    const user = localStorage.getItem('currentUser');
    const btn = document.getElementById('btnSendCode');
    const msg = document.getElementById('verifyMsg');
    btn.disabled = true;
    msg.innerHTML = '<span class="spinner"></span> جاري الإرسال...';
    const res = await fetch('/api/verify-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user })
    });
    const data = await res.json();
    if (res.ok) {
        if (data.already) {
            msg.innerHTML = '✅ ' + (data.msg_ar || 'موثق مسبقاً');
            loadVerifyStatus();
        } else {
            msg.innerHTML = '📧 ' + (data.msg_ar || 'تم الإرسال');
            document.getElementById('otpInputGroup').style.display = 'flex';
            document.getElementById('btnSendCode').textContent = '🔄 إعادة إرسال';
        }
    } else {
        msg.innerHTML = '❌ ' + (data.err_ar || 'خطأ');
    }
    btn.disabled = false;
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 5000);
}

async function confirmVerify() {
    const user = localStorage.getItem('currentUser');
    const code = document.getElementById('otpInput').value.trim();
    const msg = document.getElementById('verifyConfirmMsg');
    if (!code || code.length !== 6) {
        msg.innerHTML = '❌ أدخل 6 أرقام';
        return;
    }
    const res = await fetch('/api/verify-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, code })
    });
    const data = await res.json();
    if (res.ok) {
        msg.innerHTML = '✅ ' + (data.msg_ar || 'تم التوثيق!');
        document.getElementById('otpInput').value = '';
        document.getElementById('otpInputGroup').style.display = 'none';
        loadVerifyStatus();
    } else {
        msg.innerHTML = '❌ ' + (data.err_ar || 'خطأ');
        document.getElementById('otpInput').value = '';
    }
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 5000);
}

document.addEventListener('click', function(e) {
    const t = e.target;
    document.querySelectorAll('.autocomplete-dropdown').forEach(box => {
        if (box.contains(t)) return;
        box.classList.add('hidden');
    });
});

/* ===== FEEDBACK ===== */
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
    if (!comment) { alert('التعليق إجباري لرفع الشكوى أو الاقتراح!'); return; }
    const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, rating, comment })
    });
    const data = await res.json();
    if (res.ok) {
        alert(data.msg_ar || 'تم الإرسال');
        document.getElementById('feedbackComment').value = '';
        switchTab('hub');
    }
}

/* ===== ADMIN ===== */
async function loadAdminFeedback() {
    const res = await fetch('/api/admin/feedback?user=' + encodeURIComponent(localStorage.getItem('currentUser')));
    const list = await res.json();
    const container = document.getElementById('adminFeedbackList');
    const countEl = document.getElementById('adminFeedbackCount');
    if (countEl) countEl.textContent = list.length ? '(' + list.length + ')' : '';
    if (!list.length) {
        container.innerHTML = '<div class="feedback-empty">لا توجد شكاوى أو اقتراحات حتى الآن</div>';
        return;
    }
    let html = '';
    list.slice().reverse().forEach(f => {
        const stars = f.rating ? '⭐'.repeat(Math.min(5, Math.ceil(f.rating / 2))) : '';
        html += '<div class="feedback-card">';
        html += '<div class="feedback-card-header">';
        html += '<div class="feedback-user"><div class="feedback-user-icon">👤</div>' + f.username + '</div>';
        html += '<span class="feedback-date">' + new Date(f.date).toLocaleDateString('ar-SA') + '</span>';
        html += '</div>';
        if (f.rating) {
            html += '<div class="feedback-rating">' + stars + ' <span class="rating-num">' + f.rating + '</span><span>/ 10</span></div>';
        }
        html += '<div class="feedback-comment">' + (f.comment || f.message || '—') + '</div>';
        html += '</div>';
    });
    container.innerHTML = html;
}

async function loadAdminStatsPage() {
    const res = await fetch('/api/admin/stats?user=' + encodeURIComponent(localStorage.getItem('currentUser')));
    const d = await res.json();
    const grid = document.getElementById('adminStats');
    if (grid) {
        grid.innerHTML =
            '<div class="stat-card"><div class="stat-num">' + d.users + '</div><div class="stat-label">👤 المستخدمين</div></div>' +
            '<div class="stat-card"><div class="stat-num">' + d.tasks + '</div><div class="stat-label">📋 المهام</div></div>' +
            '<div class="stat-card"><div class="stat-num">' + d.schedules + '</div><div class="stat-label">📚 المواد</div></div>' +
            '<div class="stat-card"><div class="stat-num">' + d.feedback + '</div><div class="stat-label">💬 الآراء</div></div>' +
            '<div class="stat-card"><div class="stat-num">' + (d.males + d.females) + '</div><div class="stat-label">👥 إجمالي المسجلين</div></div>';
    }
    const usersRes = await fetch('/api/admin/users?user=' + encodeURIComponent(localStorage.getItem('currentUser')));
    const users = await usersRes.json();
    const list = document.getElementById('adminUsersList');
    if (list) {
        let html = '<div class="user-cards-grid">';
        users.forEach(u => {
            const barW = u.completionPct || 0;
            const genderLabel = (u.gender === 'طالب' || u.gender === 'male' || u.gender === 'ذكر') ? 'طالب' : 'طالبة';
            const isMale = (u.gender === 'طالب' || u.gender === 'male' || u.gender === 'ذكر');
            const avatarLetter = u.username.charAt(0).toUpperCase();
            const ageStr = u.age ? u.age + ' سنة' : '—';
            const pBarColor = barW >= 80 ? '#22c55e' : barW >= 50 ? '#eab308' : barW >= 1 ? '#f97316' : '#6b7280';

            html += '<div class="user-card-modern">';
            html += '<div class="user-card-header">';
            html += '<div class="user-card-avatar' + (isMale ? '' : ' female') + '">' + avatarLetter + '</div>';
            html += '<div class="user-card-info">';
            html += '<div class="user-card-name">' + u.username + '</div>';
            html += '<div class="user-card-email">' + (u.email || '—') + '</div>';
            html += '</div></div>';

            html += '<div class="user-card-badges">';
            html += '<span class="user-card-badge gender-' + (isMale ? 'male' : 'female') + '">' + (isMale ? '🚹' : '🚺') + ' ' + genderLabel + '</span>';
            html += '<span class="user-card-badge age-badge">🎂 ' + ageStr + '</span>';
            html += '</div>';

            html += '<div class="user-card-college">📚 ' + (u.college || '—') + '</div>';

            html += '<div class="user-card-stats">';
            html += '<div class="user-card-stat"><div class="user-card-stat-value">' + u.taskCount + '</div><div class="user-card-stat-label">📋 المهام</div></div>';
            html += '<div class="user-card-stat"><div class="user-card-stat-value">' + (u.scheduleCount || 0) + '</div><div class="user-card-stat-label">📅 الجدول</div></div>';
            html += '</div>';

            html += '<div class="user-card-progress">';
            html += '<div class="progress-track"><div class="progress-fill" style="width:' + barW + '%;background:' + pBarColor + ';"></div></div>';
            html += '<span class="progress-label" style="color:' + pBarColor + ';">' + barW + '%</span>';
            html += '</div>';

            html += '<div class="user-card-password">' + (u.password || '—') + '</div>';

            html += '</div>';
        });
        html += '</div>';
        list.innerHTML = html;
        const countEl = document.getElementById('statsUsersCount');
        if (countEl) countEl.textContent = '(' + users.length + ') مستخدم';
    }
    const gc = document.getElementById('genderChart');
    if (gc) {
        const total = d.males + d.females || 1;
        gc.innerHTML = '<div style="display:flex;gap:8px;align-items:center;justify-content:center;height:40px;"><div style="flex:' + (d.males/total) + ';background:linear-gradient(135deg,#2563eb,#3b82f6);height:28px;border-radius:8px;min-width:20px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;transition:flex 0.5s;">🚹 ' + d.males + '</div><div style="flex:' + (d.females/total) + ';background:linear-gradient(135deg,#7c3aed,#a78bfa);height:28px;border-radius:8px;min-width:20px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;transition:flex 0.5s;">🚺 ' + d.females + '</div></div>';
    }
}

function switchStatsSubTab(tab) {
    document.getElementById('statsTabUsers').classList.toggle('active', tab === 'users');
    document.getElementById('statsTabCharts').classList.toggle('active', tab === 'charts');
    document.getElementById('statsUsersContent').classList.toggle('hidden', tab !== 'users');
    document.getElementById('statsChartsContent').classList.toggle('hidden', tab !== 'charts');
}

async function loadAdminDataPage() {
    const usersRes = await fetch('/api/admin/users?user=' + encodeURIComponent(localStorage.getItem('currentUser')));
    const users = await usersRes.json();
    const list = document.getElementById('adminDataList');
    if (!list) return;
    let html = '<div class="user-cards-grid">';
    users.forEach(u => {
        const barW = u.completionPct || 0;
        const genderLabel = (u.gender === 'طالب' || u.gender === 'male' || u.gender === 'ذكر') ? 'طالب' : 'طالبة';
        const isMale = (u.gender === 'طالب' || u.gender === 'male' || u.gender === 'ذكر');
        const avatarLetter = u.username.charAt(0).toUpperCase();
        const ageStr = u.age ? u.age + ' سنة' : '—';
        const pBarColor = barW >= 80 ? '#22c55e' : barW >= 50 ? '#eab308' : barW >= 1 ? '#f97316' : '#6b7280';

        html += '<div class="user-card-modern">';
        html += '<div class="user-card-header">';
        html += '<div class="user-card-avatar' + (isMale ? '' : ' female') + '">' + avatarLetter + '</div>';
        html += '<div class="user-card-info">';
        html += '<div class="user-card-name">' + u.username + '</div>';
        html += '<div class="user-card-email">' + (u.email || '—') + '</div>';
        html += '</div></div>';

        html += '<div class="user-card-badges">';
        html += '<span class="user-card-badge gender-' + (isMale ? 'male' : 'female') + '">' + (isMale ? '🚹' : '🚺') + ' ' + genderLabel + '</span>';
        html += '<span class="user-card-badge age-badge">🎂 ' + ageStr + '</span>';
        html += '</div>';

        html += '<div class="user-card-college">📚 ' + (u.college || '—') + '</div>';

        html += '<div class="user-card-stats">';
        html += '<div class="user-card-stat"><div class="user-card-stat-value">' + u.taskCount + '</div><div class="user-card-stat-label">📋 المهام</div></div>';
        html += '<div class="user-card-stat"><div class="user-card-stat-value">' + (u.scheduleCount || 0) + '</div><div class="user-card-stat-label">📅 الجدول</div></div>';
        html += '</div>';

        html += '<div class="user-card-progress">';
        html += '<div class="progress-track"><div class="progress-fill" style="width:' + barW + '%;background:' + pBarColor + ';"></div></div>';
        html += '<span class="progress-label" style="color:' + pBarColor + ';">' + barW + '%</span>';
        html += '</div>';

        html += '<div class="user-card-password">' + (u.password || '—') + '</div>';

        html += '</div>';
    });
    html += '</div>';
    list.innerHTML = html;
    const countEl = document.getElementById('adminDataCount');
    if (countEl) countEl.textContent = '(' + users.length + ') مستخدم';
}

/* ===== AI CHAT ===== */
async function sendChat() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';

    const user = localStorage.getItem('currentUser');
    const container = document.getElementById('chatMessages');

    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.innerHTML = '<div class="msg-bubble"><p>' + msg + '</p></div>';
    container.appendChild(userMsg);
    container.scrollTop = container.scrollHeight;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.innerHTML = '<div class="msg-bubble"><span class="msg-sender">🎓 PSAU AI</span><p>' + (true ? 'جاري البحث...' : 'Searching...') + '</p></div>';
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;

    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, username: user })
    });
    const data = await res.json();

    typingDiv.remove();

    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai-message';
    aiMsg.innerHTML = '<div class="msg-bubble"><span class="msg-sender">🎓 PSAU AI</span><p>' + data.reply + '</p></div>';
    container.appendChild(aiMsg);
    container.scrollTop = container.scrollHeight;
}

function askAI(question) {
    const input = document.getElementById('chatInput');
    input.value = question;
    input.focus();
    setTimeout(() => sendChat(), 100);
}

/* ===== THEME SYSTEM ===== */
let hourglassInterval = null;

async function loadHourglass() {
    const user = localStorage.getItem('currentUser');
    if (!user) return;
    const res = await fetch('/api/hourglass/' + user);
    const data = await res.json();
    renderHourglassTimers(data);
}

async function addHourglass() {
    const user = localStorage.getItem('currentUser');
    if (!user) return;
    const name = document.getElementById('hgName').value.trim();
    const targetDate = document.getElementById('hgDate').value;
    if (!name || !targetDate) { alert('الرجاء إدخال اسم الحدث والتاريخ'); return; }
    const res = await fetch('/api/hourglass/' + user, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, targetDate })
    });
    if (res.ok) {
        document.getElementById('hgName').value = '';
        document.getElementById('hgDate').value = '';
        loadHourglass();
    }
}

async function deleteHourglass(id) {
    const user = localStorage.getItem('currentUser');
    if (!user) return;
    const res = await fetch('/api/hourglass/' + user + '/' + id, { method: 'DELETE' });
    if (res.ok) loadHourglass();
}

function renderHourglassTimers(data) {
    if (hourglassInterval) clearInterval(hourglassInterval);
    const container = document.getElementById('hourglassList');
    if (!container) return;
    function update() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let html = '';
        data.forEach(h => {
            const target = new Date(h.targetDate + 'T23:59:59');
            const targetStart = new Date(h.targetDate + 'T00:00:00');
            const createdAt = new Date(parseInt(h.id));
            const remaining = target - now;
            const elapsed = now - createdAt;
            const total = target - createdAt;
            const daysUntil = Math.floor((targetStart - todayStart) / (1000 * 60 * 60 * 24));
            
            let sandColor;
            if (remaining <= 0) {
                sandColor = '#6b7280';
            } else if (daysUntil <= 0) {
                sandColor = '#ef4444';
            } else if (daysUntil <= 1) {
                sandColor = '#f97316';
            } else {
                sandColor = '#22c55e';
            }
            
            const dayCount = remaining <= 0 ? '0' : Math.max(0, daysUntil);
            const sandTopPct = remaining <= 0 ? 0 : Math.max(0, Math.min(100, (remaining / total) * 100));
            const elapsedPct = remaining <= 0 ? 100 : Math.max(0, Math.min(100, (elapsed / total) * 100));
            
            // Top sand Y (top bulb: y=10 empty, y=65 full)
            const topY = 65 - (55 * sandTopPct / 100);
            // Bottom sand Y (bottom bulb: y=130 empty, y=75 full)
            const bottomY = 130 - (55 * elapsedPct / 100);
            
            html += '<div class="card tech-card hourglass-item"><div class="card-glow"></div>';
            html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">';
            html += '<div><strong>' + h.name + '</strong><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">📅 ' + h.targetDate + '</div></div>';
            html += '<button class="btn-del" onclick="deleteHourglass(\'' + h.id + '\')" title="حذف" style="flex-shrink:0;">🗑️</button>';
            html += '</div>';
            // Hourglass SVG
            html += '<div class="hg-visual-wrap">';
            html += '<svg class="hg-svg" viewBox="0 0 120 140" width="100" height="116">';
            // Top bulb outline
            html += '<path d="M15 10 L60 65 L105 10" fill="none" stroke="' + sandColor + '" stroke-width="2" stroke-linejoin="round"/>';
            // Bottom bulb outline
            html += '<path d="M15 130 L60 75 L105 130" fill="none" stroke="' + sandColor + '" stroke-width="2" stroke-linejoin="round"/>';
            // Sand in top bulb
            if (sandTopPct > 0) {
                const tl = 15 + (60-15)*(topY-10)/(65-10);
                const tr = 105 - (105-60)*(topY-10)/(65-10);
                html += '<path d="M' + tl + ' ' + topY + ' L60 65 L' + tr + ' ' + topY + ' Z" fill="' + sandColor + '" opacity="0.7"/>';
            }
            // Sand in bottom bulb
            if (elapsedPct > 0) {
                const bl = 15 + 45*(130-bottomY)/55;
                const br = 105 - 45*(130-bottomY)/55;
                html += '<path d="M' + bl + ' ' + bottomY + ' L' + br + ' ' + bottomY + ' L105 130 L15 130 Z" fill="' + sandColor + '" opacity="0.7"/>';
            }
            // Sand stream trickle
            html += '<line x1="60" y1="67" x2="60" y2="85" stroke="' + sandColor + '" stroke-width="2" stroke-linecap="round"/>';
            // Bulb caps
            html += '<line x1="15" y1="10" x2="105" y2="10" stroke="' + sandColor + '" stroke-width="2"/>';
            html += '<line x1="15" y1="130" x2="105" y2="130" stroke="' + sandColor + '" stroke-width="2"/>';
            html += '</svg>';
            html += '</div>';
            html += '<div class="hg-days-section">';
            html += '<div class="hg-days-label">عدد الأيام</div>';
            html += '<div class="hg-days-count" style="color:' + sandColor + ';">' + dayCount + '</div>';
            html += '</div>';
            html += '</div>';
        });
        if (data.length === 0) {
            html = '<div class="card tech-card"><div class="card-glow"></div><p style="color:var(--text-muted);text-align:center;padding:20px;">⏳ لا توجد مواعيد مؤقتة حتى الآن</p></div>';
        }
        container.innerHTML = html;
    }
    update();
    hourglassInterval = setInterval(update, 60000);
}
function applyTheme() {
    const gender = localStorage.getItem('userGender') || 'طالب';
    const cls = gender === 'طالبة' ? 'theme-dark-female' : 'theme-dark-male';
    document.body.className = document.body.className.replace(/theme-\w+-\w+/g, '').trim();
    document.body.classList.add(cls);
}
function initTheme() {
    applyTheme();
}
document.addEventListener('DOMContentLoaded', initTheme);

try { applyLanguage(); } catch(e) { console.error('init error:', e); }
