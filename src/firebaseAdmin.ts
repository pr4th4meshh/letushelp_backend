const admin = require("firebase-admin");

const serviceAccount = require("./config/serviceAcc.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

export default admin;
