import { Request, Response } from 'express';
import InsuranceType, { IInsuranceType } from '../../../models/masterdata/InsuranceType.model';

// Get all insurance types
export const getAllInsuranceTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query based on name
    const searchQuery = {
      deleted: false,
      name: { $regex: search, $options: 'i' }, // case-insensitive search for insurance type name
    };

    // Fetch insurance types with pagination
    const insuranceTypes = await InsuranceType.find(searchQuery)
      .select('name status')
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const totalInsuranceTypes = await InsuranceType.countDocuments(searchQuery);

    res.status(200).json({
      insuranceTypes,
      totalPages: Math.ceil(totalInsuranceTypes / pageSize),
      currentPage: pageNumber,
      totalInsuranceTypes,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get insurance type by ID
export const getInsuranceTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Fetch insurance type by ID
    const insuranceType = await InsuranceType.findById(id).select('name status');

    if (!insuranceType) {
      res.status(404).json({ message: 'Insurance type not found', status: 404 });
      return;
    }

    res.status(200).json({ insuranceType });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Create a new insurance type
export const createInsuranceType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status } = req.body;

    // Validate input
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Create the insurance type
    const newInsuranceType = new InsuranceType({
      name,
      status: status || 'ACTIVE', // Default status is 'ACTIVE' if not provided
    });

    // Save the new insurance type to the database
    const savedInsuranceType = await newInsuranceType.save();

    res.status(201).json({ insuranceType: savedInsuranceType });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update an insurance type
export const updateInsuranceType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Update the insurance type based on the request body
    const updatedInsuranceType = await InsuranceType.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedInsuranceType) {
      res.status(404).json({ error: 'Insurance type not found' });
      return;
    }

    res.status(200).json({ insuranceType: updatedInsuranceType });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete (soft delete) an insurance type
export const deleteInsuranceType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Soft delete the insurance type
    const deletedInsuranceType = await InsuranceType.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedInsuranceType) {
      res.status(404).json({ error: 'Insurance type not found' });
      return;
    }

    res.status(200).json({ message: 'Insurance type deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
