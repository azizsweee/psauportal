from flask import Flask, jsonify, request, send_from_directory
import sqlite3
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import hashlib
import re
import json
import os
import time
import threading

app = Flask(__name__, static_folder='public', static_url_path='')

# ===== CONFIG =====
DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')
KB_PATH = os.path.join(os.path.dirname(__file__), 'knowledge-base.json')
MAIL_CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'mail-config.json')
ADMIN_USER = '447051601'
ADMIN_PASS = 'AzozS2005519'

# Rate limiter
rate_limit_map = {}
def rate_limit(key, max_reqs=60, window_ms=60000):
    now = time.time() * 1000
    if key not in rate_limit_map:
        rate_limit_map[key] = []
    rate_limit_map[key] = [t for t in rate_limit_map[key] if now - t < window_ms]
    if len(rate_limit_map[key]) >= max_reqs:
        return False
    rate_limit_map[key].append(now)
    return True

# ===== SMTP SETUP =====
smtp_config = None
def load_smtp_config():
    global smtp_config
    try:
        if os.path.exists(MAIL_CONFIG_PATH):
            with open(MAIL_CONFIG_PATH) as f:
                smtp_config = json.load(f)
            if smtp_config.get('host') and smtp_config.get('pass'):
                print('SMTP configured:', smtp_config.get('user', ''))
                return
    except: pass
    # Fallback to hardcoded Gmail
    smtp_config = {
        'host': 'smtp.gmail.com',
        'port': 587,
        'user': 'psaused447@gmail.com',
        'pass': 'bmkowppbadueqozx',
        'from_email': 'PSAU Portal <psaused447@gmail.com>'
    }
    print('Using default Gmail SMTP')

load_smtp_config()

def send_email(to, subject, text):
    cfg = smtp_config
    if not cfg or not cfg.get('pass') or cfg['pass'].startswith('هنا'):
        print(f'[EMAIL][DEV] To: {to} | Subject: {subject}\n{text}')
        return True
    try:
        msg = MIMEText(text, 'plain', 'utf-8')
        msg['Subject'] = subject
        msg['From'] = cfg.get('from_email', cfg['user'])
        msg['To'] = to
        with smtplib.SMTP(cfg['host'], int(cfg.get('port', 587))) as s:
            s.starttls()
            s.login(cfg['user'], cfg['pass'])
            s.send_message(msg)
        print('Email sent to', to)
        return True
    except Exception as e:
        print(f'Email error: {e}')
        print(f'[EMAIL][FALLBACK] To: {to} | Code in text below\n{text}')
        return False

# ===== DATABASE =====
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT DEFAULT '',
            age INTEGER DEFAULT 0,
            gender TEXT DEFAULT '',
            college TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            verified INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS otp_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            code TEXT NOT NULL,
            purpose TEXT DEFAULT 'verify',
            expires_at TIMESTAMP NOT NULL,
            used INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            text TEXT NOT NULL,
            type TEXT DEFAULT 'عامة',
            priority TEXT DEFAULT 'normal',
            completed INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            day TEXT DEFAULT '',
            time TEXT DEFAULT '',
            subject TEXT DEFAULT '',
            location TEXT DEFAULT '',
            instructor TEXT DEFAULT '',
            color TEXT DEFAULT '#3b82f6'
        );
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            rating INTEGER DEFAULT 5,
            comment TEXT DEFAULT '',
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            role TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')
    conn.commit()
    conn.close()

init_db()

# ===== HELPERS =====
def sanitize(s):
    if not isinstance(s, str): return ''
    return re.sub(r'<[^>]*>|[<>"\']', '', s).strip()

def generate_otp():
    return str(random.randint(100000, 999999))

def hash_pass(p):
    return hashlib.sha256(p.encode()).hexdigest()

def mask_email(email):
    if '@' not in email: return email
    name, domain = email.split('@', 1)
    return name[:3] + '*' * (len(name) - 3) + '@' + domain

