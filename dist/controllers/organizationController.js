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
exports.updateOrganization = exports.getOrganizationByName = exports.getAllOrganizations = exports.getUsersByOrganization = exports.createOrganization = void 0;
const organizationModel_1 = __importDefault(require("../models/organizationModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const createOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationName } = req.body;
        // Log the received organization name
        console.log("Received organization name:", organizationName);
        if (!organizationName || organizationName.trim() === "") {
            res.status(400).json({ message: "Organization name is required" });
            return;
        }
        // Check if the organization already exists
        const existingOrganization = yield organizationModel_1.default.findOne({
            organizationName,
        });
        if (existingOrganization) {
            res.status(400).json({ message: "Organization already exists" });
            return;
        }
        // Create a new organization
        const organization = new organizationModel_1.default({ organizationName });
        yield organization.save();
        res.status(201).json({ message: "Organization created successfully" });
    }
    catch (error) {
        console.error("Error creating organization", error);
        res.status(500).json({ message: "Error creating organization", error });
    }
});
exports.createOrganization = createOrganization;
// get users by organization controller
const getUsersByOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get organization name from URL
        const { organizationName } = req.params;
        const { page = 1, limit = 10, search = "", sortBy = "role", sortOrder = "asc", } = req.query;
        // build query
        const query = {
            organizationName: organizationName,
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        };
        // find users
        const users = yield userModel_1.default.find(query)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .select("-password -firebaseId");
        // count total users
        const total = yield userModel_1.default.countDocuments(query);
        res.status(200).json({
            users,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
    }
});
exports.getUsersByOrganization = getUsersByOrganization;
// get all organizations
const getAllOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get all organizations
        const allOrganizations = yield organizationModel_1.default.find().populate("gigs");
        // check if there are no organizations
        if (allOrganizations.length === 0) {
            res.status(404).json({ message: "No organizations found" });
            return;
        }
        res.status(200).json(allOrganizations);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving organizations", error });
        return;
    }
});
exports.getAllOrganizations = getAllOrganizations;
// get organization by name
const getOrganizationByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get organization name from URL
        const { organizationName } = req.params;
        const organization = yield organizationModel_1.default.findOne({ organizationName });
        if (!organization) {
            res.status(404).json({ message: "Organization not found" });
            return;
        }
        res.status(200).json(organization);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving organization", error });
    }
});
exports.getOrganizationByName = getOrganizationByName;
// update organization details
const updateOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId } = req.body;
        const { organizationName } = req.body;
        // update organization details
        const organization = yield organizationModel_1.default.findOneAndUpdate({ organizationId }, { organizationName }, { new: true });
        if (!organization) {
            res.status(404).json({ message: "Organization not found" });
            return;
        }
        res.status(200).json({ message: "Organization updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating organization", error });
    }
});
exports.updateOrganization = updateOrganization;
