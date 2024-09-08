import { Request, Response } from 'express';
import Realtors, { IRealtors } from '../../models/realtors.model';

// Define the structure of req.user with user containing _id
interface UserI {
  _id?: string;
}

export const getAllRealtors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agent, type, languages, location } = req.query;
    const realtors = await Realtors.find({ deleted: false });

    res.status(200).json({ status: 200, message: 'Realtors retrieved successfully', realtors });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
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
    const { id } = req.params;

    const updatedRealtor = await Realtors.findByIdAndUpdate(
      id,
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
    const { id } = req.params;

    const updatedRealtor = await Realtors.findByIdAndUpdate(
      id,
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
