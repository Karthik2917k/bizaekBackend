import { Request, Response } from 'express';
import Contact from '../../models/contactUs.model';  // Assuming the contact schema is in this path

// Create a new contact
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    res.status(201).json({ contact: savedContact });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get all contacts (with pagination)
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const contacts = await Contact.find()
      .skip(skip)
      .limit(pageSize);

    const totalContacts = await Contact.countDocuments();

    res.status(200).json({
      contacts,
      totalPages: Math.ceil(totalContacts / pageSize),
      currentPage: pageNumber,
      totalContacts,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get contact by ID
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.status(200).json({ contact });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update a contact by ID
export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedContact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.status(200).json({ contact: updatedContact });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Soft delete a contact by ID
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndUpdate(id, { deleted: true }, { new: true });

    if (!deletedContact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
