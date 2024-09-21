import { Request, Response } from 'express';
import Client, { IClient } from '../../../models/masterdata/client.model';

// Get all clients
export const getAllClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query based on client name
    const searchQuery = {
      deleted: false,
      name: { $regex: search, $options: 'i' }, // case-insensitive search for client name
    };

    // Fetch clients with pagination
    const clients = await Client.find(searchQuery)
      .select('name link image status')
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const totalClients = await Client.countDocuments(searchQuery);

    res.status(200).json({
      clients,
      totalPages: Math.ceil(totalClients / pageSize),
      currentPage: pageNumber,
      totalClients,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get client by ID
export const getClientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Fetch client by ID
    const client = await Client.findById(id).select('name link image status');

    if (!client) {
      res.status(404).json({ message: 'Client not found', status: 404 });
      return;
    }

    res.status(200).json({ client });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Create a new client
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, link, image, status } = req.body;

    // Validate input
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Create the client
    const newClient = new Client({
      name,
      link,
      image,
      status: status || 'ACTIVE', // Default status is 'ACTIVE' if not provided
    });

    // Save the new client to the database
    const savedClient = await newClient.save();

    res.status(201).json({ client: savedClient });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update a client
export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Update the client based on the request body
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedClient) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.status(200).json({ client: updatedClient });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete (soft delete) a client
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Soft delete the client
    const deletedClient = await Client.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedClient) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.status(200).json({ message: 'Client deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
