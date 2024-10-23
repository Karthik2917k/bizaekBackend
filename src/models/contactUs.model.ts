import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the contact schema document
export interface IContact extends Document {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  stateOrRegion?: string;
  phoneNumber?: string;
  serviceType?: string;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const contactSchema = new Schema<IContact>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
    },
    stateOrRegion: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    serviceType: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Apply the mongoose-delete plugin
contactSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const Contact = mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
