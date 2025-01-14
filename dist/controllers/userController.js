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
exports.updateUser = exports.getUserByFirebaseId = exports.getAllUsersByOrganization = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
// Create a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, firebaseId } = req.body;
        const user = new userModel_1.default({
            firstName,
            lastName,
            email,
            firebaseId,
        });
        yield user.save();
        res
            .status(201)
            .json({ message: "User created successfully", userId: user._id });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error: error });
    }
});
exports.createUser = createUser;
// Get all users
const getAllUsersByOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error });
    }
});
exports.getAllUsersByOrganization = getAllUsersByOrganization;
// Get a user by firebaseId
const getUserByFirebaseId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseId } = req.params;
        if (!firebaseId) {
            res.status(400).json({ message: "Firebase ID not available" });
            return;
        }
        const user = yield userModel_1.default.findOne({ firebaseId });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving user", error: error });
    }
});
exports.getUserByFirebaseId = getUserByFirebaseId;
// Update a user by firebaseId (only if the firebaseId in the URL matches the authenticated user's token)
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseId } = req.params; // Get firebaseId from URL parameters
        const { firstName, lastName, email } = req.body; // Get updated user details from body
        // Check if the firebaseId from the URL matches the uid from the Firebase token (authenticated user)
        if (!req.user || req.user.uid !== firebaseId) {
            res.status(403).json({ message: "You can only update your own account" });
            return;
        }
        // Update user information in the database
        const user = yield userModel_1.default.findOneAndUpdate({ firebaseId }, // Find user by firebaseId
        { firstName, lastName, email }, // Update the user's details
        { new: true } // Return the updated user
        );
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Return the updated user information
        res.status(200).json({ message: "User updated successfully", user });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error });
    }
});
exports.updateUser = updateUser;
