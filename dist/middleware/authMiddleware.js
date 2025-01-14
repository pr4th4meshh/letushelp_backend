"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebaseAdmin_1 = __importDefault(require("../firebaseAdmin"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(403).json({ message: "Unauthorized: No token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(403).json({ message: "Invalid token format" });
            return;
        }
        // Verify token using Firebase Admin SDK
        const decodedToken = yield firebaseAdmin_1.default.auth().verifyIdToken(token);
        req.user = decodedToken;
        const userDoc = yield firebaseAdmin_1.default.firestore().collection("users").doc(decodedToken.uid).get();
        if (!userDoc.exists) {
            return res.status(403).json({ message: "User not found" });
        }
        const userData = userDoc.data();
        const role = userData === null || userData === void 0 ? void 0 : userData.role;
        if (!role) {
            return res.status(403).json({ message: "Role not found for this user" });
        }
        req.user.role = role;
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error);
        res.status(403).json({ message: "Unauthorized" });
    }
});
exports.authMiddleware = authMiddleware;
