const translations = {
    ar: {
        logoText: "جامعة الأمير سطام بن عبدالعزيز",
        subtitleText: "البوابة الطلابية الذكية مع المساعد AI",
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
        hubAITitle: "المساعد الذكي AI", hubAIDesc: "اسأل عن جامعة الأمير سطام بن عبدالعزيز واحصل على إجابات فورية",
        hubTasksTitle: "إدارة المهام", hubTasksDesc: "متابعة الواجبات والاختبارات وتصنيفها حسب الأولوية",
        hubGpaTitle: "حاسبة المعدل", hubGpaDesc: "احتساب المعدل الفصلي والتراكمي بطريقة ذكية",
        hubSchedTitle: "جدول المحاضرات", hubSchedDesc: "تنظيم المحاضرات بقوالب تفاعلية متعددة",
        hubCoursesTitle: "المقررات", hubCoursesDesc: "مركز ذكي لكل مقرر يعرض محاضراته ومهامه",
        hubFeedTitle: "اقتراحات وتقييم", hubFeedDesc: "شاركنا رأيك وتقييمك للمنصة",
        hubSetTitle: "الإعدادات", hubSetDesc: "تحديث بيانات الدخول أو حذف الحساب",
        hubAdminTitle: "الشكاوى والاقتراحات", hubAdminDesc: "عرض ملاحظات المستخدمين",
        titleAdminFeedback: "🛡️ لوحة الشكاوى والاقتراحات",
        adminFeedbackEmpty: "لا توجد شكاوى أو اقتراحات حتى الآن",
        btnRefreshFeed: "🔄 تحديث",
        mHub: "🏠 البوابة", mAI: "🤖 المساعد AI", mTasks: "📝 المهام", mGpa: "📊 المعدل",
        mSchedule: "📅 الجدول", mCourses: "📚 المقررات", mFeedback: "💬 اقتراحات وتقييم", mSettings: "⚙️ الإعدادات", mLogout: "🚪 خروج",
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
        titleSchedule: "📅 جدول المحاضرات", lblSelectTheme: "🎨 القالب:",
        hAddLecture: "إضافة محاضرة", hSun: "الأحد", hMon: "الإثنين", hTue: "الثلاثاء", hWed: "الأربعاء", hThu: "الخميس",
        titleCourses: "📚 المقررات الدراسية", hAddCourse: "تسجيل مقرر جديد", btnAddCourse: "📌 تسجيل",
        lblMyCourses: "مقرراتي", lblSelectCourseHint: "اختر مقرراً من القائمة",
        lblCourseTimes: "📅 أوقات المحاضرات", lblCourseTasks: "📝 المهام",
        titleFeedback: "💬 اقتراحات وتقييم", lblSendOpinion: "شاركنا رأيك",
        feedbackDesc: "نحن نقدر ملاحظاتك لتطوير المنصة", lblRate: "التقييم:", lblYourComment: "رسالتك",
        titleSettings: "⚙️ الإعدادات", hUpdate: "تحديث الحساب", lNewUser: "اسم مستخدم جديد", lNewPass: "كلمة مرور جديدة",
        pDeleteDesc: "حذف الحساب وجميع البيانات نهائياً",
        lblPrevGpa: "المعدل التراكمي السابق", lblPrevHours: "الساعات السابقة",
        lblCurrGpa: "معدل الفصل الحالي", lblCurrHours: "ساعات الفصل الحالي",
        btnCalcCum: "💻 احسب التراكمي", lblCumRes: "المعدل التراكمي:",
        hubAdminStatsTitle: "الإحصائيات", hubAdminStatsDesc: "بيانات الموقع والرسومات البيانية",
        mAdminStatsLabel: "الإحصائيات", titleAdminStats: "📈 الإحصائيات",
        statsTabUsersLabel: "جدول المستخدمين", statsTabChartsLabel: "رسومات بيانية",
        lblForgotUser2: "1. اسم المستخدم", lblForgotAge2: "2. العمر", lblForgotGender2: "3. الجنس", lblForgotCollege2: "4. الكلية",
        lblThemeLabel: "الوضع:",
        scheduleTimeline: "زمني", scheduleCards: "بطاقات", scheduleMinimal: "بسيط",
    }
};

