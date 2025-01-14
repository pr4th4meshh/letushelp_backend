import mongoose, { Schema } from "mongoose"
import { IGig } from "./gigModel"

export interface IOrganization {
  organizationName: string
  users: string[]
  gigs: IGig[]
}

const organizationSchema = new Schema<IOrganization>({
  organizationName: { type: String, required: true, unique: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  gigs: [{ type: Schema.Types.ObjectId, ref: "Gig" }],
})

const Organization = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
)

export default Organization
