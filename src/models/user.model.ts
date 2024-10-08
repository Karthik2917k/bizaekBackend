import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";
import { isEmail } from "validator";

// Define an interface for the user document
export interface IUser extends Document {
  googleId?: string;
  facebookId?: string;
  twitterId?: string;
  name?: string;
  email: string;
  password?: string;
  profilePic?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

// Define the schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true
    },
    twitterId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true,
      validate: [isEmail, "Invalid email"],
    },
    password: {
      type: String,
      // required: true,
    },
    profilePic: {
      type: String,
      default:""
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

// Add the mongoose-delete plugin
userSchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create and export the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
