const admin = require('firebase-admin');

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
let serviceAccount = null;

if (serviceAccountBase64) {
    try {
        serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'));
    } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64:', e.message);
    }
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
} else {
    admin.initializeApp();
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

module.exports = { admin, db };
