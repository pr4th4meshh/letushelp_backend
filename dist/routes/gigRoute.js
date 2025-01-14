"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gigController_1 = require("../controllers/gigController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = express_1.default.Router();
router.post('/:organizationId/gigs', authMiddleware_1.authMiddleware, gigController_1.createGig);
router.get('/:organizationId/gigs', gigController_1.getOrganizationGigs);
router.post('/:gigId/apply', authMiddleware_1.authMiddleware, gigController_1.applyForGig);
router.patch('/:gigId/applications/:applicationId', authMiddleware_1.authMiddleware, gigController_1.updateGigApplicationStatus);
router.delete("/:gigId", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdmin, gigController_1.deleteGig);
router.put("/:gigId/update", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdmin, gigController_1.updateGig);
exports.default = router;
