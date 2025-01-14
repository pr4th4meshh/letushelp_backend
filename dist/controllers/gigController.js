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
exports.updateGig = exports.deleteGig = exports.updateGigApplicationStatus = exports.applyForGig = exports.getOrganizationGigs = exports.createGig = void 0;
const gigModel_1 = __importDefault(require("../models/gigModel"));
const organizationModel_1 = __importDefault(require("../models/organizationModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const createGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId } = req.params;
        const { title, description, date, status } = req.body;
        // create a new gig
        const gig = new gigModel_1.default({
            title,
            description,
            date,
            status,
            organization: organizationId,
        });
        yield gig.save();
        // add the gig to the organization
        const organization = yield organizationModel_1.default.findById(organizationId);
        if (organization) {
            organization.gigs.push(gig._id);
            yield organization.save();
        }
        res
            .status(201)
            .json({ message: "Gig created successfully", gigId: gig._id });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating gig", error });
    }
});
exports.createGig = createGig;
const getOrganizationGigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId } = req.params;
        const { page = 1, limit = 5, search = "", sortBy = "createdAt", sortOrder = "asc", } = req.query;
        // build the query
        const query = {
            organization: organizationId,
        };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        // Count total gigs before applying pagination
        const totalGigs = yield gigModel_1.default.countDocuments(query);
        // Find the gigs, apply pagination, sorting, and limit
        const gigs = yield gigModel_1.default.find(query)
            .populate("organization")
            .populate({
            path: "applications.user",
            select: "firstName lastName email",
        })
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        // Calculate total pages
        const totalPages = Math.ceil(totalGigs / Number(limit));
        // Send the response with the gig data, pagination, and total count
        res.status(200).json({
            gigs,
            totalPages,
            currentPage: Number(page),
            totalGigs,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching organization gigs", error });
    }
});
exports.getOrganizationGigs = getOrganizationGigs;
const applyForGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the gig id from the URL
        const { gigId } = req.params;
        const userId = req.user.uid;
        if (!userId) {
            return res.status(400).json({ message: "User not authenticated" });
        }
        // get the user from the database
        const user = yield userModel_1.default.findOne({ firebaseId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }
        // get the gig from the database
        const gig = yield gigModel_1.default.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        // check if the user has already applied for the gig
        if (gig.applications.some((app) => app.user.equals(user._id))) {
            return res
                .status(400)
                .json({ message: "You have already applied for this gig" });
        }
        // add the user to the gig applications
        gig.applications.push({
            user: user._id,
            status: "pending",
            firebaseId: userId,
        });
        yield gig.save();
        res.status(200).json({ message: "Application submitted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error applying for gig", error });
    }
});
exports.applyForGig = applyForGig;
const updateGigApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gigId, applicationId } = req.params;
        const { status } = req.body;
        // get the gig from the database
        const gig = yield gigModel_1.default.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        //   const application = gig.applications.id(applicationId);
        const application = gig.applications.find((app) => app._id.toString() === applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        // update the application status
        application.status = status;
        yield gig.save();
        res.status(200).json({ message: "Application status updated successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error updating application status", error });
    }
});
exports.updateGigApplicationStatus = updateGigApplicationStatus;
const deleteGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gigId } = req.params;
        // delete the gig from the database
        const gig = yield gigModel_1.default.findByIdAndDelete(gigId);
        if (!gig) {
            res.status(404).json({ message: "Gig not found" });
            return;
        }
        res.status(200).json({ message: "Gig deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting gig", error });
    }
});
exports.deleteGig = deleteGig;
const updateGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gigId } = req.params;
        const { title, description, date, status } = req.body;
        // update the gig in the database
        const gig = yield gigModel_1.default.findByIdAndUpdate(gigId, { title, description, date, status }, { new: true });
        // if the gig is not found, return a 404 error
        if (!gig) {
            res.status(404).json({ message: "Gig not found" });
            return;
        }
        res.status(200).json({ message: "Gig updated successfully", gig });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating gig", error });
    }
});
exports.updateGig = updateGig;
