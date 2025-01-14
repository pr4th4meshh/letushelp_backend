"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, userController_1.createUser);
router.get('/:firebaseId', authMiddleware_1.authMiddleware, userController_1.getUserByFirebaseId);
router.get("/", userController_1.getAllUsersByOrganization);
router.put('/:firebaseId', authMiddleware_1.authMiddleware, userController_1.updateUser);
exports.default = router;