# ===== MIDDLEWARE =====
@app.after_request
def add_headers(resp):
    resp.headers['X-Content-Type-Options'] = 'nosniff'
    resp.headers['X-Frame-Options'] = 'DENY'
    resp.headers['X-XSS-Protection'] = '1; mode=block'
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PATCH,DELETE,OPTIONS'
    return resp

# ===== AUTH ENDPOINTS =====

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = sanitize(data.get('username', ''))
    password = sanitize(data.get('password', ''))
    email = sanitize(data.get('email', '')).lower()
    age = data.get('age')
    gender = sanitize(data.get('gender', ''))
    college = sanitize(data.get('college', ''))

    if not username or not password or not age or not gender or not college:
        return jsonify(err_ar='أكمل جميع البيانات', err_en='Fill all fields'), 400
    if not email or not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return jsonify(err_ar='البريد الإلكتروني مطلوب', err_en='Email is required'), 400

    try: age = int(age)
    except: return jsonify(err_ar='العمر غير صالح', err_en='Invalid age'), 400
    if age < 15 or age > 80:
        return jsonify(err_ar='العمر خارج النطاق', err_en='Age out of range'), 400

    db = get_db()
    if db.execute('SELECT id FROM users WHERE username=?', (username,)).fetchone():
        db.close()
        return jsonify(err_ar='اسم المستخدم مكرر', err_en='Username taken'), 400
    if db.execute('SELECT id FROM users WHERE email=?', (email,)).fetchone():
        db.close()
        return jsonify(err_ar='البريد مسجل مسبقاً', err_en='Email already registered'), 400

    # Send OTP first
    code = generate_otp()
    expires = (datetime.now() + timedelta(minutes=5)).isoformat()
    db.execute('INSERT INTO otp_codes (email, code, purpose, expires_at) VALUES (?,?,?,?)',
               (email, code, 'register', expires))
    db.commit()
    db.close()

    # Store temp data
    temp_data[email] = {'username': username, 'password': hash_pass(password),
                        'age': age, 'gender': gender, 'college': college}

    sent = send_email(email, '📧 رمز التحقق - جامعة الأمير سطام',
        f'مرحباً {username}\n\nرمز التحقق لحسابك في بوابة جامعة الأمير سطام:\n{code}\n\nصلاحية الرمز: 5 دقائق')

    res = {'msg_ar': 'تم إرسال الرمز إلى بريدك', 'msg_en': 'Code sent to your email',
           'email': mask_email(email)}
    if not sent or not smtp_config.get('pass') or smtp_config['pass'].startswith('هنا'):
        res['dev_code'] = code
        res['msg_ar'] = f'⚙️ وضع التطوير: الكود هو {code}'
    return jsonify(res)

temp_data = {}

