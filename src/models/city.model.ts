import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
export interface ICity extends Document {
  id: number;
  name: string;
  stateId: mongoose.Schema.Types.ObjectId;
  state_name: string;
  countryId: mongoose.Schema.Types.ObjectId;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  wikiDataId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const citySchema = new Schema<ICity>(
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
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "states",
      required: true,
    },
    state_name: {
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
    wikiDataId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Apply the mongoose-delete plugin
citySchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const City = mongoose.model<ICity>("City", citySchema);

export default City;
