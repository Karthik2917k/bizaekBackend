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

      res.status(200).json({ templers });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },

  // Get a templer by ID
  getTempler: async (req: ITemplerRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const templer = await Templers.findById(id);

      if (!templer) {
        res.status(404).json({ error: 'Templer not found' });
        return;
      }

      res.status(200).json({ templer });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },

  // Create a new templer
  createTempler: async (req: Request, res: Response): Promise<void> => {
    try {
      const newTempler = new Templers(req.body);
      const savedTempler = await newTempler.save();
      res.status(201).json({ templer: savedTempler });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
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
        res.status(404).json({ error: 'Templer not found' });
        return;
      }

      res.status(200).json({ templer: updatedTempler });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
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
        res.status(404).json({ error: 'Templer not found' });
        return;
      }

      res.status(200).json({ message: 'Templer deleted' });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },


};
