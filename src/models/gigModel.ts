import mongoose, { Document, Schema } from 'mongoose';

export interface IGigApplication extends Document {
  user: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  firebaseId: string;
}

export interface IGig extends Document {
  title: string;
  description: string;
  date: Date;
  status: 'open' | 'closed';
  organization: mongoose.Types.ObjectId;
  applications: IGigApplication[];
}

const gigApplicationSchema = new Schema<IGigApplication>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  firebaseId: { type: String, required: true, unique: true }
});

const gigSchema = new Schema<IGig>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  applications: [gigApplicationSchema]
});

const Gig = mongoose.model<IGig>('Gig', gigSchema);

export default Gig;