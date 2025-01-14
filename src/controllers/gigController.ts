import { Request, Response } from "express"
import Gig, { IGig, IGigApplication } from "../models/gigModel"
import mongoose from "mongoose"
import Organization from "../models/organizationModel"
import User from "../models/userModel"

export const createGig = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params
    const { title, description, date, status } = req.body
    // create a new gig
    const gig = new Gig({
      title,
      description,
      date,
      status,
      organization: organizationId,
    })
    await gig.save()

    // add the gig to the organization
    const organization = await Organization.findById(organizationId)
    if (organization) {
      organization.gigs.push(gig._id as IGig)
      await organization.save()
    }

    res
      .status(201)
      .json({ message: "Gig created successfully", gigId: gig._id })
  } catch (error) {
    res.status(500).json({ message: "Error creating gig", error })
  }
}

export const getOrganizationGigs = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params
    const {
      page = 1,
      limit = 5,
      search = "",
      sortBy = "createdAt",
      sortOrder = "asc",
    } = req.query

    // build the query
    const query: any = {
      organization: organizationId,
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    // Count total gigs before applying pagination
    const totalGigs = await Gig.countDocuments(query)

    // Find the gigs, apply pagination, sorting, and limit
    const gigs = await Gig.find(query)
      .populate("organization")
      .populate({
        path: "applications.user",
        select: "firstName lastName email",
      })
      .sort({ [sortBy as string]: sortOrder === "asc" ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    // Calculate total pages
    const totalPages = Math.ceil(totalGigs / Number(limit))

    // Send the response with the gig data, pagination, and total count
    res.status(200).json({
      gigs,
      totalPages,
      currentPage: Number(page),
      totalGigs,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching organization gigs", error })
  }
}

export const applyForGig = async (req: any, res: any) => {
  try {
    // get the gig id from the URL
    const { gigId } = req.params
    const userId = req.user.uid

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" })
    }

    // get the user from the database
    const user = await User.findOne({ firebaseId: userId })
    if (!user) {
      return res.status(404).json({ message: "User not found in database" })
    }

    // get the gig from the database
    const gig = await Gig.findById(gigId)
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" })
    }

    // check if the user has already applied for the gig
    if (gig.applications.some((app) => app.user.equals(user._id as any))) {
      return res
        .status(400)
        .json({ message: "You have already applied for this gig" })
    }

    // add the user to the gig applications
    gig.applications.push({
      user: user._id,
      status: "pending",
      firebaseId: userId,
    } as IGigApplication)
    await gig.save()

    res.status(200).json({ message: "Application submitted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error applying for gig", error })
  }
}

export const updateGigApplicationStatus = async (req: any, res: any) => {
  try {
    const { gigId, applicationId } = req.params
    const { status } = req.body

    // get the gig from the database
    const gig = await Gig.findById(gigId)
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" })
    }

    //   const application = gig.applications.id(applicationId);
    const application = gig.applications.find(
      (app: any) => app._id.toString() === applicationId
    )
    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // update the application status
    application.status = status
    await gig.save()

    res.status(200).json({ message: "Application status updated successfully" })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating application status", error })
  }
}

export const deleteGig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gigId } = req.params

    // delete the gig from the database
    const gig = await Gig.findByIdAndDelete(gigId)
    if (!gig) {
      res.status(404).json({ message: "Gig not found" })
      return
    }

    res.status(200).json({ message: "Gig deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting gig", error })
  }
}

export const updateGig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gigId } = req.params
    const { title, description, date, status } = req.body

    // update the gig in the database
    const gig = await Gig.findByIdAndUpdate(
      gigId,
      { title, description, date, status },
      { new: true }
    )

    // if the gig is not found, return a 404 error
    if (!gig) {
      res.status(404).json({ message: "Gig not found" })
      return
    }

    res.status(200).json({ message: "Gig updated successfully", gig })
  } catch (error) {
    res.status(500).json({ message: "Error updating gig", error })
  }
}
