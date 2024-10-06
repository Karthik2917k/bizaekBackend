import { Request, Response } from 'express';
import Accountants, { IAccountants } from '../../models/accountants.model';
import mongoose from 'mongoose';

// Define the structure of req.user with user containing _id
interface UserI {
  _id?: string;
}



//Public Controllers

export const getAllAccountantsPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract filters from query parameters
    const { name = '', languages = '', location = '', types = '', page = '1', limit = '10' } = req.query;

    // Convert query parameters to their appropriate types
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Create filter object
    const filter: any = {
      deleted: false,
      status: "ACTIVE",
    };

 

    if (location) {
      filter.$or = [
        { 'city.name': { $regex: location, $options: 'i' } },
        { 'state.name': { $regex: location, $options: 'i' } },
        { 'country.name': { $regex: location, $options: 'i' } },
      ];
    }

    // Name filter (combined first and last names)
    if (name) {
      filter.$or = [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } },
        { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: name, options: 'i' } } }
      ];
    }

    // Languages filter (expecting an array of ObjectIds)
    if (languages) {
      const languageArray = (languages as string).split(',').map(lang => new mongoose.Types.ObjectId(lang.trim()));
      filter.languages = { $in: languageArray };
    }



    // Clients filter (expecting an array of ObjectIds)
    if (types) {
      const typesArray = (types as string).split(',').map(type => new mongoose.Types.ObjectId(type.trim()));
      filter.types = { $in: typesArray };
    }

    // Fetch accountants based on the filter and apply pagination
    const accountants = await Accountants.find(filter)
      .select('profilePic lastName firstName userId status city state country languages company')
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: 'userId',
        match: { status: 'ACTIVE' }, // Only populate accountants whose userId's status is ACTIVE
        select: '_id status', // Selecting only _id and status fields from User model
      })
      .populate('languages', 'name')
      .populate('cultures', 'name')
      .populate('expertise', 'name')
      .populate('clients', 'name')
      .populate('state', 'name')
      .populate('city', 'name longitude latitude')
      .populate('country', 'name');

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

export const getAccountantById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ID from request parameters
    const { id } = req.query;

    // Fetch accountant by ID
    const accountant = await Accountants.findById(id).populate('languages', 'name')
      .populate('cultures', 'name')
      .populate('expertise', 'name')
      .populate('clients', 'name')
      .populate('state', 'name')
      .populate('city', 'name longitude latitude')
      .populate('country', 'name');;

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
    const accountant = await Accountants.findOne({ userId: userInfo._id }).populate('languages', 'name')
      .populate('cultures', 'name')
      .populate('types', 'name')
      .populate('expertise', 'name')
      .populate('clients', 'name')
      .populate('state', 'name')
      .populate('city', 'name longitude latitude')
      .populate('country', 'name');;

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

    const updatedAccountant = await Accountants.findOneAndUpdate(
      { userId: userInfo._id },
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

    const updatedAccountant = await Accountants.findOneAndUpdate(
      { userId: userInfo._id },
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
