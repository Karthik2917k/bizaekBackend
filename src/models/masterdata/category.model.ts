import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
export interface ICategory extends Document {
  name: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const categorySchema = new Schema<ICategory>(
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
categorySchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