let activeCourseName = '';

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
    const username = document.getElementById('regUser').value.trim();
    const password = document.getElementById('regPass').value;
    const age = document.getElementById('regAge').value;
    const gender = document.getElementById('regGender').value;
    const college = document.getElementById('regCollege').value;
    if (!username || !password || !age || !gender || !college) {
        alert(true ? 'أكمل جميع البيانات!' : 'Fill all fields!');
        return;
    }
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, age, gender, college })
    });
    const data = await res.json();
    if (res.ok) {
        alert(true ? data.msg_ar : data.msg_en);
        toggleCard('loginCard');
    } else {
        alert(true ? data.err_ar : data.err_en);
    }
}

let currentRole = 'student';

function setRole(role) {
    currentRole = role;
    document.getElementById('roleStudent').classList.toggle('active', role === 'student');
    document.getElementById('roleAdmin').classList.toggle('active', role === 'admin');
    document.getElementById('loginLinks').style.display = role === 'admin' ? 'none' : '';
    document.getElementById('loginBtnText').innerText = role === 'admin'
        ? (true ? 'دخول كمشرف' : 'Login as Admin')
        : (true ? 'دخول كطالب' : 'Login as Student');
    document.getElementById('loginTitleText').innerText = role === 'admin'
        ? (true ? 'دخول المشرفين' : 'Admin Login')
        : (true ? 'تسجيل الدخول' : 'Student Login');
    document.getElementById('loginUser').placeholder = role === 'admin' ? (true ? 'اسم المستخدم المشرف' : 'Admin Username') : 'Username';
}

async function login() {
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
}

async function forgotStep1() {
    const username = document.getElementById('forgotUser').value.trim();
    if (!username) {
        alert(true ? 'أدخل اسم المستخدم!' : 'Enter username!');
        return;
    }
    // Check if user exists
    const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (!data.found) {
        alert(true ? 'اسم المستخدم غير موجود!' : 'Username not found!');
        return;
    }
    // Pre-fill the identity form with the username
    document.getElementById('forgotUser2').value = username;
    document.getElementById('forgotIdentityForm').classList.remove('hidden');
}

async function forgotVerifyIdentity() {
    const username = document.getElementById('forgotUser2').value.trim();
    const college = document.getElementById('forgotCollege').value;
    const age = document.getElementById('forgotAge').value;
    const gender = document.getElementById('forgotGender').value;
    if (!username || !age || !college || !gender) {
        alert(true ? 'أكمل جميع البيانات!' : 'Fill all fields!');
        return;
    }
    if (gender === '' || college === '') {
        alert(true ? 'اختر الجنس والكلية!' : 'Select gender and college!');
        return;
    }
    const res = await fetch('/api/forgot-verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, college, age, gender })
    });
    const data = await res.json();
    if (data.found && data.password) {
        document.getElementById('forgotIdentityForm').classList.add('hidden');
        document.getElementById('forgotIdentityResult').classList.remove('hidden');
        document.getElementById('forgotPasswordDisplay').innerText = data.password;
    } else {
        alert(true ? 'إجابة خاطئة! تأكد من معلوماتك وحاول مرة أخرى.' : 'Wrong answer! Check your info and try again.');
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
    applyLanguage();
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
    if (role === 'admin') {
        document.getElementById('hubAdminCard').style.display = '';
        document.getElementById('hubAdminStatsCard').style.display = '';
        document.getElementById('mAdminFeedback').style.display = '';
        document.getElementById('mAdminStats').style.display = '';
        adminCards.forEach(el => el.style.display = '');
    }
    initDayChips();
    loadTasks();
    loadSchedule();
    loadCourses();
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
        'schedule': 'mSchedule', 'courses': 'mCourses', 'feedback': 'mFeedback',
        'settings': 'mSettings', 'adminFeedback': 'mAdminFeedback', 'adminStats': 'mAdminStats' };
    const link = document.getElementById(map[tabId]);
    if (link) link.classList.add('active');
    if (tabId === 'adminFeedback') { loadAdminFeedback(); }
    if (tabId === 'adminStats') { loadAdminStatsPage(); }
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

