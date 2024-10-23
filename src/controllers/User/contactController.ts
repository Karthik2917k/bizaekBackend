import { Request, Response } from "express";
import ContactInquiry from "../../models/contactUs.model";
import { Types } from "mongoose";

// Get all contact inquiries
export const getAllContactInquiries = async (req: Request, res: Response) => {
  try {
    // Get query parameters for pagination and search
    const { page = 1, limit = 10, search } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    // Create a query object for filtering
    const query: any = {};

    // Search based on email or concatenated first and last name
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } }, // Case-insensitive search for email
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: search,
              options: "i", // Case-insensitive search for full name
            },
          },
        },
      ];
    }

    // Calculate total inquiries for pagination
    const totalInquiries = await ContactInquiry.countDocuments(query);
    const totalPages = Math.ceil(totalInquiries / limitNumber);

    // Fetch the inquiries with pagination
    const contactInquiries = await ContactInquiry.find(query)
      .skip((pageNumber - 1) * limitNumber) // Skip to the correct page
      .limit(limitNumber); // Limit the results

    // Return response with data and pagination info
    res.status(200).json({
      contactInquiries,
      totalInquiries,
      totalPages,
      currentPage: pageNumber,
    });
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
    const {profileId, email, firstName, lastName, description, typeOfInquiry, preferredTiming } = req.body;

    const newContactInquiry = new ContactInquiry({
      profileId,
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
