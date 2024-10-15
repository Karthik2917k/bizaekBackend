import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";
import { isEmail } from "validator";

// Define an interface for the templers document
export interface ITemplers extends Document {
  userId?: mongoose.Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  countryCode?: number;
  phone?: number;
  email: string;
  institution?: string;
  category?:  mongoose.Schema.Types.ObjectId[];// Array of category strings
  about?: string;
  languages?:  mongoose.Schema.Types.ObjectId[]; // Array of language strings
  cultures?:  mongoose.Schema.Types.ObjectId[]; // Array of culture strings
  services?:  mongoose.Schema.Types.ObjectId[]; // Array of service strings
  address?: string;
  city?: mongoose.Schema.Types.ObjectId; // Reference to city ObjectId
  zip?: string;
  state?: mongoose.Schema.Types.ObjectId; // Reference to state ObjectId
  country?: mongoose.Schema.Types.ObjectId; // Reference to country ObjectId
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

// Define the schema
const userSchema: Schema<ITemplers> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure this matches your User model
      required: false,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true, // Trim whitespace
    },
    lastName: {
      type: String,
      trim: true, // Trim whitespace
    },
    profilePic: {
      type: String,
      default: "",
    },
    countryCode: {
      type: Number,
    },
    phone: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      index: true,
      validate: [isEmail, "Invalid email"],
    },
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }],
    institution: {
      type: String,
      trim: true, // Trim whitespace
    },
    about: {
      type: String,
    },
    languages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
    }],
    cultures: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Culture",
    }],
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    }],
    address: {
      type: String,
      trim: true, // Trim whitespace
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    zip: {
      type: String,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
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
const Templers = mongoose.model<ITemplers>("Templers", userSchema);
export default Templers;
