import { Request, Response } from 'express';
import Culture, { ICulture } from '../../../models/masterdata/culture.model';

// Get all cultures
export const getAllCultures = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query based on code and name
    const searchQuery = {
      deleted: false,
      $or: [
        { code: { $regex: search, $options: 'i' } }, // case-insensitive search for culture code
        { name: { $regex: search, $options: 'i' } }, // case-insensitive search for culture name
      ],
    };

    // Fetch cultures with pagination
    const cultures = await Culture.find(searchQuery)
      .select('code name image status')
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const totalCultures = await Culture.countDocuments(searchQuery);

    res.status(200).json({
      cultures,
      totalPages: Math.ceil(totalCultures / pageSize),
      currentPage: pageNumber,
      totalCultures,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get culture by ID
export const getCultureById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Fetch culture by ID
    const culture = await Culture.findById(id).select('code name image status');

    if (!culture) {
      res.status(404).json({ message: 'Culture not found', status: 404 });
      return;
    }

    res.status(200).json({ culture });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Create a new culture
export const createCulture = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, image, status } = req.body;

    // Validate input
    if (!code || !name) {
      res.status(400).json({ error: 'Code and Name are required' });
      return;
    }

    // Create the culture
    const newCulture = new Culture({
      code,
      name,
      image,
      status: status || 'ACTIVE', // Default status is 'ACTIVE' if not provided
    });

    // Save the new culture to the database
    const savedCulture = await newCulture.save();

    res.status(201).json({ culture: savedCulture });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update a culture
export const updateCulture = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Update the culture based on the request body
    const updatedCulture = await Culture.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedCulture) {
      res.status(404).json({ error: 'Culture not found' });
      return;
    }

    res.status(200).json({ culture: updatedCulture });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete (soft delete) a culture
export const deleteCulture = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Soft delete the culture
    const deletedCulture = await Culture.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedCulture) {
      res.status(404).json({ error: 'Culture not found' });
      return;
    }

    res.status(200).json({ message: 'Culture deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