@app.route('/api/verify-email', methods=['POST'])
def verify_email():
    data = request.get_json() or {}
    email = sanitize(data.get('email', '')).lower()
    code = sanitize(data.get('code', ''))

    if not email or not code:
        return jsonify(err_ar='أكمل البيانات', err_en='Fill all fields'), 400

    db = get_db()
    row = db.execute(
        'SELECT * FROM otp_codes WHERE email=? AND code=? AND purpose=? AND used=0 AND expires_at > ?',
        (email, code, 'register', datetime.now().isoformat())
    ).fetchone()

    if not row:
        db.close()
        return jsonify(err_ar='الكود خطأ أو منتهي الصلاحية', err_en='Wrong or expired code'), 400

    # Mark OTP as used
    db.execute('UPDATE otp_codes SET used=1 WHERE id=?', (row['id'],))

    # Create user
    td = temp_data.pop(email, {})
    if not td:
        db.close()
        return jsonify(err_ar='انتهت الجلسة، أعد التسجيل', err_en='Session expired, re-register'), 400

    db.execute(
        'INSERT INTO users (username, password, email, age, gender, college, verified) VALUES (?,?,?,?,?,?,1)',
        (td['username'], td['password'], email, td['age'], td['gender'], td['college'])
    )
    db.commit()
    db.close()

    return jsonify(msg_ar='✅ تم إنشاء الحساب وتوثيقه بنجاح!', msg_en='✅ Account created and verified!')

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = sanitize(data.get('username', ''))
    password = sanitize(data.get('password', ''))
    role = data.get('role', 'student')

    if role == 'admin':
        if username == ADMIN_USER and password == ADMIN_PASS:
            return jsonify(username=username, role='admin')
        return jsonify(err_ar='بيانات المشرف غير صحيحة', err_en='Invalid admin credentials'), 400

    if not username or not password:
        return jsonify(err_ar='أكمل البيانات', err_en='Fill fields'), 400

    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username=? AND password=?',
                      (username, hash_pass(password))).fetchone()
    db.close()

    if not user:
        return jsonify(err_ar='البيانات غير صحيحة', err_en='Invalid credentials'), 400

    u = dict(user)
    return jsonify(username=u['username'], email=u.get('email', ''),
                   role='student', gender=u.get('gender', ''),
                   verified=bool(u['verified']))

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = sanitize(data.get('email', '')).lower()

    if not email or not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return jsonify(err_ar='البريد الإلكتروني غير صالح', err_en='Invalid email'), 400

    db = get_db()
    user = db.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()
    if not user:
        db.close()
        return jsonify(err_ar='لا يوجد حساب بهذا البريد', err_en='No account with this email'), 404

    if not rate_limit(f'forgot:{email}', 1, 60000):
        db.close()
        return jsonify(err_ar='انتظر دقيقة قبل طلب رمز جديد', err_en='Wait 1 minute'), 429

    code = generate_otp()
    expires = (datetime.now() + timedelta(minutes=5)).isoformat()
    db.execute('INSERT INTO otp_codes (email, code, purpose, expires_at) VALUES (?,?,?,?)',
               (email, code, 'reset', expires))
    db.commit()
    db.close()

    sent = send_email(email, '🔑 إعادة تعيين كلمة المرور - جامعة الأمير سطام',
        f'مرحباً {user["username"]}\n\nرمز إعادة تعيين كلمة المرور:\n{code}\n\nصلاحية الرمز: 5 دقائق\nإذا لم تطلب هذا، تجاهل الرسالة.')

    res = {'msg_ar': 'تم إرسال الرمز إلى بريدك', 'msg_en': 'Code sent to your email',
           'email': mask_email(email)}
    if not sent or not smtp_config.get('pass') or smtp_config['pass'].startswith('هنا'):
        res['dev_code'] = code
        res['msg_ar'] = f'⚙️ وضع التطوير: الكود هو {code}'
    return jsonify(res)

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    email = sanitize(data.get('email', '')).lower()
    code = sanitize(data.get('code', ''))
    new_password = sanitize(data.get('newPassword', ''))

    if not email or not code or not new_password:
        return jsonify(err_ar='أكمل جميع البيانات', err_en='Fill all fields'), 400
    if len(new_password) < 4:
        return jsonify(err_ar='كلمة المرور قصيرة', err_en='Password too short'), 400

    db = get_db()
    row = db.execute(
        'SELECT * FROM otp_codes WHERE email=? AND code=? AND purpose=? AND used=0 AND expires_at > ?',
        (email, code, 'reset', datetime.now().isoformat())
    ).fetchone()

    if not row:
        db.close()
        return jsonify(err_ar='الكود خطأ أو منتهي الصلاحية', err_en='Wrong or expired code'), 400

    db.execute('UPDATE otp_codes SET used=1 WHERE id=?', (row['id'],))
    db.execute('UPDATE users SET password=? WHERE email=?', (hash_pass(new_password), email))
    db.commit()
    db.close()

    return jsonify(msg_ar='✅ تم تغيير كلمة المرور بنجاح!', msg_en='✅ Password reset successfully!')

