import { Request, Response } from 'express';
import Templers, { ITemplers } from '../../models/templers.model';

export const getAllTemplers = async (req: Request, res: Response): Promise<void> => {
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
        { institution: { $regex: search, $options: 'i' } }  // case-insensitive search for institution
      ],
    };

    // Fetch templers based on the search query and apply pagination
    const templers = await Templers.find(searchQuery)
      .select('profilePic lastName firstName email institution status')
      .skip(skip)
      .limit(pageSize);

    // Fetch total count for pagination purposes
    const totalTemplers = await Templers.countDocuments(searchQuery);

    res.status(200).json({
      templers,
      totalPages: Math.ceil(totalTemplers / pageSize),
      currentPage: pageNumber,
      totalTemplers,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const getTemplerById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ID from request parameters
    const { id } = req.query;

    // Fetch templer by ID
    const templer = await Templers.findById(id).select('profilePic lastName firstName email institution status');

    if (!templer) {
      res.status(404).json({ message: 'Templer not found', status: 404 });
      return;
    }

    res.status(200).json({ templer });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const updateTempler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedTempler = await Templers.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedTempler) {
      res.status(404).json({ error: 'Templer not found' });
      return;
    }

    res.status(200).json({ templer: updatedTempler });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const deleteTempler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedTempler = await Templers.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!updatedTempler) {
      res.status(404).json({ error: 'Templer not found' });
      return;
    }

    res.status(200).json({ message: 'Templer deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
