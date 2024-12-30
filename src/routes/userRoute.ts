import express from "express"
import { createUser, getAllUsers, getUserByFirebaseId, updateUser } from "../controllers/userController"

const router = express.Router()

router.post("/", createUser)
router.get('/:firebaseId', getUserByFirebaseId);
router.get("/", getAllUsers);
router.put('/:firebaseId', updateUser);

export default router;