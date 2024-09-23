import { Request, Response } from 'express';
import Realtors, { IRealtors } from '../../models/realtors.model';

// Define the structure of req.user with user containing _id
interface UserI {
  _id?: string;
}

export const getAllRealtorsPublic = async (req: Request, res: Response): Promise<void> => {
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
    const realtors = await Realtors.find(filter)
    .select('profilePic lastName firstName userId status city state country languages company')
    .skip(skip)
    .limit(pageSize);

  // Fetch total count for pagination purposes
  const totalRealtors = await Realtors.countDocuments(filter);

  res.status(200).json({
    realtors,
    totalPages: Math.ceil(totalRealtors / pageSize),
    currentPage: pageNumber,
    totalRealtors,
  });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};

export const getRealtorById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ID from request parameters
    const { id } = req.query;

    // Fetch realtor by ID
    const realtor = await Realtors.findById(id);

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



export const getRealtorProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ status: 401, message: 'Unauthorized: User not authenticated' });
      return;
    }
    const realtor = await Realtors.findOne({ userId: userInfo._id });

    if (!realtor) {
      res.status(404).json({ status: 404, message: 'Realtor not found' });
      return;
    }

    res.status(200).json({ status: 200, message: 'Realtor profile retrieved successfully', realtor });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};

export const createRealtor = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ status: 401, message: 'Unauthorized: User not authenticated' });
      return;
    }

    const existUser = await Realtors.findOne({ userId: userInfo._id });
    if (existUser) {
      res.status(403).json({ status: 403, message: 'Duplicate User: Already a realtor' });
      return;
    }

    // Create new realtor with userId from userInfo
    const newRealtor = new Realtors({ ...req.body, userId: userInfo._id });
    const savedRealtor = await newRealtor.save();

    res.status(201).json({ status: 201, message: 'Realtor created successfully', realtor: savedRealtor });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};

export const updateRealtor = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const updatedRealtor = await Realtors.findOneAndUpdate(
      {userId:userInfo._id},
      { ...req.body },
      { new: true }
    );

    if (!updatedRealtor) {
      res.status(404).json({ status: 404, message: 'Realtor not found' });
      return;
    }

    res.status(200).json({ status: 200, message: 'Realtor updated successfully', realtor: updatedRealtor });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};

export const deleteRealtor = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const updatedRealtor = await Realtors.findOneAndUpdate(
      {userId:userInfo._id},
      { deleted: true },
      { new: true }
    );

    if (!updatedRealtor) {
      res.status(404).json({ status: 404, message: 'Realtor not found' });
      return;
    }

    res.status(200).json({ status: 200, message: 'Realtor deleted successfully' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
  }
};
