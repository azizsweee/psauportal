const fs = require('fs');
let c = fs.readFileSync('public/app.js', 'utf8');

// Replace registerStudent function
c = c.replace(
  /function registerStudent\(\) \{[\s\S]*?\} catch\(e\) \{ alert\('Register error: '[^]*?\n\}/,
  `function registerStudent() {
    try {
    const username = document.getElementById('regUser').value.trim();
    const password = document.getElementById('regPass').value;
    const passConfirm = document.getElementById('regPassConfirm').value;
    const age = document.getElementById('regAge').value;
    const gender = document.getElementById('regGender').value;
    const college = document.getElementById('regCollege').value;
    if (!username || !password || !age || !gender || !college) {
        alert(true ? 'أكمل جميع البيانات' : 'Fill all fields');
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
    if (password !== passConfirm) {
        alert(true ? 'كلمة المرور غير متطابقة' : 'Passwords do not match');
        return;
    }
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, age, gender, college })
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
    } catch(e) { alert('Register error: ' + e.message); }
}`
);

// Remove old OTP functions
c = c.replace(/async function regHelpResend\(\) \{[\s\S]*?\n\}/, '\n');
c = c.replace(/function resendRegOtp\(\) \{[\s\S]*?\n\}/, '\n');
c = c.replace(/function editRegEmail\(\) \{[\s\S]*?\n\}/, '\n');
c = c.replace(/async function verifyEmailOtp\(\) \{[\s\S]*?\n\}/, '\n');

// Replace forgotSendCode with forgotVerifyIdentity
c = c.replace(
  /async function forgotSendCode\(\) \{[\s\S]*?setTimeout[^;]*;[^}]*\n\}/,
  `async function forgotVerifyIdentity() {
    const username = document.getElementById('forgotUser').value.trim();
    const age = document.getElementById('forgotAge').value;
    const gender = document.getElementById('forgotGender').value;
    const college = document.getElementById('forgotCollege').value;
    const msg = document.getElementById('forgotMsg');
    if (!username || !age || !gender || !college) {
        msg.innerHTML = '❌ أكمل جميع البيانات';
        msg.style.color = '#ef4444';
        return;
    }
    msg.innerHTML = '<span class="spinner"></span> جاري التحقق...';
    msg.style.color = 'var(--text)';
    const res = await fetch('/api/forgot-verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, age, gender, college })
    });
    const data = await res.json();
    if (data.found) {
        msg.innerHTML = '✅ تم التحقق';
        msg.style.color = '#22c55e';
        document.getElementById('forgotStep1').classList.add('hidden');
        document.getElementById('forgotPasswordDisplay').textContent = data.password;
        document.getElementById('forgotStep2').classList.remove('hidden');
    } else {
        msg.innerHTML = '❌ البيانات غير صحيحة';
        msg.style.color = '#ef4444';
    }
    setTimeout(() => { if (msg) msg.innerHTML = ''; }, 6000);
}

function copyAndLogin() {
    const password = document.getElementById('forgotPasswordDisplay').textContent;
    const username = document.getElementById('forgotUser').value.trim();
    navigator.clipboard.writeText(password).then(() => {
        document.getElementById('forgotResetMsg').innerHTML = '✅ تم نسخ كلمة المرور';
        document.getElementById('forgotResetMsg').style.color = '#22c55e';
    }).catch(() => {});
    document.getElementById('loginUser').value = username;
    document.getElementById('loginPass').value = password;
    toggleCard('loginCard');
    setTimeout(() => login(), 300);
}`
);

// Replace forgotResetPass
c = c.replace(/async function forgotResetPass\(\) \{[\s\S]*?\n\}/, '\n');

fs.writeFileSync('public/app.js', c);
console.log('✓ fix_app.js completed');
