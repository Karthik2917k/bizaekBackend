import mongoose, { Document, Schema } from "mongoose";
import mongoose_delete from "mongoose-delete";

// Define an interface for the schema document
export interface ICountry extends Document {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: number;
  phone_code: number;
  capital: string;
  currency: string;
  currency_name: string;
  region: string;
  region_id: number;
  subregion: string;
  subregion_id: number;
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
    id: {
      type: Number,
      required: true,
      unique: true,
    },
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
    numeric_code: {
      type: Number,
      required: true,
    },
    phone_code: {
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
    currency_name: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    region_id: {
      type: Number,
      required: true,
    },
    subregion: {
      type: String,
      required: true,
    },
    subregion_id: {
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
  { timestamps: true }
);

// Apply the mongoose-delete plugin
countrySchema.plugin(mongoose_delete, {
  overrideMethods: ["find", "findOne", "findOneAndUpdate", "update"],
});

// Create the model
const Country = mongoose.model<ICountry>("Country", countrySchema);

export default Country;
