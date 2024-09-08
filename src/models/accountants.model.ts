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
  languages?: string[];
  cultures?: string[];
  expertise?: string[];
  clients?: { name: string; link?: string; image?: string }[];
  officeAddress?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

// Define the schema
const userSchema: Schema<IAccountants> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
      unique:true
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
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
    languages: [
      {
        type: String,
      },
    ],
    cultures: [
      {
        type: String,
      },
    ],
    expertise: [
      {
        type: String,
      },
    ],
    clients: [
      {
        name: {
          type: String,
        },
        link: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
    officeAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    zip: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
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
