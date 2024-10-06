import { Request, Response } from 'express';
import Accountants, { IAccountants } from '../../models/accountants.model';

export const getAllAccountants = async (req: Request, res: Response): Promise<void> => {
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
        { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: search, options: 'i' } } }
      ],
    };

    // Fetch accountants based on the search query and apply pagination
    const accountants = await Accountants.find(searchQuery)
      .select('profilePic lastName firstName userId status createdAt type')
      .skip(skip)
      .limit(pageSize)
      .populate('types', 'name')
     

    // Fetch total count for pagination purposes
    const totalAccountants = await Accountants.countDocuments(searchQuery);

    res.status(200).json({
      accountants,
      totalPages: Math.ceil(totalAccountants / pageSize),
      currentPage: pageNumber,
      totalAccountants,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const getAccountantById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ID from request parameters
    const { id } = req.query;

    // Fetch accountant by ID
    const accountant = await Accountants.findById(id).select('profilePic lastName firstName userId status');

    if (!accountant) {
      res.status(404).json({ message: 'Accountant not found', status: 404 });
      return;
    }

    res.status(200).json({ accountant });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};


export const updateAccountant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedAccountant = await Accountants.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedAccountant) {
      res.status(404).json({ error: 'Accountant not found' });
      return;
    }

    res.status(200).json({ accountant: updatedAccountant });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};


export const deleteAccountant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedAccountant = await Accountants.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!updatedAccountant) {
      res.status(404).json({ error: 'Accountant not found' });
      return;
    }

    res.status(200).json({ message: 'Accountant deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};