import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  firebaseId: string
  role: string
  organizationName: string
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseId: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["admin", "volunteer", "team-member"],
    default: "volunteer",
  },
  organizationName: { type: String, required: false },
})

// validation for organizationName
userSchema.pre("save", function (next) {
  if (
    this.role === "team-member" &&
    (!this.organizationName || this.organizationName === "none")
  ) {
    return next(
      new Error(
        "Organization name is required for users with role 'team-member'"
      )
    )
  }
  next()
})

const User = mongoose.model<IUser>("User", userSchema)

export default User
