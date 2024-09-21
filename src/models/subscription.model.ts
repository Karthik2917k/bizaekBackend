import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the subscription schema document
export interface ISubscription extends Document {
  title: string;
  price: string;
  description: string;
  priority: number;
  feature: string[];
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const subscriptionSchema = new Schema<ISubscription>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    feature: {
      type: [String], // Array of strings for features
      default: [],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Apply the mongoose-delete plugin
subscriptionSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);

export default Subscription;
