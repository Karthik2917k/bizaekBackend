import { Request, Response } from 'express';
import Subscription, { ISubscription } from '../../models/subscription.model';

// Create a new subscription
export const createSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscriptionData: ISubscription = req.body;

    const newSubscription = new Subscription(subscriptionData);
    await newSubscription.save();

    res.status(201).json({ subscription: newSubscription });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get all subscriptions
export const getAllSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const searchQuery = {
      deleted: false,
      title: { $regex: search, $options: 'i' },  // Search by title
    };

    const subscriptions = await Subscription.find(searchQuery)
      .skip(skip)
      .limit(pageSize);

    const totalSubscriptions = await Subscription.countDocuments(searchQuery);

    res.status(200).json({
      subscriptions,
      totalPages: Math.ceil(totalSubscriptions / pageSize),
      currentPage: pageNumber,
      totalSubscriptions,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Get subscription by ID
export const getSubscriptionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      res.status(404).json({ message: 'Subscription not found', status: 404 });
      return;
    }

    res.status(200).json({ subscription });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Update subscription
export const updateSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedSubscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    res.status(200).json({ subscription: updatedSubscription });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};

// Delete subscription (soft delete)
export const deleteSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    const deletedSubscription = await Subscription.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedSubscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    res.status(200).json({ message: 'Subscription deleted' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
};
