import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the transaction schema document
export interface ITransaction extends Document {
  userId?: mongoose.Schema.Types.ObjectId;
  transaction_id: string;
  amount: number;
  currency: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false
    },
    transaction_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// Apply the mongoose-delete plugin
transactionSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