# ===== USER ENDPOINTS =====

@app.route('/api/user/<username>/verified', methods=['GET'])
def user_verified(username):
    db = get_db()
    user = db.execute('SELECT email, verified FROM users WHERE username=?', (sanitize(username),)).fetchone()
    db.close()
    if not user:
        return jsonify(error='User not found'), 404
    return jsonify(verified=bool(user['verified']), email=user['email'] or '')

@app.route('/api/forgot-verify-identity', methods=['POST'])
def forgot_verify_identity():
    data = request.get_json() or {}
    username = sanitize(data.get('username', ''))
    college = sanitize(data.get('college', ''))
    age = data.get('age')
    gender = sanitize(data.get('gender', ''))
    db = get_db()
    user = db.execute(
        'SELECT password FROM users WHERE username=? AND college=? AND age=? AND gender=?',
        (username, college, int(age) if age else 0, gender)
    ).fetchone()
    db.close()
    if user:
        return jsonify(found=True, password=user['password'])
    return jsonify(found=False)

# ===== TASKS =====

@app.route('/api/tasks/<username>', methods=['GET'])
def get_tasks(username):
    db = get_db()
    tasks = db.execute('SELECT id, text, type, priority, completed FROM tasks WHERE username=?',
                       (sanitize(username),)).fetchall()
    db.close()
    return jsonify([dict(t) for t in tasks])

@app.route('/api/tasks/<username>', methods=['POST'])
def add_task(username):
    data = request.get_json() or {}
    db = get_db()
    db.execute('INSERT INTO tasks (username, text, type, priority) VALUES (?,?,?,?)',
               (sanitize(username), sanitize(data.get('text', '')),
                sanitize(data.get('type', 'عامة')), sanitize(data.get('priority', 'normal'))))
    db.commit()
    db.close()
    return jsonify(success=True)

@app.route('/api/tasks/<username>/<int:index>/toggle', methods=['PATCH'])
def toggle_task(username, index):
    db = get_db()
    task = db.execute('SELECT id, completed FROM tasks WHERE username=? AND id=?',
                      (sanitize(username), index)).fetchone()
    if task:
        db.execute('UPDATE tasks SET completed=? WHERE id=?', (1 - task['completed'], index))
        db.commit()
        db.close()
        return jsonify(success=True, completed=bool(1 - task['completed']))
    db.close()
    return jsonify(error='Not found'), 404

@app.route('/api/tasks/<username>/<int:index>', methods=['DELETE'])
def delete_task(username, index):
    db = get_db()
    db.execute('DELETE FROM tasks WHERE username=? AND id=?', (sanitize(username), index))
    db.commit()
    db.close()
    return jsonify(success=True)

# ===== SCHEDULE =====

@app.route('/api/schedule/<username>', methods=['GET'])
def get_schedule(username):
    db = get_db()
    rows = db.execute('SELECT id, day, time, subject, location, instructor, color FROM schedules WHERE username=?',
                      (sanitize(username),)).fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/schedule/<username>', methods=['POST'])
def add_schedule(username):
    data = request.get_json() or {}
    db = get_db()
    db.execute('INSERT INTO schedules (username, day, time, subject, location, instructor, color) VALUES (?,?,?,?,?,?,?)',
               (sanitize(username), sanitize(data.get('day', '')),
                sanitize(data.get('time', '')), sanitize(data.get('subject', '')),
                sanitize(data.get('location', '')), sanitize(data.get('instructor', '')),
                sanitize(data.get('color', '#3b82f6'))))
    db.commit()
    db.close()
    return jsonify(success=True)

