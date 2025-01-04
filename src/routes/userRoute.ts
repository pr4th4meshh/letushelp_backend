import express from "express"
import { createUser, getAllUsersByOrganization, getUserByFirebaseId, updateUser } from "../controllers/userController"
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router()

router.post("/", createUser)
router.get('/:firebaseId', getUserByFirebaseId);
router.get("/organization/:organizationName", getAllUsersByOrganization);
router.put('/:firebaseId', authMiddleware, updateUser);

export default router;