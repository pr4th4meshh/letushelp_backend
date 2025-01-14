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
        if (!authHeader) {
            res.status(403).json({ message: "No token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(403).json({ message: "Invalid token format" });
            return;
        }
        // Verify token using Firebase Admin SDK
        const decodedToken = yield firebaseAdmin_1.default.auth().verifyIdToken(token);
        console.log("DECODED_TOKEN", decodedToken);
        req.user = decodedToken;
        console.log("REQ_USER", req.user.uid);
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error);
        res.status(403).json({ message: "Unauthorized" });
    }
});
exports.authMiddleware = authMiddleware;
