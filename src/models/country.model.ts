import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
export interface ICountry extends Document {
  name: string;
  iso3: string;
  iso2: string;
  numericCode: number;
  phoneCode: number;
  capital: string;
  currency: string;
  currencyName: string;
  region: string;
  regionId: number;
  subregion: string;
  subregionId: number;
  nationality: string;
  timezones: string; // You might want to adjust this type based on your usage
  latitude: number;
  longitude: number;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// Define the schema
const countrySchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: true,
    },
    iso3: {
      type: String,
      required: true,
    },
    iso2: {
      type: String,
      required: true,
    },
    numericCode: {
      type: Number,
      required: true,
    },
    phoneCode: {
      type: Number,
      required: true,
    },
    capital: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    currencyName: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    regionId: {
      type: Number,
      required: true,
    },
    subregion: {
      type: String,
      required: true,
    },
    subregionId: {
      type: Number,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    timezones: {
      type: String, // Consider using a more structured type if needed
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
  { timestamps: true, versionKey: false }
);

// Apply the mongoose-delete plugin
countrySchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const Country = mongoose.model<ICountry>("Country", countrySchema);

export default Country;
