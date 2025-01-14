"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAcc.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
exports.default = admin;
