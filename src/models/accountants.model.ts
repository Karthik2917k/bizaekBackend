import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";
import { isEmail } from "validator";

// Define an interface for the user (accountant) document
export interface IAccountants extends Document {
  userId?: mongoose.Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  countryCode?: number;
  phone?: number;
  email: string;
  company?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  about?: string;
  languages?: mongoose.Schema.Types.ObjectId[]; // Array of language ObjectIds
  cultures?: mongoose.Schema.Types.ObjectId[]; // Array of culture ObjectIds
  expertise?: mongoose.Schema.Types.ObjectId[]; // Array of expertise ObjectIds
  clients?: mongoose.Schema.Types.ObjectId[]; // Array of client ObjectIds
  officeAddress?: string;
  city?: mongoose.Schema.Types.ObjectId; // Reference to city ObjectId
  zip?: string;
  state?: mongoose.Schema.Types.ObjectId; // Reference to state ObjectId
  type?: mongoose.Schema.Types.ObjectId; // Reference to state ObjectId
  country?: mongoose.Schema.Types.ObjectId; // Reference to country ObjectId
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

// Define the schema
const userSchema: Schema<IAccountants> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    profilePic: {
      type: String,
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
    company: {
      type: String,
    },
    website: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
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
    expertise: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expertise",
    }],
    clients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    }],
    officeAddress: {
      type: String,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    zip: {
      type: String,
    },
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountantType",
    }],
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
const Accountants = mongoose.model<IAccountants>("Accountants", userSchema);
export default Accountants;
