import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
export interface ICity extends Document {
  name: string;
  stateId: mongoose.Schema.Types.ObjectId;
  stateName: string;
  countryId: mongoose.Schema.Types.ObjectId;
  countryCode: string;
  countryName: string;
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
    name: {
      type: String,
      required: true,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "states",
      required: true,
    },
    stateName: {
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
    wikiDataId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Apply the mongoose-delete plugin
citySchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const City = mongoose.model<ICity>("City", citySchema);

export default City;
