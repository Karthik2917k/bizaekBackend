import { Request, Response } from 'express';
import Expertise, { IExpertise } from '../../../models/masterdata/expertise';

// Get all expertise
export const getAllExpertise = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query based on name
    const searchQuery = {
      deleted: false,
      name: { $regex: search, $options: 'i' }, // case-insensitive search for expertise name
    };

    // Fetch expertise with pagination
    const expertise = await Expertise.find(searchQuery)
      .select('name status')
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const totalExpertise = await Expertise.countDocuments(searchQuery);

    res.status(200).json({
      expertise,
      totalPages: Math.ceil(totalExpertise / pageSize),
      currentPage: pageNumber,
      totalExpertise,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get expertise by ID
export const getExpertiseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Fetch expertise by ID
    const expertise = await Expertise.findById(id).select('name status');

    if (!expertise) {
      res.status(404).json({ message: 'Expertise not found', status: 404 });
      return;
    }

    res.status(200).json({ expertise });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Create a new expertise
export const createExpertise = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status } = req.body;

    // Validate input
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Create the expertise
    const newExpertise = new Expertise({
      name,
      status: status || 'ACTIVE', // Default status is 'ACTIVE' if not provided
    });

    // Save the new expertise to the database
    const savedExpertise = await newExpertise.save();

    res.status(201).json({ expertise: savedExpertise });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update an expertise
export const updateExpertise = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Update the expertise based on the request body
    const updatedExpertise = await Expertise.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedExpertise) {
      res.status(404).json({ error: 'Expertise not found' });
      return;
    }

    res.status(200).json({ expertise: updatedExpertise });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete (soft delete) an expertise
export const deleteExpertise = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Soft delete the expertise
    const deletedExpertise = await Expertise.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedExpertise) {
      res.status(404).json({ error: 'Expertise not found' });
      return;
    }

    res.status(200).json({ message: 'Expertise deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
