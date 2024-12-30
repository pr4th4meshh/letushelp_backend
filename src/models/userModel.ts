import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface for the user model
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  firebaseId: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the schema for the user model
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firebaseId: { type: String, required: true, unique: true },
});

// Hash and salt the password before saving it to the database
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare a password with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create a new user model
const User = mongoose.model<IUser>('User', userSchema);

export default User;