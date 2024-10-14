import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the InsuranceType document
export interface IInsuranceType extends Document {
  name: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const insuranceTypeSchema = new Schema<IInsuranceType>(
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

// Apply the mongoose-delete plugin for soft delete functionality
insuranceTypeSchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const InsuranceType = mongoose.model<IInsuranceType>("InsuranceType", insuranceTypeSchema);

export default InsuranceType;
