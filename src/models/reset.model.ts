import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
interface IResetPassword extends Document {
  email: string;
  name: string;
  password: string;
  otp?: number;
  expirationTime?: number;
  reason: "Reset" | "Login" | "Update" | "Register";
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const resetPasswordSchema = new Schema<IResetPassword>(
  {
    email: {
      type: String,
      index: true,
      required: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    otp: {
      type: Number,
    },
    expirationTime: {
      type: Number,
      default: 0
    },
    reason: {
      type: String,
      enum: ["Reset", "Login", "Update", "Register"],
      index: true,
    },
  },
  { timestamps: true }
);

// Apply the mongoose-delete plugin
resetPasswordSchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const ResetPassword = mongoose.model<IResetPassword>("resetPassword", resetPasswordSchema);

export default ResetPassword;
