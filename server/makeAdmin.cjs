// makeAdmin.cjs
const admin = require("firebase-admin");
const path = require("path");

// ✅ Load service account key
const serviceAccountPath = path.resolve(__dirname, "serviceAccountKey.json");
const serviceAccount = require(serviceAccountPath);

// ✅ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔑 Replace with your Firebase UID(s)
const uids = [
  "D8UHcCzqJ7dxf87yquCz5iR29Wa2" // onlygamingid.9798@gmail.com UID
];

// Function to make user(s) admin
async function makeAdmins() {
  try {
    for (const uid of uids) {
      console.log(`Attempting to make UID ${uid} an admin...`);
      await admin.auth().setCustomUserClaims(uid, { admin: true });
      console.log(`✅ User ${uid} has been made an admin.`);
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Error making user admin:", error);
    process.exit(1);
  }
}

// Run the function
makeAdmins();
