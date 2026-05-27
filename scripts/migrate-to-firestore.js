// One-time migration script: transfers database.json to Firestore
// Usage: node scripts/migrate-to-firestore.js
// Requires FIREBASE_SERVICE_ACCOUNT_BASE64 or GOOGLE_APPLICATION_CREDENTIALS env var

const fs = require('fs');
const path = require('path');
const { db } = require('../firebase-config');

const DB_FILE = path.join(__dirname, '..', 'database.json');

if (!db) {
    console.error('Firestore not configured. Set FIREBASE_SERVICE_ACCOUNT_BASE64 or GOOGLE_APPLICATION_CREDENTIALS.');
    process.exit(1);
}

async function migrate() {
    if (!fs.existsSync(DB_FILE)) {
        console.error('database.json not found at', DB_FILE);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    let total = 0;

    // 1. Migrate users
    if (data.users && data.users.length) {
        console.log(`Migrating ${data.users.length} users...`);
        for (const user of data.users) {
            await db.collection('users').doc(user.username).set(user);
            total++;
        }
        console.log(`  ✓ Users done`);
    }

    // 2. Migrate tasks
    if (data.tasks) {
        const taskEntries = Object.entries(data.tasks);
        console.log(`Migrating tasks for ${taskEntries.length} users...`);
        for (const [username, tasks] of taskEntries) {
            if (!tasks || !tasks.length) continue;
            for (const task of tasks) {
                await db.collection('tasks').add({ username, ...task });
                total++;
            }
        }
        console.log(`  ✓ Tasks done`);
    }

    // 3. Migrate schedules
    if (data.schedules) {
        const scheduleEntries = Object.entries(data.schedules);
        console.log(`Migrating schedules for ${scheduleEntries.length} users...`);
        for (const [username, schedules] of scheduleEntries) {
            if (!schedules || !schedules.length) continue;
            for (const schedule of schedules) {
                await db.collection('schedules').add({ username, ...schedule });
                total++;
            }
        }
        console.log(`  ✓ Schedules done`);
    }

    // 4. Migrate GPA data
    if (data.gpaData) {
        const gpaEntries = Object.entries(data.gpaData);
        console.log(`Migrating GPA data for ${gpaEntries.length} users...`);
        for (const [username, rows] of gpaEntries) {
            if (!rows || !rows.length) continue;
            for (const row of rows) {
                await db.collection('gpaData').add({ username, ...row });
                total++;
            }
        }
        console.log(`  ✓ GPA data done`);
    }

    // 5. Migrate saved schedules
    if (data.savedSchedules) {
        const ssEntries = Object.entries(data.savedSchedules);
        console.log(`Migrating saved schedules for ${ssEntries.length} users...`);
        for (const [username, entries] of ssEntries) {
            if (!entries || !entries.length) continue;
            for (const entry of entries) {
                await db.collection('savedSchedules').add({ username, ...entry });
                total++;
            }
        }
        console.log(`  ✓ Saved schedules done`);
    }

    // 6. Migrate hourglass
    if (data.hourglass) {
        const hgEntries = Object.entries(data.hourglass);
        console.log(`Migrating hourglass for ${hgEntries.length} users...`);
        for (const [username, entries] of hgEntries) {
            if (!entries || !entries.length) continue;
            for (const entry of entries) {
                await db.collection('hourglass').add({ username, ...entry });
                total++;
            }
        }
        console.log(`  ✓ Hourglass done`);
    }

    // 7. Migrate absence
    if (data.absence) {
        const absEntries = Object.entries(data.absence);
        console.log(`Migrating absence for ${absEntries.length} users...`);
        for (const [username, entries] of absEntries) {
            if (!entries || !entries.length) continue;
            for (const entry of entries) {
                await db.collection('absence').add({ username, ...entry });
                total++;
            }
        }
        console.log(`  ✓ Absence done`);
    }

    // 8. Migrate feedback
    if (data.feedback && data.feedback.length) {
        console.log(`Migrating ${data.feedback.length} feedback entries...`);
        for (const entry of data.feedback) {
            await db.collection('feedback').add(entry);
            total++;
        }
        console.log(`  ✓ Feedback done`);
    }

    // 9. Migrate courses
    if (data.courses) {
        const courseEntries = Object.entries(data.courses);
        console.log(`Migrating courses for ${courseEntries.length} users...`);
        for (const [username, courses] of courseEntries) {
            if (!courses || !courses.length) continue;
            for (const course of courses) {
                await db.collection('courses').add({ username, name: course });
                total++;
            }
        }
        console.log(`  ✓ Courses done`);
    }

    console.log(`\n✅ Migration complete! ${total} documents migrated to Firestore.`);
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
