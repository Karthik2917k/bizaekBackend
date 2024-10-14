import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
interface IContactInquiry extends Document {
  profileId: mongoose.Schema.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  description: string;
  typeOfInquiry: string;
  preferredTiming: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const contactInquirySchema = new Schema<IContactInquiry>(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    email: {
      type: String,
      index: true,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    description: {
      type: String,
    },
    typeOfInquiry: {
      type: String,
    },
    preferredTiming: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// Apply the mongoose-delete plugin for soft delete functionality
contactInquirySchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const ContactInquiry = mongoose.model<IContactInquiry>("ContactInquiry", contactInquirySchema);

export default ContactInquiry;
