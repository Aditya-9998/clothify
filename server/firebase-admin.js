// server/firebase-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // apna downloaded service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com" // replace with your Firebase project URL
});

const uid = "D8UHcCzqJ7dxf87yquCz5iR29Wa2"; // onlygamingid.9798@gmail.com UID

// Example: Get user info
async function getUserInfo() {
  try {
    const userRecord = await admin.auth().getUser(uid);
    console.log('User data:', userRecord.toJSON());
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

getUserInfo();

module.exports = admin;
