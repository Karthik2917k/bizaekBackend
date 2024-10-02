import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
export interface IState extends Document {
  name: string;
  countryId:mongoose.Schema.Types.ObjectId;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const stateSchema = new Schema<IState>(
  {
    name: {
      type: String,
      required: true,
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "countries",
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    countryName: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    deleted: {
      type: Boolean,
      required: true,
      default:false
    },
  },
  { timestamps: true }
);

// Apply the mongoose-delete plugin
stateSchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const State = mongoose.model<IState>("State", stateSchema);

export default State;
