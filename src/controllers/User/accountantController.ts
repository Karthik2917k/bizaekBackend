import { Request, Response } from 'express';
import Accountants, { IAccountants } from '../../models/accountants.model';

// Define the structure of req.user with user containing _id
interface UserI {
  _id?: string;
}



//Public Controllers

export const getAllAccountantsPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract filters from query parameters
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

    // Fetch accountants based on the filter and apply pagination
    const accountants = await Accountants.find(filter)
      .select('profilePic lastName firstName userId status city state country languages company')
      .skip(skip)
      .limit(pageSize);

    // Fetch total count for pagination purposes
    const totalAccountants = await Accountants.countDocuments(filter);

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

//User Controllers

export const getAccountantProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }
    const accountant = await Accountants.findOne({ userId: userInfo._id });

    if (!accountant) {
      res.status(404).json({ error: 'Accountant not found' });
      return;
    }

    res.status(200).json({ accountant });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};



export const createAccountant = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const existUser = await Accountants.findOne({ userId: userInfo._id })
    if (existUser) {
      res.status(403).json({ status: 403, error: 'Duplicate User: Already a user' });
      return;

    }

    // Create new accountant with userId from userInfo
    const newAccountant = new Accountants({ ...req.body, userId: userInfo._id });
    const savedAccountant = await newAccountant.save();

    // Respond with the saved accountant
    res.status(201).json({ accountant: savedAccountant });
  } catch (err) {
    // Handle and respond with the error message
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const updateAccountant = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const updatedAccountant = await Accountants.findByIdAndUpdate(
      userInfo._id,
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
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const updatedAccountant = await Accountants.findByIdAndUpdate(
      userInfo._id,
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
