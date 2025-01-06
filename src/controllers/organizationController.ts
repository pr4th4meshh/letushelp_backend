import { Request, Response } from "express"
import Organization from "../models/organizationModel"
import User from "../models/userModel"

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { organizationDisplayName, organizationName } = req.body
    const organization = new Organization({
      organizationName,
      organizationDisplayName,
    })
    await organization.save()
    res.status(201).json({ message: "Organization created successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error creating organization", error })
  }
}

// get users by organization controller
export const getUsersByOrganization = async (req: Request, res: Response) => {
  try {
    const { organizationName } = req.params
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "role",
      sortOrder = "asc",
    } = req.query

    const query = {
      organizationName: organizationName,
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }

    const users = await User.find(query)
      .sort({ [sortBy as string]: sortOrder === "asc" ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select("-password -firebaseId")

    const total = await User.countDocuments(query)

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    })
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error })
  }
}

// get all organizations
export const getAllOrganizations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allOrganizations = await Organization.find().populate('gigs')

    if (allOrganizations.length === 0) {
      res.status(404).json({ message: "No organizations found" })
      return
    }
    res.status(200).json(allOrganizations)
    return
  } catch (error) {
    res.status(500).json({ message: "Error retrieving organizations", error })
    return
  }
}

// get organization by name
export const getOrganizationByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { organizationName } = req.params
    const organization = await Organization.findOne({ organizationName })

    if (!organization) {
      res.status(404).json({ message: "Organization not found" })
      return
    }

    res.status(200).json(organization)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving organization", error })
  }
}