/* ===== DAY CHIPS ===== */
function initDayChips() {
    document.querySelectorAll('.day-btn').forEach(chip => {
        chip.addEventListener('click', function () {
            document.querySelectorAll('.day-btn').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function getSelectedDay() {
    const active = document.querySelector('.day-btn.active');
    return active ? active.getAttribute('data-day') : 'Sunday';
}

/* ===== SCHEDULE THEMES ===== */
let activeTheme = 'timeline';
function changeScheduleTheme(name) {
    ['timeline', 'cards', 'minimal'].forEach(t => {
        const btn = document.getElementById('theme-' + t);
        if (btn) btn.classList.remove('active');
        document.getElementById('scheduleContainer').classList.remove('theme-' + t);
    });
    const btn = document.getElementById('theme-' + name);
    if (btn) btn.classList.add('active');
    document.getElementById('scheduleContainer').classList.add('theme-' + name);
    activeTheme = name;
    loadSchedule();
}

/* ===== EMOJI RATING ===== */
function updateEmoji(val) {
    document.getElementById('ratingVal').innerText = val + ' / 10';
    const pic = document.getElementById('emojiPic');
    if (val >= 9) pic.innerText = '😍';
    else if (val >= 7) pic.innerText = '🙂';
    else if (val >= 5) pic.innerText = '😐';
    else if (val >= 3) pic.innerText = '🙁';
    else pic.innerText = '😭';
}

/* ===== FEEDBACK ===== */
async function submitFeedback() {
    const user = localStorage.getItem('currentUser');
    const rating = document.getElementById('ratingRange').value;
    const comment = document.getElementById('feedbackComment').value.trim();
    if (!comment) {
        alert(true ? 'التعليق إجباري!' : 'Comment is required!');
        return;
    }
    const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, rating, comment })
    });
    const data = await res.json();
    alert(true ? data.msg_ar : data.msg_en);
    document.getElementById('feedbackComment').value = '';
}

/* ===== ADMIN STATS ===== */
function adminOpts() { return '?user=' + encodeURIComponent(localStorage.getItem('currentUser') || ''); }

async function loadAdminStats() {
    const res = await fetch('/api/admin/stats' + adminOpts());
    if (res.status === 403) return;
    const s = await res.json();
    document.getElementById('adminStats').innerHTML =
        '<div class="stat-box"><span class="stat-num">' + s.users + '</span><span class="stat-label">' + (true ? 'مستخدم' : 'Users') + '</span></div>' +
        '<div class="stat-box"><span class="stat-num">' + s.males + '♂️ / ' + s.females + '♀️</span><span class="stat-label">' + (true ? 'ذكور / إناث' : 'M/F') + '</span></div>' +
        '<div class="stat-box"><span class="stat-num">' + s.tasks + '</span><span class="stat-label">' + (true ? 'مهمة' : 'Tasks') + '</span></div>' +
        '<div class="stat-box"><span class="stat-num">' + s.courses + '</span><span class="stat-label">' + (true ? 'مقرر' : 'Courses') + '</span></div>' +
        '<div class="stat-box"><span class="stat-num">' + s.schedules + '</span><span class="stat-label">' + (true ? 'جدول' : 'Schedules') + '</span></div>' +
        '<div class="stat-box"><span class="stat-num">' + s.feedback + '</span><span class="stat-label">' + (true ? 'اقتراح' : 'Feedback') + '</span></div>';
}

function switchStatsSubTab(tab) {
    document.getElementById('statsUsersContent').classList.toggle('hidden', tab !== 'users');
    document.getElementById('statsChartsContent').classList.toggle('hidden', tab !== 'charts');
    document.getElementById('statsTabUsers').classList.toggle('active', tab === 'users');
    document.getElementById('statsTabCharts').classList.toggle('active', tab === 'charts');
    if (tab === 'charts') {
        loadAdminStats();
        renderCharts();
    } else {
        loadAdminUsers();
    }
}

async function loadAdminStatsPage() {
    switchStatsSubTab('users');
    loadAdminUsers();
}

async function renderCharts() {
    const res = await fetch('/api/admin/users' + adminOpts());
    if (res.status === 403) return;
    const users = await res.json();
    if (!users.length) return;

    // Gender distribution
    const males = users.filter(u => u.gender === 'ذكر').length;
    const females = users.filter(u => u.gender === 'أنثى').length;
    const total = users.length;
    document.getElementById('genderChart').innerHTML =
        '<div class="pie-chart" style="--pct-m:' + (males/total*100) + ';--pct-f:' + (females/total*100) + '">' +
            '<div class="pie-label"><span style="color:#2563eb">♂️ ذكور ' + males + '</span> / <span style="color:#ec4899">♀️ إناث ' + females + '</span></div>' +
        '</div>' +
        '<div class="bar-h">' +
            '<div class="bar-h-fill" style="width:' + (males/total*100) + '%;background:#2563eb"></div>' +
            '<div class="bar-h-fill" style="width:' + (females/total*100) + '%;background:#ec4899"></div>' +
        '</div>';

    // Age distribution
    const ageGroups = { '15-18': 0, '19-21': 0, '22-25': 0, '26-30': 0, '30+': 0 };
    users.forEach(u => {
        const a = parseInt(u.age);
        if (a <= 18) ageGroups['15-18']++;
        else if (a <= 21) ageGroups['19-21']++;
        else if (a <= 25) ageGroups['22-25']++;
        else if (a <= 30) ageGroups['26-30']++;
        else ageGroups['30+']++;
    });
    const maxAge = Math.max(...Object.values(ageGroups), 1);
    const avgAge = (users.reduce((s, u) => s + parseInt(u.age), 0) / total).toFixed(1);
    document.getElementById('ageChart').innerHTML =
        '<p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">' + (true ? 'متوسط الأعمار: ' : 'Avg age: ') + '<strong>' + avgAge + '</strong></p>' +
        Object.entries(ageGroups).map(([label, count]) =>
            '<div class="bar-v-item"><span class="bar-v-label">' + label + '</span><div class="bar-v-track"><div class="bar-v-fill" style="height:' + (count/maxAge*100) + '%"></div></div><span class="bar-v-count">' + count + '</span></div>'
        ).join('');

    // College distribution
    const colleges = {};
    users.forEach(u => { colleges[u.college] = (colleges[u.college] || 0) + 1; });
    const sortedCols = Object.entries(colleges).sort((a, b) => b[1] - a[1]);
    const maxCol = Math.max(...sortedCols.map(c => c[1]), 1);
    document.getElementById('collegeChart').innerHTML =
        sortedCols.map(([name, count]) =>
            '<div class="bar-h-item"><span class="bar-h-label">' + name + '</span><div class="bar-h-track"><div class="bar-h-fill" style="width:' + (count/maxCol*100) + '%"></div></div><span class="bar-h-count">' + count + '</span></div>'
        ).join('');

    // Activity: users with tasks vs without, etc.
    const taskRes = await fetch('/api/admin/stats' + adminOpts());
    const stats = await taskRes.json();
    document.getElementById('activityChart').innerHTML =
        '<div class="activity-stats">' +
            '<div class="activity-item"><span class="activity-icon">📝</span><span>' + (true ? 'لديهم مهام' : 'Have tasks') + '</span><strong>' + stats.activeUsers + '</strong></div>' +
            '<div class="activity-item"><span class="activity-icon">📚</span><span>' + (true ? 'لديهم مقررات' : 'Have courses') + '</span><strong>' + stats.usersWithCourses + '</strong></div>' +
            '<div class="activity-item"><span class="activity-icon">🗓️</span><span>' + (true ? 'لديهم جداول' : 'Have schedules') + '</span><strong>' + stats.usersWithSchedules + '</strong></div>' +
            '<div class="activity-item"><span class="activity-icon">💬</span><span>' + (true ? 'أرسلوا اقتراحات' : 'Sent feedback') + '</span><strong>' + stats.feedback + '</strong></div>' +
        '</div>';
}

async function loadAdminUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    const res = await fetch('/api/admin/users' + adminOpts());
    if (res.status === 403) { container.innerHTML = ''; return; }
    const users = await res.json();
    const countEl = document.getElementById('statsUsersCount');
    if (countEl) countEl.innerText = (true ? 'إجمالي ' : 'Total ') + users.length + (true ? ' مستخدم' : ' users');
    if (!users.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">' + (true ? 'لا يوجد طلاب مسجلين' : 'No students registered') + '</p>';
        return;
    }
    let html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>#</th><th>' + (true ? 'اليوزر' : 'User') + '</th><th>' + (true ? 'العمر' : 'Age') + '</th><th>' + (true ? 'الجنس' : 'Gender') + '</th><th>' + (true ? 'الكلية' : 'College') + '</th><th>' + (true ? 'الرمز' : 'Password') + '</th></tr></thead><tbody>';
    users.forEach((u, i) => {
        html += '<tr><td>' + (i + 1) + '</td><td>' + u.username + '</td><td>' + u.age + '</td><td>' + u.gender + '</td><td>' + u.college + '</td><td><span class="pwd-mask" onclick="this.innerText=this.innerText===\'••••••\'?\'' + u.password + '\':\'••••••\'">••••••</span></td></tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

/* ===== ADMIN FEEDBACK ===== */
async function loadAdminFeedback() {
    const container = document.getElementById('adminFeedbackList');
    const countEl = document.getElementById('adminFeedbackCount');
    const res = await fetch('/api/feedback' + adminOpts());
    if (res.status === 403) { container.innerHTML = ''; if (countEl) countEl.innerText = ''; return; }
    const list = await res.json();
    if (!list.length) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px;" id="adminFeedbackEmpty">' + (true ? 'لا توجد شكاوى أو اقتراحات حتى الآن' : 'No feedback or suggestions yet') + '</p>';
        if (countEl) countEl.innerText = '';
        return;
    }
    countEl.innerText = (true ? '📊 إجمالي ' + list.length + ' اقتراح' : '📊 Total ' + list.length + ' feedback');
    let html = '';
    list.slice().reverse().forEach(f => {
        const stars = '⭐'.repeat(Math.round(f.rating / 2));
        const date = new Date(f.date).toLocaleDateString('ar-SA');
        html += '<div class="admin-feedback-item"><div class="feed-head"><strong>' + f.username + '</strong> <span class="feed-rating">' + stars + ' ' + f.rating + '/10</span></div><p class="feed-comment">' + f.comment + '</p><span class="feed-date">' + date + '</span></div>';
    });
    container.innerHTML = html;
}

/* ===== TASKS ===== */
function taskPriorityLabel(p) {
    const m = { urgent: '🔴 عاجل', important: '⚠️ هام', normal: '🔵 اعتيادي' };
    return m[p] || m.normal;
}

async function loadTasks() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/tasks/' + user);
    const tasks = await res.json();
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    const lang = 'ar';

    // Stats
    document.getElementById('taskStatsPending').innerText = pending.length;
    document.getElementById('taskStatsDone').innerText = completed.length;
    document.getElementById('taskStatsBox').classList.remove('hidden');

    // Render pending by type
    ['daily', 'weekly', 'monthly', 'general'].forEach(t => {
        const ul = document.getElementById('list-' + t);
        ul.innerHTML = '';
        const items = pending.filter(task => task.type === t);
        items.forEach((task, idx) => {
            const realIdx = tasks.indexOf(task);
            const li = document.createElement('li');
            const pClass = 'btn-priority btn-priority-' + task.priority;
            li.innerHTML = '<label class="task-check-wrap"><input type="checkbox" onchange="toggleTask(' + realIdx + ')"><span class="check-mark"></span></label><span class="task-text">' + task.text + '</span><button class="' + pClass + '" onclick="event.stopPropagation()">' + taskPriorityLabel(task.priority) + '</button><button class="btn-del" onclick="deleteTask(' + realIdx + ')" title="حذف">🗑️</button>';
            li.className = task.completed ? 'task-done' : '';
            ul.appendChild(li);
        });
    });
    // Render completed in its own list
    const completedUl = document.getElementById('list-completed');
    if (completedUl) {
        completedUl.innerHTML = '';
        completed.forEach((task, idx) => {
            const realIdx = tasks.indexOf(task);
            const li = document.createElement('li');
            li.innerHTML = '<label class="task-check-wrap"><input type="checkbox" checked onchange="toggleTask(' + realIdx + ')"><span class="check-mark"></span></label><span class="task-text task-text-done">' + task.text + '</span><button class="btn-priority btn-priority-' + task.priority + '">' + taskPriorityLabel(task.priority) + '</button><button class="btn-del" onclick="deleteTask(' + realIdx + ')" title="حذف">🗑️</button>';
            li.className = 'task-done';
            completedUl.appendChild(li);
        });
    }
}

async function toggleTask(idx) {
    const user = localStorage.getItem('currentUser');
    await fetch('/api/tasks/' + user + '/' + idx + '/toggle', { method: 'PATCH' });
    loadTasks();
}

async function addTask() {
    const text = document.getElementById('taskText').value.trim();
    const type = document.getElementById('taskType').value;
    const priority = document.getElementById('taskPriority').value;
    if (!text) return;
    const user = localStorage.getItem('currentUser');
    await fetch('/api/tasks/' + user, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type, priority })
    });
    document.getElementById('taskText').value = '';
    loadTasks();
}

