/*
scripts/firebase_check.js

Run with: node scripts/firebase_check.js

Requires env vars in .env.local or environment:
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (with literal \n for newlines when stored in env)
- FIREBASE_STORAGE_BUCKET

Installs: `npm install firebase-admin dotenv --no-save` if needed.
*/

// Load .env.local explicitly (Next.js uses .env.local)
require('dotenv').config({ path: '.env.local' });

(async () => {
  try {
    const admin = require('firebase-admin');

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

    if (!projectId || !clientEmail || !privateKey || !bucketName) {
      console.error('MISSING_ENV', JSON.stringify({ projectId: !!projectId, clientEmail: !!clientEmail, bucket: !!bucketName }));
      process.exit(2);
    }

    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      storageBucket: bucketName,
    });

    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({ maxResults: 1 });

    console.log('OK_FILES', files.length);
    process.exit(0);
  } catch (err) {
    console.error('ERR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
