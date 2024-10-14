import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";
import { isEmail } from "validator";

// Define an interface for the Insurance Agent document
export interface IInsuranceAgent extends Document {
  userId?: mongoose.Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | File; // File or string for profile picture
  email: string;
  contactNumber: string;
  yearsOfExperience: number;
  licenseNumber?: string;
  typesOfInsurance?: mongoose.Schema.Types.ObjectId[]; // Relation to insurance types
  certifications?: string[]; // Normal array of strings
  insuranceCompaniesRepresented?: string[]; // Normal array of strings
  specializations?: string[]; // Normal array of strings
  languages?: mongoose.Schema.Types.ObjectId[]; // Relation to languages
  description?: string; // Rich text
  linkedin?: string;
  twitter?: string;
  website?: string;
  country?: mongoose.Schema.Types.ObjectId; // Reference to country
  state?: mongoose.Schema.Types.ObjectId; // Reference to state
  city?: mongoose.Schema.Types.ObjectId; // Reference to city
  locations?: string[]; // Normal array of strings
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

// Define the schema
const insuranceAgentSchema: Schema<IInsuranceAgent> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: false,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail, "Invalid email"],
    },
    contactNumber: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    licenseNumber: {
      type: String,
    },
    typesOfInsurance: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsuranceType", // Relation to insurance types
    }],
    certifications: [{
      type: String,
    }],
    insuranceCompaniesRepresented: [{
      type: String,
    }],
    specializations: [{
      type: String,
    }],
    languages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
    }],
    description: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
    website: {
      type: String,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    locations: [{
      type: String,
    }],
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

// Add the mongoose-delete plugin for soft delete functionality
insuranceAgentSchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create and export the model
const InsuranceAgent = mongoose.model<IInsuranceAgent>("InsuranceAgent", insuranceAgentSchema);
export default InsuranceAgent;
