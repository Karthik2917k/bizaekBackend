import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/user.model';

interface IUserRequest extends Request {
  user: { _id: string }; // Assuming req.user has _id as a string
}

export default {
  getUser: async (req: IUserRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      

      res.status(200).json({ user });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },

  updateUser: async (req: IUserRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user._id;

      if (req.body.password) {
        const salt = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { ...req.body },
        { new: true }
      );

      if (user) {
        res.status(200).json({ user });
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  },
};