async function deleteTask(idx) {
    const user = localStorage.getItem('currentUser');
    await fetch('/api/tasks/' + user + '/' + idx, { method: 'DELETE' });
    loadTasks();
}

/* ===== GPA ===== */
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

function addGpaRow(courseName) {
    const container = document.getElementById('gpa-rows');
    const row = document.createElement('div');
    row.className = 'gpa-row';
    const name = courseName || '';
    row.innerHTML = '<input type="text" value="' + name + '" placeholder="' + (true ? 'المقرر' : 'Course') + '" class="course-name" list="gpaCourseList"><input type="number" class="hours" placeholder="' + (true ? 'الساعات' : 'Hours') + '" min="1" max="6"><select class="grade"><option value="5.00">A+ (5.0)</option><option value="4.75">A (4.75)</option><option value="4.50">B+ (4.5)</option><option value="4.00">B (4.0)</option><option value="3.50">C+ (3.5)</option><option value="3.00">C (3.0)</option><option value="2.50">D+ (2.5)</option><option value="2.00">D (2.0)</option><option value="0.00">F (0.0)</option></select><button class="btn-icon" onclick="this.parentElement.remove()">✕</button>';
    container.appendChild(row);
}

async function importGpaCourses() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/courses/' + user);
    const courses = await res.json();
    if (!courses.length) {
        alert(true ? 'لا توجد مقررات محفوظة. أضف مقرراتك أولاً.' : 'No saved courses. Add courses first.');
        return;
    }
    document.getElementById('gpa-rows').innerHTML = '';
    courses.forEach(c => addGpaRow(c));
    addGpaRow();
}