@app.route('/api/schedule/<username>/<int:index>', methods=['DELETE'])
def delete_schedule(username, index):
    db = get_db()
    db.execute('DELETE FROM schedules WHERE username=? AND id=?', (sanitize(username), index))
    db.commit()
    db.close()
    return jsonify(success=True)

# ===== COURSES =====

@app.route('/api/courses/<username>', methods=['GET'])
def get_courses(username):
    db = get_db()
    rows = db.execute('SELECT id, name FROM courses WHERE username=?', (sanitize(username),)).fetchall()
    db.close()
    return jsonify([r['name'] for r in rows])

@app.route('/api/courses/<username>', methods=['POST'])
def add_course(username):
    data = request.get_json() or {}
    name = sanitize(data.get('name', ''))
    if not name:
        return jsonify(error='Name required'), 400
    db = get_db()
    try:
        db.execute('INSERT INTO courses (username, name) VALUES (?,?)', (sanitize(username), name))
        db.commit()
        db.close()
        return jsonify(success=True)
    except sqlite3.IntegrityError:
        db.close()
        return jsonify(err_ar='المقرر مضاف', err_en='Course exists'), 400

@app.route('/api/courses/<username>/<int:index>', methods=['DELETE'])
def delete_course(username, index):
    db = get_db()
    row = db.execute('SELECT name FROM courses WHERE username=? AND id=?',
                     (sanitize(username), index)).fetchone()
    if row:
        db.execute('DELETE FROM courses WHERE id=?', (index,))
        db.commit()
    db.close()
    return jsonify(success=True)

# ===== FEEDBACK =====

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json() or {}
    db = get_db()
    db.execute('INSERT INTO feedback (username, rating, comment) VALUES (?,?,?)',
               (sanitize(data.get('username', '')), int(data.get('rating', 5)),
                sanitize(data.get('comment', ''))))
    db.commit()
    db.close()
    print(f'[Feedback] User: {data.get("username")} | Rating: {data.get("rating")}/10')
    return jsonify(msg_ar='شكراً لك! تم استلام ملاحظاتك', msg_en='Thank you! Feedback received.')

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    if request.args.get('user') != ADMIN_USER:
        return jsonify(error='Forbidden'), 403
    db = get_db()
    rows = db.execute('SELECT * FROM feedback ORDER BY date DESC').fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])

# ===== SETTINGS =====

@app.route('/api/settings/update', methods=['POST'])
def update_settings():
    data = request.get_json() or {}
    current = sanitize(data.get('currentUsername', ''))
    new_username = sanitize(data.get('newUsername', ''))
    new_password = sanitize(data.get('newPassword', ''))
    new_email = sanitize(data.get('newEmail', '')).lower()

    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username=?', (current,)).fetchone()
    if not user:
        db.close()
        return jsonify(err_ar='خطأ', err_en='Error'), 404

    if new_username and new_username != current:
        if db.execute('SELECT id FROM users WHERE username=?', (new_username,)).fetchone():
            db.close()
            return jsonify(err_ar='مأخوذ', err_en='Taken'), 400
        db.execute('UPDATE users SET username=? WHERE username=?', (new_username, current))
        # Update related tables
        for table in ['tasks', 'schedules', 'courses']:
            db.execute(f'UPDATE {table} SET username=? WHERE username=?', (new_username, current))
        current = new_username

    if new_password:
        db.execute('UPDATE users SET password=? WHERE username=?', (hash_pass(new_password), current))
    if new_email:
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', new_email):
            db.close()
            return jsonify(err_ar='البريد غير صالح', err_en='Invalid email'), 400
        db.execute('UPDATE users SET email=?, verified=0 WHERE username=?', (new_email, current))

    db.commit()
    db.close()
    return jsonify(updatedUsername=current)

@app.route('/api/settings/delete', methods=['POST'])
def delete_account():
    data = request.get_json() or {}
    username = sanitize(data.get('username', ''))
    db = get_db()
    db.execute('DELETE FROM users WHERE username=?', (username,))
    for table in ['tasks', 'schedules', 'courses']:
        db.execute(f'DELETE FROM {table} WHERE username=?', (username,))
    db.commit()
    db.close()
    return jsonify(success=True)

