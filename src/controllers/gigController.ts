import { Request, Response } from "express"
import Gig, { IGig, IGigApplication } from "../models/gigModel"
import mongoose from "mongoose"
import Organization from "../models/organizationModel"
import User from "../models/userModel"

export const createGig = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params
    const { title, description, date, status } = req.body
    const gig = new Gig({
      title,
      description,
      date,
      status,
      organization: organizationId,
    })
    await gig.save()

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
    const gigs = await Gig.find({ organization: organizationId })
      .populate("organization")
      .populate({
        path: "applications.user",
        select: "firstName lastName email",
      })

    res.json(gigs)
  } catch (error) {
    res.status(500).json({ message: "Error fetching organization gigs", error })
  }
}

export const applyForGig = async (req: any, res: any) => {
  try {
    const { gigId } = req.params
    const userId = req.user.uid

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" })
    }

    const user = await User.findOne({ firebaseId: userId })
    if (!user) {
      return res.status(404).json({ message: "User not found in database" })
    }

    const gig = await Gig.findById(gigId)
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" })
    }

    if (gig.applications.some((app) => app.user.equals(user._id as any))) {
      return res
        .status(400)
        .json({ message: "You have already applied for this gig" })
    }

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

    const gig = await Gig.findByIdAndUpdate(gigId, { title, description, date, status }, { new: true })
    if (!gig) {
      res.status(404).json({ message: "Gig not found" })
      return
    }

    res.status(200).json({ message: "Gig updated successfully", gig })
  } catch (error) {
    res.status(500).json({ message: "Error updating gig", error })
  }
}