import { Request, Response } from "express"
import User, { IUser } from "../models/userModel"
import Organization from "../models/organizationModel"

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email, firebaseId, role, organizationName } =
      req.body
    const user: IUser = new User({
      firstName,
      lastName,
      email,
      firebaseId,
      role,
      organizationName,
    })

    if(role === "team-member" && organizationName) {
      const organization = await Organization.findOne({ organizationName })

      if(!organization) {
        res.status(404).json({ message: "Organization not found" })
        return;
      }

      organization.users.push(user._id as string)
      await organization.save()
    }

    await user.save()
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id })
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error })
  }
}

// Get all users
export const getAllUsersByOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { organizationName } = req.params
    const users = await User.find({ organizationName })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error: error })
  }
}

// Get a user by firebaseId
export const getUserByFirebaseId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firebaseId } = req.params
    if (!firebaseId) {
      res.status(400).json({ message: "Firebase ID not available" })
      return
    }

    const user = await User.findOne({ firebaseId }).select(
      "-password -firebaseId"
    )

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error })
  }
}

// Update a user by firebaseId (only if the firebaseId in the URL matches the authenticated user's token)
export const updateUser = async (req: any, res: any) => {
  try {
    const { firebaseId } = req.params
    const { firstName, lastName, email, role, organizationName } = req.body

    // Check if the firebaseId from the URL matches the uid from the Firebase token (authenticated user)

    if (!req.user || req.user.uid !== firebaseId) {
      res.status(403).json({ message: "You can only update your own account" })
      return
    }

    // Update user information in the database
    const user = await User.findOneAndUpdate(
      { firebaseId },
      { firstName, lastName, email, role, organizationName },
      { new: true }
    )

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    // Return the updated user information
    res.status(200).json({ message: "User updated successfully", user })
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ message: "Error updating user", error })
  }
}
