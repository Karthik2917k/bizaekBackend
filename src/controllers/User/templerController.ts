import { Request, Response } from 'express';
import Templers from '../../models/templers.model';

// Define the structure of req.user with user containing _id
interface UserI {
  _id?: string;
}

export const getAllTemplersPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name = '', languages = '', location = '', page = '1', limit = '10' } = req.query;

    // Convert query parameters to their appropriate types
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Create filter object
    const filter: any = {
      deleted: false,
      status: "ACTIVE",
    };

    // Name filter (combined first and last names)
    if (name) {
      filter.$or = [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } },
        { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: name, options: 'i' } } }
      ];
    }

    // Location filter (regex-based)
    if (typeof location === 'string' && location) {
      const locationRegex = new RegExp(location, 'i'); // Case-insensitive regex
      filter.$or = [
        { state: { $regex: locationRegex } },
        { city: { $regex: locationRegex } },
        { country: { $regex: locationRegex } }
      ];
    }

    // Languages filter (multiple languages)
    if (languages) {
      const languageArray = (languages as string).split(',').map(lang => lang.trim());
      filter.languages = { $in: languageArray };
    }
    const templers = await Templers.find(filter)
      .select('profilePic lastName firstName userId status city state country languages company')
      .skip(skip)
      .limit(pageSize);

    // Fetch total count for pagination purposes
    const totalTemplers = await Templers.countDocuments(filter);

    res.status(200).json({
      templers,
      totalPages: Math.ceil(totalTemplers / pageSize),
      currentPage: pageNumber,
      totalTemplers,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};

export const getTemplerById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ID from request parameters
    const { id } = req.query;

    // Fetch templer by ID
    const templer = await Templers.findById(id);

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


export const getTemplerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo?._id) {
      res.status(401).json({ status: 401, message: 'Unauthorized: User not authenticated' });
      return;
    }

    const templer = await Templers.findOne({ userId: userInfo._id });

    if (!templer) {
      res.status(404).json({ status: 404, message: 'Templer not found' });
      return;
    }

    res.status(200).json({ status: 200, message: 'Templer profile retrieved successfully', templer });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};

export const createTempler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo?._id) {
      res.status(401).json({ status: 401, message: 'Unauthorized: User not authenticated' });
      return;
    }

    // Create new templer with userId from userInfo
    const newTempler = new Templers({ ...req.body, userId: userInfo._id });
    const savedTempler = await newTempler.save();

    res.status(201).json({ status: 201, message: 'Templer created successfully', templer: savedTempler });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};

export const updateTempler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const updatedTempler = await Templers.findOneAndUpdate(
      { userId: userInfo._id }, { ...req.body }, { new: true });

    if (!updatedTempler) {
      res.status(404).json({ status: 404, message: 'Templer not found' });
      return;
    }

    res.status(200).json({ status: 200, message: 'Templer updated successfully', templer: updatedTempler });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};

export const deleteTempler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const updatedTempler = await Templers.findOneAndUpdate(
      {userId:userInfo._id}, { deleted: true }, { new: true });

    if (!updatedTempler) {
      res.status(404).json({ status: 404, message: 'Templer not found' });
      return;
    }

    res.status(200).json({ status: 200, message: 'Templer deleted successfully' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};