function calculateGPA() {
    const hrs = document.querySelectorAll('.hours');
    const grds = document.querySelectorAll('.grade');
    let points = 0, total = 0;
    for (let i = 0; i < hrs.length; i++) {
        const h = parseFloat(hrs[i].value);
        const g = parseFloat(grds[i].value);
        if (!isNaN(h) && h > 0) { points += g * h; total += h; }
    }
    if (total === 0) return;
    const gpa = (points / total).toFixed(2);
    document.getElementById('gpaResult').classList.remove('hidden');
    document.getElementById('gpaVal').innerText = gpa;
}

function calculateCumulativeGPA() {
    const prevGpa = parseFloat(document.getElementById('prevGpa').value);
    const prevHours = parseFloat(document.getElementById('prevHours').value);
    const currGpa = parseFloat(document.getElementById('currGpa').value);
    const currHours = parseFloat(document.getElementById('currHours').value);
    if (isNaN(prevGpa) || isNaN(prevHours) || isNaN(currGpa) || isNaN(currHours)) {
        alert(true ? 'أكمل جميع الحقول!' : 'Fill all fields!');
        return;
    }
    const totalPts = (prevGpa * prevHours) + (currGpa * currHours);
    const totalHrs = prevHours + currHours;
    const result = (totalPts / totalHrs).toFixed(2);
    document.getElementById('gpaCumResult').classList.remove('hidden');
    document.getElementById('gpaCumVal').innerText = result;
}

