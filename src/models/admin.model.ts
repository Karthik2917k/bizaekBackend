import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import mongoose_delete from 'mongoose-delete';

// Define an interface for the document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileImg?: string;
  status: boolean;
  userType: 'ADMIN' | 'AGENT';
}

// Define the user schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    profileImg: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    userType: {
      type: String,
      enum: ['ADMIN', 'AGENT'],
      default: 'ADMIN',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add the soft delete plugin
userSchema.plugin(mongoose_delete, {
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate', 'update'],
});

// Define the Admin model
const Admin: Model<IUser> = mongoose.model<IUser>('Admin', userSchema);

export default Admin;
