import { Request, Response } from 'express';
import License, { ILicense } from '../../../models/masterdata/license.model';

// Get all licenses
export const getAllLicenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query based on name
    const searchQuery = {
      deleted: false,
      name: { $regex: search, $options: 'i' }, // case-insensitive search for license name
    };

    // Fetch licenses with pagination
    const licenses = await License.find(searchQuery)
      .select('name link image status')
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const totalLicenses = await License.countDocuments(searchQuery);

    res.status(200).json({
      licenses,
      totalPages: Math.ceil(totalLicenses / pageSize),
      currentPage: pageNumber,
      totalLicenses,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get license by ID
export const getLicenseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Fetch license by ID
    const license = await License.findById(id).select('name link image status');

    if (!license) {
      res.status(404).json({ message: 'License not found', status: 404 });
      return;
    }

    res.status(200).json({ license });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Create a new license
export const createLicenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const  licenses  = req.body; // Expecting an array of license objects

    // Validate input
    if (!Array.isArray(licenses) || licenses.length === 0) {
      res.status(400).json({ error: 'An array of licenses is required' });
      return;
    }

    // Map the incoming array to only include the name field
    const newLicenses = licenses.map(license => ({
      name: license.name,
    }));

    // Insert the new licenses into the database
    const savedLicenses = await License.insertMany(newLicenses);

    res.status(201).json({ licenses: savedLicenses });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};


// Update a license
export const updateLicense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Update the license based on the request body
    const updatedLicense = await License.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedLicense) {
      res.status(404).json({ error: 'License not found' });
      return;
    }

    res.status(200).json({ license: updatedLicense });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete (soft delete) a license
export const deleteLicense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Soft delete the license
    const deletedLicense = await License.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedLicense) {
      res.status(404).json({ error: 'License not found' });
      return;
    }

    res.status(200).json({ message: 'License deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
