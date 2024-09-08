import { Request, Response } from 'express';
import User, { IUser } from '../../models/user.model';
import bcrypt from "bcryptjs";


interface IUserRequest extends Request {
  user: { _id: string }; // Assuming req.user has _id as a string
}

export const getUser = async (req: IUserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId) as IUser | null;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (err: any) {
    const error = err.message || 'Unknown error';
    res.status(400).json({ error });
  }
};

export const updateUser = async (req: IUserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    if (req.body.password) {
      const salt = await bcrypt.genSalt();
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true } // Returns the updated user
    ) as IUser | null;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (err: any) {
    const error = err.message || 'Unknown error';
    res.status(400).json({ error });
  }
};