# ===== GEMINI AI CHAT =====

GEMINI_API_KEY = 'AIzaSyDmQrbecOdkcdRL4sfwmhqqk1US869ZnbU'

def load_kb():
    try:
        with open(KB_PATH, encoding='utf-8') as f:
            return json.load(f)
    except:
        return {"university": {"name_ar": "جامعة الأمير سطام"}}

def ask_gemini(message, kb):
    import urllib.request
    import urllib.parse

    college_list = '\n'.join(f'- {c["name_ar"]} ({c["name_en"]})' for c in kb.get('colleges', []))
    faq_list = '\n'.join(f'س: {f.get("question_ar","")}\nج: {f.get("answer_ar","")}' for f in kb.get('faq', []))

    system = f'''أنت مساعد ذكي رسمي لجامعة الأمير سطام بن عبدالعزيز (PSAU).
مهمتك الإجابة عن الأسئلة المتعلقة بهذه الجامعة فقط.

معلومات الجامعة:
الاسم: {kb.get("university",{}).get("name_ar","")}
الموقع: {kb.get("university",{}).get("location_ar","")}
الكليات: {college_list}
القبول: {kb.get("admission",{}).get("requirements_ar","")}

الأسئلة الشائعة:
{faq_list}

جاوب باللغة التي سأل بها المستخدم. استخدم المعلومات أعلاه فقط.'''

    models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite']
    for model in models:
        try:
            url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}'
            body = json.dumps({
                "contents": [{"role": "user", "parts": [{"text": system + '\n\nسؤال: ' + message}]}],
                "generationConfig": {"temperature": 0.2, "maxOutputTokens": 600}
            }).encode()
            req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json'},
                                         method='POST')
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read())
                text = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                if text and len(text) > 3:
                    return text
        except Exception as e:
            print(f'Gemini {model}: {str(e)[:120]}')
    return None

def local_answer(message, kb):
    q = re.sub(r'[؟?!,.\-;:]', '', message).strip().lower()
    is_ar = bool(re.search(r'[\u0600-\u06FF]', q))

    entries = []
    def add(keys, answer):
        entries.append({'keys': [k.lower() for k in keys], 'answer': answer})

    u = kb.get('university', {})
    add(['تعريف', 'نبذة', 'psau', 'معلومات'],
        f'🏛️ {u.get("name_ar","")} - {u.get("name_en","")}\n📍 {u.get("location_ar","")}')
    add(['رئيس', 'مدير'], f'👤 رئيس الجامعة: {u.get("president","")}')
    add(['موقع', 'مكان', 'عنوان', 'أين', 'وين'], f'📍 {u.get("location_ar","")}')

    greetings = ['مرحبا', 'اهلا', 'السلام', 'hi', 'hello']
    if any(g in q for g in greetings):
        return '👋 مرحباً! أنا مساعد جامعة الأمير سطام بن عبدالعزيز الذكي. اسألني عن الكليات، القبول، الجداول، أو أي شيء عن الجامعة.'
    if 'شكر' in q or 'thank' in q:
        return '🤝 العفو! نحن في الخدمة دائماً'

    best = {'score': 0, 'answer': ''}
    for entry in entries:
        matched = sum(1 for k in entry['keys'] if k in q)
        penalty = 0.5 if len(entry['keys']) < 3 else 0
        score = (matched / max(len(entry['keys']), 3)) - penalty
        if score > best['score']:
            best = {'score': score, 'answer': entry['answer']}
    if best['score'] > 0:
        return best['answer']

    return '🔍 لم أجد إجابة محددة. اتصل بالجامعة: 0115888000 أو psau.edu.sa'

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = sanitize(data.get('message', ''))
    username = sanitize(data.get('username', ''))
    if not message:
        return jsonify(error='Message required'), 400

    kb = load_kb()
    reply = ask_gemini(message, kb)
    if not reply:
        reply = local_answer(message, kb)

    db = get_db()
    if username:
        # Keep last 50 messages
        count = db.execute('SELECT COUNT(*) as c FROM chat_history WHERE username=?',
                          (username,)).fetchone()['c']
        if count > 48:
            db.execute('DELETE FROM chat_history WHERE username=? AND id NOT IN '
                      '(SELECT id FROM chat_history WHERE username=? ORDER BY id DESC LIMIT 48)',
                      (username, username))
        for role, msg in [('user', message), ('assistant', reply)]:
            db.execute('INSERT INTO chat_history (username, role, message) VALUES (?,?,?)',
                      (username, role, msg))
        db.commit()
    db.close()

    return jsonify(reply_ar=reply, reply_en=reply, reply=reply)

