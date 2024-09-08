import { Request, Response } from 'express';
import User, { IUser } from '../../models/user.model';
import bcrypt from "bcryptjs";


// Define the structure of req.user with user containing _id
interface UserI {
  _id?: string;
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfo:UserI|undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated',status:401, });
      return;
    }
    const user = await User.findById(userInfo._id) as IUser | null;

    if (!user) {
      res.status(404).json({status:404, error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (err: any) {
    const error = err.message || 'Unknown error';
    res.status(400).json({status:400, error });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfo:UserI|undefined = req.user;

    // Check if userInfo and userInfo._id are valid
    if (!userInfo) {
      res.status(401).json({status:401, error: 'Unauthorized: User not authenticated' });
      return;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt();
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      userInfo._id,
      { ...req.body },
      { new: true } // Returns the updated user
    ) as IUser | null;

    if (!user) {
      res.status(404).json({status:404, error: 'User not found' });
      return;
    }

    res.status(200).json({status:200, user });
  } catch (err: any) {
    const error = err.message || 'Unknown error';
    res.status(400).json({status:400, error });
  }
};
