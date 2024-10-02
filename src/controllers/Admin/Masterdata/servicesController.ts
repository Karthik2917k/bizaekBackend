import { Request, Response } from 'express';
import Service, { IService } from '../../../models/masterdata/services.model';

// Get all services
export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Search query based on name
    const searchQuery = {
      deleted: false,
      name: { $regex: search, $options: 'i' }, // case-insensitive search for service name
    };

    // Fetch services with pagination
    const services = await Service.find(searchQuery)
      .select('name description status')
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const totalServices = await Service.countDocuments(searchQuery);

    res.status(200).json({
      services,
      totalPages: Math.ceil(totalServices / pageSize),
      currentPage: pageNumber,
      totalServices,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get service by ID
export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Fetch service by ID
    const service = await Service.findById(id).select('name description status');

    if (!service) {
      res.status(404).json({ message: 'Service not found', status: 404 });
      return;
    }

    res.status(200).json({ service });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Create a new service
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const servicesArray = req.body; // Expecting an array of services

    // Validate input
    if (!Array.isArray(servicesArray) || servicesArray.length === 0) {
      res.status(400).json({ error: 'An array of services is required' });
      return;
    }

    // Map the incoming data to create service objects
    const servicesToInsert = servicesArray.map(service => {
      const { name } = service;

      // Validate individual service
      if (!name) {
        throw new Error('Name is required for each service');
      }

      return {
        name,
      };
    });

    // Save the new services to the database
    const savedServices = await Service.insertMany(servicesToInsert);

    res.status(201).json({ services: savedServices });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};


// Update a service
export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Update the service based on the request body
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedService) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.status(200).json({ service: updatedService });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete (soft delete) a service
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    // Soft delete the service
    const deletedService = await Service.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedService) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.status(200).json({ message: 'Service deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
