import { Request, Response } from 'express';
import User, { IUser } from '../../models/user.model';

// Get all users with pagination and search functionality
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query
    const searchQuery = {
      deleted: false,
      $or: [
        { name: { $regex: search, $options: 'i' } }, // case-insensitive search for name
        { email: { $regex: search, $options: 'i' } }  // case-insensitive search for email
      ],
    };

    // Fetch users based on the search query and apply pagination
    const users = await User.find(searchQuery)
      .select('name email status createdAt')
      .skip(skip)
      .limit(pageSize);
    // Fetch total count for pagination purposes
    const totalUsers = await User.countDocuments(searchQuery);

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: pageNumber,
      totalUsers,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ID from request parameters
    const { id } = req.query;

    // Fetch user by ID
    const user = await User.findById(id).select('name email status');

    if (!user) {
      res.status(404).json({ message: 'User not found', status: 404 });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};


// Update an existing user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const { status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("name status");

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Soft delete a user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
