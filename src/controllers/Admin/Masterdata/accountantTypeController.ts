import { Request, Response } from 'express';
import AccountantType, { IAccountantType } from '../../../models/masterdata/accountantType.model';

// Get all accountant types
export const getAllAccountantTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query based on name
    const searchQuery = {
      deleted: false,
      name: { $regex: search, $options: 'i' }, // case-insensitive search for accountant type name
    };

    // Fetch accountant types with pagination
    const accountantTypes = await AccountantType.find(searchQuery)
      .select('name status')
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const totalAccountantTypes = await AccountantType.countDocuments(searchQuery);

    res.status(200).json({
      accountantTypes,
      totalPages: Math.ceil(totalAccountantTypes / pageSize),
      currentPage: pageNumber,
      totalAccountantTypes,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get accountant type by ID
export const getAccountantTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Fetch accountant type by ID
    const accountantType = await AccountantType.findById(id).select('name status');

    if (!accountantType) {
      res.status(404).json({ message: 'Accountant type not found', status: 404 });
      return;
    }

    res.status(200).json({ accountantType });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Create a new accountant type
export const createAccountantType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status } = req.body;

    // Validate input
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Create the accountant type
    const newAccountantType = new AccountantType({
      name,
      status: status || 'ACTIVE', // Default status is 'ACTIVE' if not provided
    });

    // Save the new accountant type to the database
    const savedAccountantType = await newAccountantType.save();

    res.status(201).json({ accountantType: savedAccountantType });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update an accountant type
export const updateAccountantType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Update the accountant type based on the request body
    const updatedAccountantType = await AccountantType.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedAccountantType) {
      res.status(404).json({ error: 'Accountant type not found' });
      return;
    }

    res.status(200).json({ accountantType: updatedAccountantType });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete (soft delete) an accountant type
export const deleteAccountantType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Soft delete the accountant type
    const deletedAccountantType = await AccountantType.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedAccountantType) {
      res.status(404).json({ error: 'Accountant type not found' });
      return;
    }

    res.status(200).json({ message: 'Accountant type deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
