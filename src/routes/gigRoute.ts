import express from 'express';
import { createGig, getOrganizationGigs, applyForGig, updateGigApplicationStatus, deleteGig, updateGig } from '../controllers/gigController';
import { authMiddleware } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';

const router = express.Router();

router.post('/:organizationId/gigs', authMiddleware, createGig);
router.get('/:organizationId/gigs', getOrganizationGigs);
router.post('/:gigId/apply', authMiddleware, applyForGig);
router.patch('/:gigId/applications/:applicationId', authMiddleware, updateGigApplicationStatus);
router.delete("/:gigId", authMiddleware, isAdmin, deleteGig)
router.put("/:gigId/update", authMiddleware, isAdmin, updateGig)

export default router;