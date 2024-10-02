import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
export interface IState extends Document {
  id: number;
  name: string;
  countryId:mongoose.Schema.Types.ObjectId;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const stateSchema = new Schema<IState>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "countries",
      required: true,
    },
    country_code: {
      type: String,
      required: true,
    },
    country_name: {
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
