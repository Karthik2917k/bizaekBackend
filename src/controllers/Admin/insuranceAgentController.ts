import { Request, Response } from 'express';
import InsuranceAgent, { IInsuranceAgent } from '../../models/agent.model';

// Get all Insurance Agents
export const getAllInsuranceAgents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query - searching by first name, last name, or email
    const searchQuery = {
      deleted: false,
      $or: [
        { firstName: { $regex: search, $options: 'i' } }, // case-insensitive search for first name
        { lastName: { $regex: search, $options: 'i' } },  // case-insensitive search for last name
        { email: { $regex: search, $options: 'i' } }      // case-insensitive search for email
      ],
    };

    // Fetch insurance agents based on the search query and apply pagination
    const insuranceAgents = await InsuranceAgent.find(searchQuery)
      .select('profilePicture lastName firstName email userId status createdAt')
      .skip(skip)
      .limit(pageSize)
      .populate('typesOfInsurance', 'name');

    // Fetch total count for pagination purposes
    const totalInsuranceAgents = await InsuranceAgent.countDocuments(searchQuery);

    res.status(200).json({
      insuranceAgents,
      totalPages: Math.ceil(totalInsuranceAgents / pageSize),
      currentPage: pageNumber,
      totalInsuranceAgents,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get Insurance Agent by ID
export const getInsuranceAgentById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ID from request parameters
    const { id } = req.query;

    // Fetch insurance agent by ID
    const insuranceAgent = await InsuranceAgent.findById(id).select('profilePicture lastName firstName email userId status');

    if (!insuranceAgent) {
      res.status(404).json({ message: 'Insurance Agent not found', status: 404 });
      return;
    }

    res.status(200).json({ insuranceAgent });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update Insurance Agent
export const updateInsuranceAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedInsuranceAgent = await InsuranceAgent.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedInsuranceAgent) {
      res.status(404).json({ error: 'Insurance Agent not found' });
      return;
    }

    res.status(200).json({ insuranceAgent: updatedInsuranceAgent });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete Insurance Agent (soft delete)
export const deleteInsuranceAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedInsuranceAgent = await InsuranceAgent.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!updatedInsuranceAgent) {
      res.status(404).json({ error: 'Insurance Agent not found' });
      return;
    }

    res.status(200).json({ message: 'Insurance Agent deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
