const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');
const { db: firestoreDb } = require('./firebase-config');
const USE_FIRESTORE = !!(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.GOOGLE_APPLICATION_CREDENTIALS);

// ====== JSON FILE HELPERS ======
function readJsonDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], tasks: {}, schedules: {}, feedback: [], gpaData: {}, savedSchedules: {}, hourglass: {}, absence: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function writeJsonDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ====== FIRESTORE HELPERS ======
async function firestoreGetDoc(collection, docId) {
    const snap = await firestoreDb.collection(collection).doc(docId).get();
    return snap.exists ? { ...snap.data(), id: snap.id } : null;
}
async function firestoreQuery(collection, field, operator, value) {
    const snap = await firestoreDb.collection(collection).where(field, operator, value).get();
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}
async function firestoreSetDoc(collection, docId, data) {
    await firestoreDb.collection(collection).doc(docId).set(data, { merge: true });
}
async function firestoreAddDoc(collection, data) {
    const ref = await firestoreDb.collection(collection).add(data);
    return ref.id;
}
async function firestoreDeleteDoc(collection, docId) {
    await firestoreDb.collection(collection).doc(docId).delete();
}
async function firestoreGetAll(collection) {
    const snap = await firestoreDb.collection(collection).get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function firestoreCount(collection) {
    const snap = await firestoreDb.collection(collection).get();
    return snap.size;
}
async function firestoreUpdateDoc(collection, docId, data) {
    await firestoreDb.collection(collection).doc(docId).update(data);
}

// ====== USERS ======
async function findUserByUsername(username) {
    if (USE_FIRESTORE) {
        return await firestoreGetDoc('users', username);
    }
    const db = readJsonDB();
    return db.users.find(u => u.username === username) || null;
}
async function findUserByEmail(email) {
    if (USE_FIRESTORE) {
        const results = await firestoreQuery('users', 'email', '==', email.toLowerCase());
        return results[0] || null;
    }
    const db = readJsonDB();
    return db.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
}
async function getAllUsers() {
    if (USE_FIRESTORE) {
        return await firestoreGetAll('users');
    }
    return readJsonDB().users;
}
async function countUsers() {
    if (USE_FIRESTORE) {
        return await firestoreCount('users');
    }
    return readJsonDB().users.length;
}
async function createUser(userData) {
    if (USE_FIRESTORE) {
        await firestoreDb.collection('users').doc(userData.username).set(userData);
        return;
    }
    const db = readJsonDB();
    db.users.push(userData);
    if (!db.tasks) db.tasks = {};
    if (!db.schedules) db.schedules = {};
    if (!db.tasks[userData.username]) db.tasks[userData.username] = [];
    if (!db.schedules[userData.username]) db.schedules[userData.username] = [];
    writeJsonDB(db);
}
async function updateUser(username, updates) {
    if (USE_FIRESTORE) {
        await firestoreSetDoc('users', username, updates);
        return;
    }
    const db = readJsonDB();
    const idx = db.users.findIndex(u => u.username === username);
    if (idx !== -1) {
        Object.assign(db.users[idx], updates);
        writeJsonDB(db);
    }
}
async function deleteUser(username) {
    if (USE_FIRESTORE) {
        await firestoreDeleteDoc('users', username);
        return;
    }
    const db = readJsonDB();
    db.users = db.users.filter(u => u.username !== username);
    writeJsonDB(db);
}

// ====== TASKS ======
async function findTasks(username) {
    if (USE_FIRESTORE) {
        return await firestoreQuery('tasks', 'username', '==', username);
    }
    const db = readJsonDB();
    return db.tasks[username] || [];
}
async function createTask(username, taskData) {
    if (USE_FIRESTORE) {
        const id = await firestoreAddDoc('tasks', { username, ...taskData, completed: false });
        return id;
    }
    const db = readJsonDB();
    if (!db.tasks[username]) db.tasks[username] = [];
    db.tasks[username].push({ ...taskData, completed: false });
    writeJsonDB(db);
}
async function toggleTask(username, taskId) {
    if (USE_FIRESTORE) {
        const tasks = await firestoreQuery('tasks', 'username', '==', username);
        const task = tasks[parseInt(taskId)];
        if (task) {
            await firestoreUpdateDoc('tasks', task.id, { completed: !task.completed });
            return !task.completed;
        }
        return null;
    }
    const db = readJsonDB();
    const tasks = db.tasks[username];
    if (tasks && tasks[taskId] !== undefined) {
        tasks[taskId].completed = !tasks[taskId].completed;
        writeJsonDB(db);
        return tasks[taskId].completed;
    }
    return null;
}
async function deleteTask(username, taskId) {
    if (USE_FIRESTORE) {
        const tasks = await firestoreQuery('tasks', 'username', '==', username);
        const task = tasks[parseInt(taskId)];
        if (task) {
            await firestoreDeleteDoc('tasks', task.id);
        }
        return;
    }
    const db = readJsonDB();
    if (db.tasks[username]) {
        db.tasks[username].splice(parseInt(taskId), 1);
        writeJsonDB(db);
    }
}
async function countAllTasks() {
    if (USE_FIRESTORE) {
        return await firestoreCount('tasks');
    }
    const db = readJsonDB();
    return Object.values(db.tasks || {}).reduce((s, arr) => s + (arr ? arr.length : 0), 0);
}
async function countUserTasks(username) {
    if (USE_FIRESTORE) {
        const results = await firestoreQuery('tasks', 'username', '==', username);
        return results.length;
    }
    const db = readJsonDB();
    return (db.tasks[username] || []).length;
}
async function countUserCompletedTasks(username) {
    if (USE_FIRESTORE) {
        const results = await firestoreQuery('tasks', 'username', '==', username);
        return results.filter(t => t.completed).length;
    }
    const db = readJsonDB();
    return (db.tasks[username] || []).filter(t => t.completed).length;
}
async function countActiveUsers() {
    if (USE_FIRESTORE) {
        const all = await firestoreGetAll('tasks');
        const users = new Set(all.map(t => t.username));
        return users.size;
    }
    const db = readJsonDB();
    return Object.keys(db.tasks || {}).filter(k => db.tasks[k] && db.tasks[k].length > 0).length;
}
async function renameUserTasks(oldUsername, newUsername) {
    if (USE_FIRESTORE) {
        const tasks = await findTasks(oldUsername);
        for (const t of tasks) {
            await firestoreUpdateDoc('tasks', t.id, { username: newUsername });
        }
        return;
    }
    const db = readJsonDB();
    db.tasks[newUsername] = db.tasks[oldUsername];
    delete db.tasks[oldUsername];
    writeJsonDB(db);
}
async function deleteUserTasks(username) {
    if (USE_FIRESTORE) {
        const tasks = await findTasks(username);
        for (const t of tasks) {
            await firestoreDeleteDoc('tasks', t.id);
        }
        return;
    }
    const db = readJsonDB();
    delete db.tasks[username];
    writeJsonDB(db);
}

// ====== SCHEDULES ======
async function findSchedules(username) {
    if (USE_FIRESTORE) {
        return await firestoreQuery('schedules', 'username', '==', username);
    }
    const db = readJsonDB();
    return db.schedules[username] || [];
}
async function createSchedule(username, scheduleData) {
    if (USE_FIRESTORE) {
        const id = await firestoreAddDoc('schedules', { username, ...scheduleData, _id: scheduleData._id || Date.now().toString(36) + Math.random().toString(36).slice(2, 6) });
        return id;
    }
    const db = readJsonDB();
    if (!db.schedules[username]) db.schedules[username] = [];
    const entry = { ...scheduleData, _id: scheduleData._id || Date.now().toString(36) + Math.random().toString(36).slice(2, 6) };
    db.schedules[username].push(entry);
    writeJsonDB(db);
    return entry._id;
}
async function deleteSchedule(username, scheduleId) {
    if (USE_FIRESTORE) {
        const snap = await firestoreDb.collection('schedules')
            .where('username', '==', username)
            .where('_id', '==', scheduleId)
            .limit(1)
            .get();
        if (!snap.empty) {
            await firestoreDeleteDoc('schedules', snap.docs[0].id);
        }
        return;
    }
    const db = readJsonDB();
    if (db.schedules[username]) {
        db.schedules[username] = db.schedules[username].filter(s => s._id !== scheduleId);
        writeJsonDB(db);
    }
}
async function countAllSchedules() {
    if (USE_FIRESTORE) {
        return await firestoreCount('schedules');
    }
    const db = readJsonDB();
    return Object.values(db.schedules || {}).reduce((s, arr) => s + (arr ? arr.length : 0), 0);
}
async function countUserSchedules(username) {
    if (USE_FIRESTORE) {
        const results = await firestoreQuery('schedules', 'username', '==', username);
        return results.length;
    }
    const db = readJsonDB();
    return (db.schedules[username] || []).length;
}
async function countUsersWithSchedules() {
    if (USE_FIRESTORE) {
        const all = await firestoreGetAll('schedules');
        return new Set(all.map(s => s.username)).size;
    }
    const db = readJsonDB();
    return Object.keys(db.schedules || {}).filter(k => db.schedules[k] && db.schedules[k].length > 0).length;
}
async function renameUserSchedules(oldUsername, newUsername) {
    if (USE_FIRESTORE) {
        const schedules = await findSchedules(oldUsername);
        for (const s of schedules) {
            await firestoreUpdateDoc('schedules', s.id, { username: newUsername });
        }
        return;
    }
    const db = readJsonDB();
    db.schedules[newUsername] = db.schedules[oldUsername];
    delete db.schedules[oldUsername];
    writeJsonDB(db);
}
async function deleteUserSchedules(username) {
    if (USE_FIRESTORE) {
        const schedules = await findSchedules(username);
        for (const s of schedules) {
            await firestoreDeleteDoc('schedules', s.id);
        }
        return;
    }
    const db = readJsonDB();
    delete db.schedules[username];
    writeJsonDB(db);
}

// ====== GPA DATA ======
async function findGpaData(username) {
    if (USE_FIRESTORE) {
        return await firestoreQuery('gpaData', 'username', '==', username);
    }
    const db = readJsonDB();
    if (!db.gpaData) db.gpaData = {};
    return db.gpaData[username] || [];
}
async function saveGpaData(username, rows) {
    if (USE_FIRESTORE) {
        const existing = await findGpaData(username);
        for (const e of existing) {
            await firestoreDeleteDoc('gpaData', e.id);
        }
        for (const r of rows) {
            await firestoreAddDoc('gpaData', { username, course: r.course, hours: parseInt(r.hours) || 0, grade: parseFloat(r.grade) || 0 });
        }
        return;
    }
    const db = readJsonDB();
    if (!db.gpaData) db.gpaData = {};
    db.gpaData[username] = (rows || []).map(r => ({
        course: r.course || '',
        hours: parseInt(r.hours) || 0,
        grade: parseFloat(r.grade) || 0
    }));
    writeJsonDB(db);
}

// ====== SAVED SCHEDULES ======
async function findSavedSchedules(username) {
    if (USE_FIRESTORE) {
        return await firestoreQuery('savedSchedules', 'username', '==', username);
    }
    const db = readJsonDB();
    if (!db.savedSchedules) db.savedSchedules = {};
    return db.savedSchedules[username] || [];
}
async function createSavedSchedule(username, name, data) {
    if (USE_FIRESTORE) {
        const id = await firestoreAddDoc('savedSchedules', { username, name, data, savedAt: new Date().toISOString() });
        return id;
    }
    const db = readJsonDB();
    if (!db.savedSchedules) db.savedSchedules = {};
    if (!db.savedSchedules[username]) db.savedSchedules[username] = [];
    const entry = { id: Date.now().toString(), name, data, savedAt: new Date().toISOString() };
    db.savedSchedules[username].push(entry);
    writeJsonDB(db);
    return entry.id;
}
async function deleteSavedSchedule(username, entryId) {
    if (USE_FIRESTORE) {
        const doc = await firestoreGetDoc('savedSchedules', entryId);
        if (doc && doc.username === username) {
            await firestoreDeleteDoc('savedSchedules', entryId);
        }
        return;
    }
    const db = readJsonDB();
    if (!db.savedSchedules) db.savedSchedules = {};
    if (db.savedSchedules[username]) {
        db.savedSchedules[username] = db.savedSchedules[username].filter(s => s.id !== entryId);
        writeJsonDB(db);
    }
}

// ====== ABSENCE ======
async function findAbsence(username) {
    if (USE_FIRESTORE) {
        return await firestoreQuery('absence', 'username', '==', username);
    }
    const db = readJsonDB();
    if (!db.absence) db.absence = {};
    return db.absence[username] || [];
}
async function createAbsence(username, data) {
    if (USE_FIRESTORE) {
        const id = await firestoreAddDoc('absence', { username, ...data, id: data.id || Date.now().toString() });
        return id;
    }
    const db = readJsonDB();
    if (!db.absence) db.absence = {};
    if (!db.absence[username]) db.absence[username] = [];
    const entry = { id: Date.now().toString(), ...data };
    db.absence[username].push(entry);
    writeJsonDB(db);
    return entry.id;
}
async function updateAbsence(username, entryId, updates) {
    if (USE_FIRESTORE) {
        const doc = await firestoreGetDoc('absence', entryId);
        if (doc && doc.username === username) {
            await firestoreUpdateDoc('absence', entryId, updates);
        }
        return;
    }
    const db = readJsonDB();
    if (!db.absence) db.absence = {};
    if (db.absence[username]) {
        const idx = db.absence[username].findIndex(a => a.id === entryId);
        if (idx !== -1) {
            Object.assign(db.absence[username][idx], updates);
            writeJsonDB(db);
        }
    }
}
async function deleteAbsence(username, entryId) {
    if (USE_FIRESTORE) {
        const doc = await firestoreGetDoc('absence', entryId);
        if (doc && doc.username === username) {
            await firestoreDeleteDoc('absence', entryId);
        }
        return;
    }
    const db = readJsonDB();
    if (!db.absence) db.absence = {};
    if (db.absence[username]) {
        db.absence[username] = db.absence[username].filter(a => a.id !== entryId);
        writeJsonDB(db);
    }
}

// ====== HOURGLASS ======
async function findHourglass(username) {
    if (USE_FIRESTORE) {
        return await firestoreQuery('hourglass', 'username', '==', username);
    }
    const db = readJsonDB();
    if (!db.hourglass) db.hourglass = {};
    return db.hourglass[username] || [];
}
async function createHourglass(username, name, targetDate) {
    if (USE_FIRESTORE) {
        const id = await firestoreAddDoc('hourglass', { username, name, targetDate });
        return id;
    }
    const db = readJsonDB();
    if (!db.hourglass) db.hourglass = {};
    if (!db.hourglass[username]) db.hourglass[username] = [];
    const entry = { id: Date.now().toString(), name, targetDate };
    db.hourglass[username].push(entry);
    writeJsonDB(db);
    return entry.id;
}
async function deleteHourglass(username, entryId) {
    if (USE_FIRESTORE) {
        const doc = await firestoreGetDoc('hourglass', entryId);
        if (doc && doc.username === username) {
            await firestoreDeleteDoc('hourglass', entryId);
        }
        return;
    }
    const db = readJsonDB();
    if (!db.hourglass) db.hourglass = {};
    if (db.hourglass[username]) {
        db.hourglass[username] = db.hourglass[username].filter(h => h.id !== entryId);
        writeJsonDB(db);
    }
}

// ====== FEEDBACK ======
async function findAllFeedback() {
    if (USE_FIRESTORE) {
        const snap = await firestoreDb.collection('feedback').orderBy('date', 'desc').get();
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    }
    const db = readJsonDB();
    return db.feedback || [];
}
async function createFeedback(data) {
    if (USE_FIRESTORE) {
        await firestoreAddDoc('feedback', { ...data, date: new Date().toISOString() });
        return;
    }
    const db = readJsonDB();
    if (!db.feedback) db.feedback = [];
    db.feedback.push({ ...data, date: new Date().toISOString() });
    writeJsonDB(db);
}
async function countFeedback() {
    if (USE_FIRESTORE) {
        return await firestoreCount('feedback');
    }
    const db = readJsonDB();
    return (db.feedback || []).length;
}

// ====== OTP CODES (persistent, cross-instance) ======
async function createOtpCode(email, code, purpose, expiresAt) {
    if (USE_FIRESTORE) {
        await firestoreAddDoc('otpCodes', { email, code, purpose, expiresAt: expiresAt.toISOString(), used: false, createdAt: new Date().toISOString() });
        return;
    }
    // JSON fallback handles OTP in-memory (otpStore in server.js)
}
async function verifyOtpCode(email, code, purpose) {
    if (USE_FIRESTORE) {
        const now = new Date().toISOString();
        try {
            const snap = await firestoreDb.collection('otpCodes')
                .where('email', '==', email)
                .where('expiresAt', '>', now)
                .orderBy('expiresAt', 'desc')
                .limit(5)
                .get();
            if (!snap.empty) {
                for (const doc of snap.docs) {
                    const d = doc.data();
                    if (d.code === code && d.purpose === purpose && !d.used) {
                        await doc.ref.update({ used: true });
                        return d;
                    }
                }
            }
        } catch (e) {
            console.error('Firestore verifyOtpCode error:', e.message);
        }
        return null;
    }
    return null; // JSON fallback uses otpStore
}

// ====== CHAT HISTORY (persistent, cross-instance) ======
async function getChatHistory(username, limit = 50) {
    if (USE_FIRESTORE) {
        const snap = await firestoreDb.collection('chatMessages')
            .where('username', '==', username)
            .orderBy('createdAt', 'asc')
            .get();
        const messages = snap.docs.map(d => ({ role: d.data().role, message: d.data().message }));
        return messages.slice(-limit);
    }
    return []; // JSON fallback uses in-memory chatHistory
}
async function addChatMessage(username, role, message) {
    if (USE_FIRESTORE) {
        await firestoreAddDoc('chatMessages', { username, role, message, createdAt: new Date().toISOString() });
        // Cleanup old messages
        const snap = await firestoreDb.collection('chatMessages')
            .where('username', '==', username)
            .orderBy('createdAt', 'desc')
            .get();
        if (snap.size > 50) {
            let count = 0;
            for (const doc of snap.docs) {
                count++;
                if (count > 50) await doc.ref.delete();
            }
        }
        return;
    }
    // JSON fallback uses in-memory chatHistory
}

// ====== COURSES (new, from app.py) ======
async function findCourses(username) {
    if (USE_FIRESTORE) {
        return await firestoreQuery('courses', 'username', '==', username);
    }
    const db = readJsonDB();
    if (!db.courses) db.courses = {};
    return db.courses[username] || [];
}
async function createCourse(username, name) {
    if (USE_FIRESTORE) {
        const existing = await firestoreQuery('courses', 'username', '==', username);
        const found = existing.find(c => c.name === name);
        if (found) throw new Error('duplicate');
        const id = await firestoreAddDoc('courses', { username, name });
        return id;
    }
    const db = readJsonDB();
    if (!db.courses) db.courses = {};
    if (!db.courses[username]) db.courses[username] = [];
    if (db.courses[username].includes(name)) throw new Error('duplicate');
    db.courses[username].push(name);
    writeJsonDB(db);
}
async function deleteCourse(username, courseId) {
    if (USE_FIRESTORE) {
        const doc = await firestoreGetDoc('courses', courseId);
        if (doc && doc.username === username) {
            await firestoreDeleteDoc('courses', courseId);
        }
        return;
    }
    const db = readJsonDB();
    if (!db.courses) db.courses = {};
    if (db.courses[username]) {
        db.courses[username].splice(parseInt(courseId), 1);
        writeJsonDB(db);
    }
}
async function countAllCourses() {
    if (USE_FIRESTORE) {
        return await firestoreCount('courses');
    }
    const db = readJsonDB();
    if (!db.courses) return 0;
    return Object.values(db.courses).reduce((s, arr) => s + arr.length, 0);
}
async function renameUserCourses(oldUsername, newUsername) {
    if (USE_FIRESTORE) {
        const courses = await findCourses(oldUsername);
        for (const c of courses) {
            await firestoreUpdateDoc('courses', c.id, { username: newUsername });
        }
        return;
    }
    const db = readJsonDB();
    if (!db.courses) db.courses = {};
    db.courses[newUsername] = db.courses[oldUsername];
    delete db.courses[oldUsername];
    writeJsonDB(db);
}
async function deleteUserCourses(username) {
    if (USE_FIRESTORE) {
        const courses = await findCourses(username);
        for (const c of courses) {
            await firestoreDeleteDoc('courses', c.id);
        }
        return;
    }
    const db = readJsonDB();
    if (!db.courses) db.courses = {};
    delete db.courses[username];
    writeJsonDB(db);
}

// ====== ADMIN STATS ======
async function getAdminStats() {
    if (USE_FIRESTORE) {
        const [users, tasks, schedules, feedback, courses] = await Promise.all([
            countUsers(), countAllTasks(), countAllSchedules(), countFeedback(), countAllCourses()
        ]);
        const allUsers = await getAllUsers();
        const males = allUsers.filter(u => u.gender === 'طالب' || u.gender === 'male' || u.gender === 'ذكر').length;
        const females = allUsers.filter(u => u.gender === 'طالبة' || u.gender === 'female' || u.gender === 'أنثى').length;
        const activeUsers = await countActiveUsers();
        const usersWithSchedules = await countUsersWithSchedules();
        return { users, tasks, schedules, feedback, courses, males, females, activeUsers, usersWithSchedules };
    }
    const db = readJsonDB();
    const users = db.users.length;
    const tasks = Object.values(db.tasks || {}).reduce((s, arr) => s + (arr ? arr.length : 0), 0);
    const schedules = Object.values(db.schedules || {}).reduce((s, arr) => s + (arr ? arr.length : 0), 0);
    const feedback = (db.feedback || []).length;
    const courses = db.courses ? Object.values(db.courses).reduce((s, arr) => s + arr.length, 0) : 0;
    const males = db.users.filter(u => u.gender === 'طالب' || u.gender === 'male' || u.gender === 'ذكر').length;
    const females = db.users.filter(u => u.gender === 'طالبة' || u.gender === 'female' || u.gender === 'أنثى').length;
    const activeUsers = Object.keys(db.tasks || {}).filter(k => db.tasks[k] && db.tasks[k].length > 0).length;
    const usersWithSchedules = Object.keys(db.schedules || {}).filter(k => db.schedules[k] && db.schedules[k].length > 0).length;
    return { users, tasks, schedules, feedback, courses, males, females, activeUsers, usersWithSchedules };
}

async function getAdminUsersList() {
    if (USE_FIRESTORE) {
        const users = await getAllUsers();
        const result = [];
        for (const u of users) {
            const [totalTasks, completedTasks, scheduleCount] = await Promise.all([
                countUserTasks(u.username),
                countUserCompletedTasks(u.username),
                countUserSchedules(u.username)
            ]);
            result.push({
                username: u.username,
                password: u.password,
                email: u.email || '',
                age: u.age,
                gender: u.gender,
                college: u.college,
                phone: u.phone || '',
                scheduleCount,
                taskCount: totalTasks,
                completedCount: completedTasks,
                completionPct: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
            });
        }
        return result;
    }
    const db = readJsonDB();
    return db.users.map(u => {
        const userTasks = db.tasks[u.username] || [];
        const totalTasks = userTasks.length;
        const completedTasks = userTasks.filter(t => t.completed).length;
        const scheduleCount = (db.schedules[u.username] || []).length;
        return {
            username: u.username, password: u.password, email: u.email || '',
            age: u.age, gender: u.gender, college: u.college, phone: u.phone || '',
            scheduleCount, taskCount: totalTasks,
            completedCount: completedTasks,
            completionPct: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
        };
    });
}

// ====== GENDER HELPER ======
async function getUserGender(username) {
    if (USE_FIRESTORE) {
        const user = await findUserByUsername(username);
        return user ? user.gender : null;
    }
    const db = readJsonDB();
    const user = db.users.find(u => u.username === username);
    return user ? user.gender : null;
}

module.exports = {
    USE_FIRESTORE,
    // Users
    findUserByUsername, findUserByEmail, getAllUsers, countUsers, createUser, updateUser, deleteUser,
    // Tasks
    findTasks, createTask, toggleTask, deleteTask, countAllTasks, countUserTasks, countUserCompletedTasks, countActiveUsers,
    renameUserTasks, deleteUserTasks,
    // Schedules
    findSchedules, createSchedule, deleteSchedule, countAllSchedules, countUserSchedules, countUsersWithSchedules,
    renameUserSchedules, deleteUserSchedules,
    // GPA
    findGpaData, saveGpaData,
    // Saved Schedules
    findSavedSchedules, createSavedSchedule, deleteSavedSchedule,
    // Absence
    findAbsence, createAbsence, updateAbsence, deleteAbsence,
    // Hourglass
    findHourglass, createHourglass, deleteHourglass,
    // Feedback
    findAllFeedback, createFeedback, countFeedback,
    // OTP
    createOtpCode, verifyOtpCode,
    // Chat
    getChatHistory, addChatMessage,
    // Courses
    findCourses, createCourse, deleteCourse, countAllCourses, renameUserCourses, deleteUserCourses,
    // Admin
    getAdminStats, getAdminUsersList,
    // Helpers
    getUserGender
};
