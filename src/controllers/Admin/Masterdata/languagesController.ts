import { Request, Response } from 'express';
import Language, { ILanguage } from '../../../models/masterdata/languages.model';

// Get all languages
export const getAllLanguages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query based on name
    const searchQuery = {
      deleted: false,
      name: { $regex: search, $options: 'i' }, // case-insensitive search for language name
    };

    // Fetch languages with pagination
    const languages = await Language.find(searchQuery)
      .select('name status')
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const totalLanguages = await Language.countDocuments(searchQuery);

    res.status(200).json({
      languages,
      totalPages: Math.ceil(totalLanguages / pageSize),
      currentPage: pageNumber,
      totalLanguages,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get language by ID
export const getLanguageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Fetch language by ID
    const language = await Language.findById(id).select('name status');

    if (!language) {
      res.status(404).json({ message: 'Language not found', status: 404 });
      return;
    }

    res.status(200).json({ language });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Create a new language
export const createLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status } = req.body;

    // Validate input
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Create the language
    const newLanguage = new Language({
      name,
      status: status || 'ACTIVE', // Default status is 'ACTIVE' if not provided
    });

    // Save the new language to the database
    const savedLanguage = await newLanguage.save();

    res.status(201).json({ language: savedLanguage });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update a language
export const updateLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Update the language based on the request body
    const updatedLanguage = await Language.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedLanguage) {
      res.status(404).json({ error: 'Language not found' });
      return;
    }

    res.status(200).json({ language: updatedLanguage });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete (soft delete) a language
export const deleteLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Soft delete the language
    const deletedLanguage = await Language.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedLanguage) {
      res.status(404).json({ error: 'Language not found' });
      return;
    }

    res.status(200).json({ message: 'Language deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