/* ===== SCHEDULE ===== */
async function loadSchedule() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/schedule/' + user);
    const list = await res.json();
    const container = document.getElementById('scheduleContainer');
    const dayLabels = { Sunday: 'الأحد', Monday: 'الإثنين', Tuesday: 'الثلاثاء', Wednesday: 'الأربعاء', Thursday: 'الخميس' };
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const theme = activeTheme || 'timeline';

    if (theme === 'timeline') {
        container.innerHTML = ['Sunday','Monday','Tuesday','Wednesday','Thursday'].map(d => {
            const items = list.filter(s => s.day === d);
            const isToday = d === today;
            const ic = items.map((s, idx) => {
                const realIdx = list.indexOf(s);
                return '<div class="sched-item"><div class="sched-item-info"><span class="sched-subj">' + s.subject + '</span><span class="sched-time">' + s.timeFrom + ' → ' + s.timeTo + '</span></div><button class="btn-del" onclick="deleteSchedule(' + realIdx + ')" title="حذف">🗑️</button></div>';
            }).join('');
            return '<div class="sched-day ' + (isToday ? 'sched-today' : '') + '"><div class="sched-day-header" onclick="toggleSchedDay(this)"><span class="sched-day-name">' + dayLabels[d] + '</span><span class="sched-day-count">' + items.length + '</span><svg class="sched-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div><div class="sched-day-body">' + (items.length ? ic : '<p class="sched-empty">' + (true ? 'لا توجد محاضرات' : 'No lectures') + '</p>') + '</div></div>';
        }).join('');
    } else if (theme === 'cards') {
        container.innerHTML = ['Sunday','Monday','Tuesday','Wednesday','Thursday'].map(d => {
            const items = list.filter(s => s.day === d);
            if (!items.length) return '';
            const isToday = d === today;
            const ic = items.map((s, idx) => {
                const realIdx = list.indexOf(s);
                return '<div class="sched-card-item"><div class="sched-card-badge">' + (isToday ? '⭐ ' : '') + dayLabels[d] + '</div><div class="sched-card-body"><span class="sched-subj">' + s.subject + '</span><span class="sched-time">' + s.timeFrom + ' → ' + s.timeTo + '</span></div><button class="btn-del" onclick="deleteSchedule(' + realIdx + ')" title="حذف">🗑️</button></div>';
            }).join('');
            return '<div class="sched-card-group">' + ic + '</div>';
        }).join('') || '<p class="sched-empty">' + (true ? 'لا توجد محاضرات' : 'No lectures') + '</p>';
    } else {
        // minimal
        if (!list.length) {
            container.innerHTML = '<p class="sched-empty">' + (true ? 'لا توجد محاضرات' : 'No lectures') + '</p>';
            return;
        }
        container.innerHTML = '<table class="sched-minimal-table"><thead><tr><th>' + (true ? 'اليوم' : 'Day') + '</th><th>' + (true ? 'المادة' : 'Subject') + '</th><th>' + (true ? 'الوقت' : 'Time') + '</th><th></th></tr></thead><tbody>' + list.map((s, idx) => {
            const isToday = s.day === today;
            return '<tr class="' + (isToday ? 'sched-minimal-today' : '') + '"><td>' + dayLabels[s.day] + '</td><td>' + s.subject + '</td><td>' + s.timeFrom + ' - ' + s.timeTo + '</td><td><button class="btn-del" onclick="deleteSchedule(' + idx + ')" title="حذف">🗑️</button></td></tr>';
        }).join('') + '</tbody></table>';
    }
}

