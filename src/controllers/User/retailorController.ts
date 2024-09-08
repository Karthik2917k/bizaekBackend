import { Request, Response } from 'express';
import Realtors, { IRealtors } from '../../models/realtors.model';

// Define an interface to extend the Request object
interface IRealtorRequest extends Request {
  user: { _id: string }; // Assuming req.user has _id as a string
}

export default {
  // Get all realtors
  getAllRealtors: async (req: IRealtorRequest, res: Response): Promise<void> => {
    try {
      const { agent, type, languages, location } = req.query;
      const realtors = await Realtors.find({ deleted: false });

      res.status(200).json({ realtors });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },

  // Get a realtor by ID
  getRealtor: async (req: IRealtorRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const realtor = await Realtors.findById(id);

      if (!realtor) {
        res.status(404).json({ error: 'Realtor not found' });
        return;
      }

      res.status(200).json({ realtor });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },

  // Create a new realtor
  createRealtor: async (req: Request, res: Response): Promise<void> => {
    try {
      const newRealtor = new Realtors(req.body);
      const savedRealtor = await newRealtor.save();
      res.status(201).json({ realtor: savedRealtor });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },

  // Update a realtor by ID
  updateRealtor: async (req: IRealtorRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.query;

      const updatedRealtor = await Realtors.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );

      if (!updatedRealtor) {
        res.status(404).json({ error: 'Realtor not found' });
        return;
      }

      res.status(200).json({ realtor: updatedRealtor });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },

  // Delete (soft delete) a realtor by ID
  deleteRealtor: async (req: IRealtorRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.query;

      const updatedRealtor = await Realtors.findByIdAndUpdate(
        id,
        { deleted: true },
        { new: true }
      );

      if (!updatedRealtor) {
        res.status(404).json({ error: 'Realtor not found' });
        return;
      }

      res.status(200).json({ message: 'Realtor deleted' });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },

 
};
