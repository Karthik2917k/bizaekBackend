import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";
import { isEmail } from "validator";

// Define an interface for the user (accountant) document
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
  languages?: string[];
  cultures?: string[];
  services?: string[];
  licenses?: { name: string; link?: string; image?: string }[];
  officeAddress?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

// Define the schema
const userSchema: Schema<IRealtors> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
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
    membership: {
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
    services: [
      {
        type: String,
      },
    ],
    licenses: [
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
const Realtors = mongoose.model<IRealtors>("Realtors", userSchema);
export default Realtors;
