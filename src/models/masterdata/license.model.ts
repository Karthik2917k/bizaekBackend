import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the licenses schema document
export interface ILicense extends Document {
  name: string;
  link?: string; // Optional link to more information about the license
  image?: string; // Optional image URL related to the license
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const licenseSchema = new Schema<ILicense>(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// Apply the mongoose-delete plugin
licenseSchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const License = mongoose.model<ILicense>("License", licenseSchema);

export default License;
