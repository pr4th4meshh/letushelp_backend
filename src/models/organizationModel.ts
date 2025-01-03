import mongoose, { Schema } from "mongoose"

export interface IOrganization {
  organizationName: string
  organizationDisplayName: string
  users: string[]
}

const organizationSchema = new Schema<IOrganization>({
  organizationName: { type: String, required: true, unique: true },
  organizationDisplayName: { type: String, required: true, unique: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

const Organization = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
)

export default Organization
