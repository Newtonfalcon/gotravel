/*
scripts/firestore_check.js

Run with: node scripts/firestore_check.js

Requires env vars in .env.local or environment:
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (with literal \n for newlines when stored in env)

This script writes a short doc to Firestore, reads it back, and deletes it.
*/

require('dotenv').config({ path: '.env.local' });

(async () => {
  try {
    const admin = require('firebase-admin');

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.error('MISSING_ENV', JSON.stringify({ projectId: !!projectId, clientEmail: !!clientEmail }));
      process.exit(2);
    }

    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });

    const db = admin.firestore();

    const ref = await db.collection('health_checks').add({ ok: true, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    console.log('WROTE', ref.id);

    const snap = await db.collection('health_checks').doc(ref.id).get();
    if (!snap.exists) {
      console.error('READ_FAILED');
      process.exit(1);
    }
    console.log('READ', snap.id, snap.data());

    await db.collection('health_checks').doc(ref.id).delete();
    console.log('DELETED', ref.id);
    process.exit(0);
  } catch (err) {
    console.error('ERR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
