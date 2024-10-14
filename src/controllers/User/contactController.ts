import { Request, Response } from "express";
import ContactInquiry from "../../models/contact.model";
import { Types } from "mongoose";

// Get all contact inquiries
export const getAllContactInquiries = async (req: Request, res: Response) => {
  try {
    const contactInquiries = await ContactInquiry.find();
    res.status(200).json(contactInquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact inquiries", error });
  }
};

// Get contact inquiry by ID
export const getContactInquiryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    
    const contactInquiry = await ContactInquiry.findById(id);
    if (!contactInquiry) {
      return res.status(404).json({ message: "Contact inquiry not found" });
    }
    res.status(200).json(contactInquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact inquiry", error });
  }
};

// Create new contact inquiry
export const createContactInquiry = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, description, typeOfInquiry, preferredTiming } = req.body;

    const newContactInquiry = new ContactInquiry({
      email,
      firstName,
      lastName,
      description,
      typeOfInquiry,
      preferredTiming,
    });

    const savedContactInquiry = await newContactInquiry.save();
    res.status(201).json(savedContactInquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to create contact inquiry", error });
  }
};

// Update contact inquiry
export const updateContactInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;


    const updatedData = req.body;
    const updatedContactInquiry = await ContactInquiry.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedContactInquiry) {
      return res.status(404).json({ message: "Contact inquiry not found" });
    }

    res.status(200).json(updatedContactInquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to update contact inquiry", error });
  }
};

// Delete contact inquiry (soft delete)
export const deleteContactInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
 

    const deletedContactInquiry = await ContactInquiry.deleteOne({ _id: id });
    if (!deletedContactInquiry) {
      return res.status(404).json({ message: "Contact inquiry not found" });
    }

    res.status(200).json({ message: "Contact inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete contact inquiry", error });
  }
};
