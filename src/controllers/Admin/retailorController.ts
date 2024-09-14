import { Request, Response } from 'express';
import Realtors, { IRealtors } from '../../models/realtors.model';

export const getAllRealtors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query - combining first and last name
    const searchQuery = {
      deleted: false,
      $or: [
        { firstName: { $regex: search, $options: 'i' } }, // case-insensitive search for first name
        { lastName: { $regex: search, $options: 'i' } },  // case-insensitive search for last name
        { email: { $regex: search, $options: 'i' } },      // case-insensitive search for email
        { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: search, options: 'i' } } }
      ],
    };

    // Fetch realtors based on the search query and apply pagination
    const realtors = await Realtors.find(searchQuery)
      .select('profilePic lastName firstName email status')
      .skip(skip)
      .limit(pageSize);

    // Fetch total count for pagination purposes
    const totalRealtors = await Realtors.countDocuments(searchQuery);

    res.status(200).json({
      realtors,
      totalPages: Math.ceil(totalRealtors / pageSize),
      currentPage: pageNumber,
      totalRealtors,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const getRealtorById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ID from request parameters
    const { id } = req.query;

    // Fetch realtor by ID
    const realtor = await Realtors.findById(id).select('profilePic lastName firstName email status');

    if (!realtor) {
      res.status(404).json({ message: 'Realtor not found', status: 404 });
      return;
    }

    res.status(200).json({ realtor });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const updateRealtor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedRealtor = await Realtors.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedRealtor) {
      res.status(404).json({ error: 'Realtor not found' });
      return;
    }

    res.status(200).json({ realtor: updatedRealtor });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const deleteRealtor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedRealtor = await Realtors.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!updatedRealtor) {
      res.status(404).json({ error: 'Realtor not found' });
      return;
    }

    res.status(200).json({ message: 'Realtor deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
