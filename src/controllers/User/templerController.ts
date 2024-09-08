import { Request, Response } from 'express';
import Templers, { ITemplers } from '../../models/templers.model';

// Define an interface to extend the Request object
interface ITemplerRequest extends Request {
  user: { _id: string }; // Assuming req.user has _id as a string
}

export default {
  // Get all templers
  getAllTemplers: async (req: ITemplerRequest, res: Response): Promise<void> => {
    try {
      const { agent, type, languages, location } = req.query;
      const templers = await Templers.find({ deleted: false });

      res.status(200).json({ status: 200, message: 'Templers retrieved successfully', templers });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ status: 400, error });
    }
  },

  // Get a templer by ID
  getTempler: async (req: ITemplerRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const templer = await Templers.findById(id);

      if (!templer) {
        res.status(404).json({ status: 404, message: 'Templer not found' });
        return;
      }

      res.status(200).json({ status: 200, message: 'Templer retrieved successfully', templer });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ status: 400, error });
    }
  },

  // Create a new templer
  createTempler: async (req: Request, res: Response): Promise<void> => {
    try {
      const newTempler = new Templers(req.body);
      const savedTempler = await newTempler.save();
      res.status(201).json({ status: 201, message: 'Templer created successfully', templer: savedTempler });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ status: 400, error });
    }
  },

  // Update a templer by ID
  updateTempler: async (req: ITemplerRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.query;

      const updatedTempler = await Templers.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );

      if (!updatedTempler) {
        res.status(404).json({ status: 404, message: 'Templer not found' });
        return;
      }

      res.status(200).json({ status: 200, message: 'Templer updated successfully', templer: updatedTempler });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ status: 400, error });
    }
  },

  // Delete (soft delete) a templer by ID
  deleteTempler: async (req: ITemplerRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.query;

      const updatedTempler = await Templers.findByIdAndUpdate(
        id,
        { deleted: true },
        { new: true }
      );

      if (!updatedTempler) {
        res.status(404).json({ status: 404, message: 'Templer not found' });
        return;
      }

      res.status(200).json({ status: 200, message: 'Templer deleted successfully' });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ status: 400, error });
    }
  },
};
