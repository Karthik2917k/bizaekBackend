import { Request, Response } from "express";
import Country, { ICountry } from "../../../src/models/country.model";
import State, { IState } from "../../../src/models/state.model";
import City, { ICity } from "../../../src/models/city.model";
import { AnyLengthString } from "aws-sdk/clients/comprehendmedical";

// Get all countries
export const getAllCountries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const countries = await Country.find({ deleted: false }).select("name id");

    res.status(200).json({ countries });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error });
  }
};

// Get states by country ID
export const getStatesByCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { countryId } = req.params; // Expecting countryId as a route parameter
    console.log("countryId:", countryId);

    const states = await State.find({
      countryId: countryId,
      deleted: false,
    }).select("name id");

    if (states.length === 0) {
      res
        .status(404)
        .json({ message: "No states found for this country", status: 404 });
      return;
    }

    res.status(200).json({ states });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error });
  }
};

// Get cities by state ID
export const getCitiesByState = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { stateId } = req.params; // Expecting stateId as a route parameter

    const cities = await City.find({ stateId: stateId, deleted: false }).select(
      "name id"
    );

    if (cities.length === 0) {
      res
        .status(404)
        .json({ message: "No cities found for this state", status: 404 });
      return;
    }

    res.status(200).json({ cities });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error });
  }
};

export const createCountry = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = req.body;
    await Country.create(body);
    return res.json({ ok: true, message: "Country created successfully" });
  } catch (error: any) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const createState = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = req.body;
    await State.create(body);
    return res.json({ ok: true, message: "State created successfully" });
  } catch (error: any) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const createCity = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = req.body;
    await City.create(body);
    return res.json({ ok: true, message: "City created successfully" });
  } catch (error: any) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};
