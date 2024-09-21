import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
export interface ICulture extends Document {
  code: string;
  name: string;
  image?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const cultureSchema = new Schema<ICulture>(
  {
    code: {
      type: String,
      index: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
 
    image: {
      type: String,
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
cultureSchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const Culture = mongoose.model<ICulture>("Culture", cultureSchema);

export default Culture;
