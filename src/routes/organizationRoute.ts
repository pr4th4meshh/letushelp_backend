import express from 'express';
import { createOrganization, getAllOrganizations, getUsersByOrganization } from '../controllers/organizationController';

const router = express.Router();

router.post('/', createOrganization);
router.get('/:organizationName/users', getUsersByOrganization);
router.get('/', getAllOrganizations);

export default router;