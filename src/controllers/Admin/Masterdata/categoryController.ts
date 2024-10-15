import { Request, Response } from 'express';
import Category, { ICategory } from '../../../models/masterdata/category.model';

// Get all categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query based on name
    const searchQuery = {
      deleted: false,
      name: { $regex: search, $options: 'i' }, // case-insensitive search for category name
    };

    // Fetch categories with pagination
    const categories = await Category.find(searchQuery)
      .select('name status')
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const totalCategories = await Category.countDocuments(searchQuery);

    res.status(200).json({
      categories,
      totalPages: Math.ceil(totalCategories / pageSize),
      currentPage: pageNumber,
      totalCategories,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Fetch category by ID
    const category = await Category.findById(id).select('name status');

    if (!category) {
      res.status(404).json({ message: 'Category not found', status: 404 });
      return;
    }

    res.status(200).json({ category });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status } = req.body;

    // Validate input
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Create the category
    const newCategory = new Category({
      name,
      status: status || 'ACTIVE', // Default status is 'ACTIVE' if not provided
    });

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    res.status(201).json({ category: savedCategory });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Update the category based on the request body
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedCategory) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.status(200).json({ category: updatedCategory });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete (soft delete) a category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Soft delete the category
    const deletedCategory = await Category.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedCategory) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
