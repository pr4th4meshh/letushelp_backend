import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface for the user model
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  firebaseId: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the schema for the user model
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseId: { type: String, required: true, unique: true },
});

// Create a new user model
const User = mongoose.model<IUser>('User', userSchema);

export default User;