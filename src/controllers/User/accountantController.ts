import { Request, Response } from 'express';
import Accountants, { IAccountants } from '../../models/accountants.model';

// Define an interface to extend the Request object
interface IAccountantRequest extends Request {
  user: { _id: string }; // Assuming req.user has _id as a string
}

export const getAllAccountants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agent, type, languages, location } = req.query;
    const accountants = await Accountants.find({ deleted: false });

    res.status(200).json({ accountants });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const getAccountantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const accountant = await Accountants.findById(id);

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

export const createAccountant = async (req: IAccountantRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }
    
    const newAccountant = new Accountants({ ...req.body, userId: req.user._id });
    const savedAccountant = await newAccountant.save();
    res.status(201).json({ accountant: savedAccountant });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

export const updateAccountant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedAccountant = await Accountants.findByIdAndUpdate(
      id,
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
    const { id } = req.params;

    const updatedAccountant = await Accountants.findByIdAndUpdate(
      id,
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
