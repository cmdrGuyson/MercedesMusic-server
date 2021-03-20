//Configuring firebase admin and initialization
const admin = require("firebase-admin");

const { adminSdk } = require("./config/firebase_admin_sdk");

const config = require("./config/fb_config");
serviceAccount = adminSdk;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.storageBucket,
});

const messaging = admin.messaging();

module.exports = { admin, messaging };
