import { Request, Response } from 'express';
import Templers from '../../models/templers.model';

// Define the structure of req.user with user containing _id
interface UserI {
  _id?: string;
}

export const getAllTemplers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agent, type, languages, location } = req.query;
    const templers = await Templers.find({ deleted: false });

    res.status(200).json({ status: 200, message: 'Templers retrieved successfully', templers });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ status: 400, error });
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
    const { id } = req.params;

    const updatedTempler = await Templers.findByIdAndUpdate(id, { ...req.body }, { new: true });

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
    const { id } = req.params;

    const updatedTempler = await Templers.findByIdAndUpdate(id, { deleted: true }, { new: true });

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
