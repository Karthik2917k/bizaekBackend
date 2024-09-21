import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the Expertise schema
export interface IExpertise extends Document {
  name: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const expertiseSchema = new Schema<IExpertise>(
  {
    name: {
      type: String,
      required: true,
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
expertiseSchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const Expertise = mongoose.model<IExpertise>("Expertise", expertiseSchema);

export default Expertise;