async function addSchedule() {
    const user = localStorage.getItem('currentUser');
    const subject = document.getElementById('schedSub').value.trim();
    const day = getSelectedDay();
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

function toggleSchedDay(header) {
    const body = header.nextElementSibling;
    const chevron = header.querySelector('.sched-chevron');
    body.classList.toggle('open');
    chevron.classList.toggle('open');
}

async function deleteSchedule(idx) {
    const user = localStorage.getItem('currentUser');
    await fetch('/api/schedule/' + user + '/' + idx, { method: 'DELETE' });
    loadSchedule();
}

/* ===== COURSES ===== */
async function getScheduleSubjects() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/schedule/' + user);
    const list = await res.json();
    return [...new Set(list.map(i => i.subject))];
}

async function handleCourseAutocomplete(val) {
    const box = document.getElementById('autoSuggestBox');
    box.innerHTML = '';
    if (!val.trim()) { box.classList.add('hidden'); return; }
    const subjects = await getScheduleSubjects();
    const filtered = subjects.filter(s => s.toLowerCase().includes(val.toLowerCase()));
    if (filtered.length > 0) {
        box.classList.remove('hidden');
        filtered.forEach(s => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.innerText = s;
            div.onclick = () => { document.getElementById('courseInputName').value = s; box.classList.add('hidden'); };
            box.appendChild(div);
        });
    } else { box.classList.add('hidden'); }
}

