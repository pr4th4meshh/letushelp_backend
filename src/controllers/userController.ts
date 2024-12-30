import { Request, Response } from "express"
import User, { IUser } from "../models/userModel"

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email, password, firebaseId } = req.body
    const user: IUser = new User({
      firstName,
      lastName,
      email,
      password,
      firebaseId,
    })

    await user.save()
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id })
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error })
  }
}

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password")
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
    const user = await User.findOne({ firebaseId }).select("-password")

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error })
  }
}

// Update a user by firebaseId
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firebaseId } = req.params
    const { firstName, lastName, email } = req.body

    const user = await User.findOneAndUpdate(
      { firebaseId },
      { firstName, lastName, email },
      { new: true }
    ).select("-password")

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    res.status(200).json({ message: "User updated successfully", user })
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error })
  }
}
