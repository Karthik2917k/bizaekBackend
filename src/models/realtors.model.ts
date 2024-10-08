import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";
import { isEmail } from "validator";

// Define an interface for the realtor document
export interface IRealtors extends Document {
  userId?: mongoose.Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  countryCode?: number;
  phone?: number;
  email: string;
  membership?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  about?: string;
  companyName?: string;
  languages?: mongoose.Schema.Types.ObjectId[]; // Array of Language ObjectIds
  cultures?: mongoose.Schema.Types.ObjectId[]; // Array of Culture ObjectIds
  services?: mongoose.Schema.Types.ObjectId[]; // Array of Service ObjectIds
  licenses?: mongoose.Schema.Types.ObjectId[]; // Array of License ObjectIds
  officeAddress?: string;
  city?: mongoose.Schema.Types.ObjectId; // Reference to City ObjectId
  zip?: string;
  state?: mongoose.Schema.Types.ObjectId; // Reference to State ObjectId
  country?: mongoose.Schema.Types.ObjectId; // Reference to Country ObjectId
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED"; 
}

// Define the schema
const userSchema: Schema<IRealtors> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure this references the correct User model
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
    membership: {
      type: String,
      trim: true, // Trim whitespace
    },
    website: {
      type: String,
      trim: true, // Trim whitespace
    },
    linkedin: {
      type: String,
      trim: true, // Trim whitespace
    },
    instagram: {
      type: String,
      trim: true, // Trim whitespace
    },
    facebook: {
      type: String,
      trim: true, // Trim whitespace
    },
    about: {
      type: String,
      trim: true, // Trim whitespace
    },
    companyName: {
      type: String,
      trim: true, // Trim whitespace
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
    licenses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "License",
    }],
    officeAddress: {
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
const Realtors = mongoose.model<IRealtors>("Realtors", userSchema);
export default Realtors;