@app.route('/api/chat/history', methods=['POST'])
def chat_history():
    data = request.get_json() or {}
    username = sanitize(data.get('username', ''))
    if not username:
        return jsonify([])
    db = get_db()
    rows = db.execute(
        'SELECT role, message FROM chat_history WHERE username=? ORDER BY id ASC', (username,)
    ).fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])

# ===== ADMIN =====

@app.route('/api/admin/stats', methods=['GET'])
def admin_stats():
    if request.args.get('user') != ADMIN_USER:
        return jsonify(error='Forbidden'), 403
    db = get_db()
    users = db.execute('SELECT COUNT(*) as c FROM users').fetchone()['c']
    tasks = db.execute('SELECT COUNT(*) as c FROM tasks').fetchone()['c']
    schedules = db.execute('SELECT COUNT(*) as c FROM schedules').fetchone()['c']
    courses = db.execute('SELECT COUNT(*) as c FROM courses').fetchone()['c']
    feedback = db.execute('SELECT COUNT(*) as c FROM feedback').fetchone()['c']
    males = db.execute("SELECT COUNT(*) as c FROM users WHERE gender='ذكر'").fetchone()['c']
    females = db.execute("SELECT COUNT(*) as c FROM users WHERE gender='أنثى'").fetchone()['c']
    db.close()
    return jsonify(users=users, tasks=tasks, schedules=schedules,
                   courses=courses, feedback=feedback, males=males, females=females)

@app.route('/api/admin/users', methods=['GET'])
def admin_users():
    if request.args.get('user') != ADMIN_USER:
        return jsonify(error='Forbidden'), 403
    db = get_db()
    rows = db.execute('SELECT username, age, gender, college, password FROM users').fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/users/<username>/gender', methods=['GET'])
def user_gender(username):
    db = get_db()
    user = db.execute('SELECT gender FROM users WHERE username=?', (sanitize(username),)).fetchone()
    db.close()
    return jsonify(gender=user['gender'] if user else None)

@app.route('/api/is-admin', methods=['GET'])
def is_admin():
    return jsonify(admin=request.args.get('role') == 'admin')

# ===== COUNTRIES (static) =====
@app.route('/api/countries', methods=['GET'])
def get_countries():
    path = os.path.join(os.path.dirname(__file__), 'public', 'flags-data.json')
    try:
        with open(path, encoding='utf-8') as f:
            return jsonify(json.load(f))
    except:
        return jsonify([])

# ===== SERVE FRONTEND =====
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    path = request.path.lstrip('/')
    full = os.path.join(app.static_folder, path)
    if os.path.exists(full) and not os.path.isdir(full):
        return send_from_directory(app.static_folder, path)
    return jsonify(error='Not found'), 404

# ===== MAIN =====
if __name__ == '__main__':
    print('PSAU AI Portal running: http://localhost:3000')
    print('AI powered by Google Gemini')
    app.run(host='0.0.0.0', port=3000, debug=False)
