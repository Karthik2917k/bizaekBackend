import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the Clients schema
export interface IClient extends Document {
  name: string;
  link?: string;
  image?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: true,
    },

    link: {
      type: String,
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
clientSchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const Client = mongoose.model<IClient>("Client", clientSchema);

export default Client;
