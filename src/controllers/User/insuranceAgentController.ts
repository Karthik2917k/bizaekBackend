import { Request, Response } from 'express';
import InsuranceAgents  from '../../models/agent.model';
import mongoose from 'mongoose';

// Define the structure of req.user with user containing _id
interface UserI {
  _id?: string;
}

// Public Controllers

export const getAllInsuranceAgentsPublic = async (req: Request, res: Response): Promise<void> => {
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

    // Types filter (expecting an array of ObjectIds)
    if (types) {
      const typesArray = (types as string).split(',').map(type => new mongoose.Types.ObjectId(type.trim()));
      filter.types = { $in: typesArray };
    }

    // Fetch insurance agents based on the filter and apply pagination
    const insuranceAgents = await InsuranceAgents.find(filter)
      .select('profilePic lastName firstName userId status city state country languages company')
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: 'userId',
        match: { status: 'ACTIVE' }, // Only populate agents whose userId's status is ACTIVE
        select: '_id status', // Selecting only _id and status fields from User model
      })
      .populate('typesOfInsurance', 'name')
      .populate('languages', 'name')     
      .populate('state', 'name')
      .populate('city', 'name longitude latitude')
      .populate('country', 'name');

    // Fetch total count for pagination purposes
    const totalAgents = await InsuranceAgents.countDocuments(filter);

    res.status(200).json({
      insuranceAgents,
      totalPages: Math.ceil(totalAgents / pageSize),
      currentPage: pageNumber,
      totalAgents,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const getInsuranceAgentById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ID from request parameters
    const { id } = req.query;

    // Fetch insurance agent by ID
    const agent = await InsuranceAgents.findById(id).populate('languages', 'name')
    .populate('typesOfInsurance', 'name')
      .populate('languages', 'name')     
      .populate('state', 'name')
      .populate('city', 'name longitude latitude')
      .populate('country', 'name');

    if (!agent) {
      res.status(404).json({ message: 'Insurance agent not found', status: 404 });
      return;
    }

    res.status(200).json({ agent });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// User Controllers

export const getInsuranceAgentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const agent = await InsuranceAgents.findOne({ userId: userInfo._id }).populate('languages', 'name')
      .populate('typesOfInsurance', 'name')
      .populate('languages', 'name')     
      .populate('state', 'name')
      .populate('city', 'name longitude latitude')
      .populate('country', 'name');

    if (!agent) {
      res.status(404).json({ error: 'Insurance agent not found' });
      return;
    }

    res.status(200).json({ agent });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const createInsuranceAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const existUser = await InsuranceAgents.findOne({ userId: userInfo._id });
    if (existUser) {
      res.status(403).json({ status: 403, error: 'Duplicate User: Already a user' });
      return;
    }

    // Create new insurance agent with userId from userInfo
    const newAgent = new InsuranceAgents({ ...req.body, userId: userInfo._id });
    const savedAgent = await newAgent.save();

    // Respond with the saved insurance agent
    res.status(201).json({ agent: savedAgent });
  } catch (err) {
    // Handle and respond with the error message
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const updateInsuranceAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from req.user
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const updatedAgent = await InsuranceAgents.findOneAndUpdate(
      { userId: userInfo._id },
      { ...req.body },
      { new: true }
    );

    if (!updatedAgent) {
      res.status(404).json({ error: 'Insurance agent not found' });
      return;
    }

    res.status(200).json({ agent: updatedAgent });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const deleteInsuranceAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfo: UserI | undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const updatedAgent = await InsuranceAgents.findOneAndUpdate(
      { userId: userInfo._id },
      { deleted: true },
      { new: true }
    );

    if (!updatedAgent) {
      res.status(404).json({ error: 'Insurance agent not found' });
      return;
    }

    res.status(200).json({ message: 'Insurance agent deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
