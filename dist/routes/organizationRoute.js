"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organizationController_1 = require("../controllers/organizationController");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', organizationController_1.createOrganization);
router.get('/:organizationName/users', authMiddleware_1.authMiddleware, adminMiddleware_1.isAdmin, organizationController_1.getUsersByOrganization);
router.get('/:organizationName', authMiddleware_1.authMiddleware, organizationController_1.getOrganizationByName);
router.get('/', organizationController_1.getAllOrganizations);
router.put('/:organizationId', authMiddleware_1.authMiddleware, organizationController_1.updateOrganization);
exports.default = router;
