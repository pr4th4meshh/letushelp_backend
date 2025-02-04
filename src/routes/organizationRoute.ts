import express from 'express';
import { createOrganization, getAllOrganizations, getOrganizationByName, getUsersByOrganization, updateOrganization } from '../controllers/organizationController';
import { isAdmin } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', createOrganization);
router.get('/:organizationName/users', authMiddleware, isAdmin, getUsersByOrganization);
router.get('/:organizationName', authMiddleware, getOrganizationByName);
router.get('/', getAllOrganizations);
router.put('/:organizationId', authMiddleware, updateOrganization);

export default router;