async function loadCourses() {
    const user = localStorage.getItem('currentUser');
    const res = await fetch('/api/courses/' + user);
    const list = await res.json();
    // Populate GPA autocomplete datalist
    const datalist = document.getElementById('gpaCourseList');
    if (datalist) datalist.innerHTML = list.map(c => '<option value="' + c + '">').join('');
    const ul = document.getElementById('myCoursesList');
    ul.innerHTML = '';
    list.forEach((c, idx) => {
        const li = document.createElement('li');
        li.innerHTML = '<span>' + c + '</span><button class="btn-del" onclick="event.stopPropagation();deleteCourse(' + idx + ')" title="حذف">🗑️</button>';
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
        alert(true ? data.err_ar : data.err_en);
    }
}

async function deleteCourse(idx) {
    const user = localStorage.getItem('currentUser');
    await fetch('/api/courses/' + user + '/' + idx, { method: 'DELETE' });
    activeCourseName = '';
    document.getElementById('courseDetailsContent').classList.add('hidden');
    document.getElementById('emptyStateCourse').classList.remove('hidden');
    loadCourses();
}

async function selectCourse(name, element) {
    document.querySelectorAll('#myCoursesList li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
    activeCourseName = name;
    document.getElementById('emptyStateCourse').classList.add('hidden');
    document.getElementById('courseDetailsContent').classList.remove('hidden');
    document.getElementById('courseDetailTitle').innerText = name;

    const user = localStorage.getItem('currentUser');
    const schedRes = await fetch('/api/schedule/' + user);
    const schedList = await schedRes.json();
    const times = schedList.filter(s => s.subject.toLowerCase() === name.toLowerCase());
    const timesUl = document.getElementById('courseTimesList');
    timesUl.innerHTML = '';
    if (times.length === 0) {
        timesUl.innerHTML = '<li>' + (true ? 'لا يوجد محاضرات' : 'No lectures') + '</li>';
    } else {
        times.forEach(t => {
            const li = document.createElement('li');
            li.innerText = t.day + ': ' + t.timeFrom + ' - ' + t.timeTo;
            timesUl.appendChild(li);
        });
    }

    const tasksRes = await fetch('/api/tasks/' + user);
    const tasksList = await tasksRes.json();
    const courseTasks = tasksList.filter(t => t.text.toLowerCase().includes(name.toLowerCase()));
    const tasksUl = document.getElementById('courseTasksList');
    tasksUl.innerHTML = '';
    if (courseTasks.length === 0) {
        tasksUl.innerHTML = '<li>' + (true ? 'لا توجد مهام' : 'No tasks') + '</li>';
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
    const idx = list.indexOf(activeCourseName);
    if (idx !== -1) deleteCourse(idx);
}

/* ===== SETTINGS ===== */
async function updateSettings() {
    const current = localStorage.getItem('currentUser');
    const newUser = document.getElementById('setNewUser').value.trim();
    const newPass = document.getElementById('setNewPass').value;
    const res = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUsername: current, newUsername: newUser, newPassword: newPass })
    });
    const data = await res.json();
    if (res.ok) {
        if (newUser) localStorage.setItem('currentUser', data.updatedUsername);
        alert(true ? 'تم التحديث!' : 'Updated!');
        initDash();
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
function applyTheme() {
    const gender = localStorage.getItem('userGender') || 'ذكر';
    const cls = gender === 'أنثى' ? 'theme-dark-female' : 'theme-dark-male';
    document.body.className = document.body.className.replace(/theme-\w+-\w+/g, '').trim();
    document.body.classList.add(cls);
}
function initTheme() {
    applyTheme();
}
document.addEventListener('DOMContentLoaded', initTheme);

applyLanguage();
