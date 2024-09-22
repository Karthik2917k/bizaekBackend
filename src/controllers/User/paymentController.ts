import dotenv from 'dotenv';
import stripePackage from 'stripe';
import { Request, Response } from 'express';
import Transaction from '../../models/transaction.model';
import User from '../../models/user.model';
import Subscription from '../../models/subscription.model';
import moment from 'moment';


// Load environment variables
dotenv.config();
const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY as string);



// User Buy Subscription
export const buySubscription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { amount, subscriptionId, userId } = req.body;
        console.log('amount:', amount)

  

        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than 0!", status: 400 });
        }

        // Check if subscription exists
        const getSubscription = await Subscription.findOne({ _id: subscriptionId });
        if (!getSubscription) {
            return res.status(400).json({ error: "Subscription Not Found", status: 400 });
        }

        // Calculate expiry date
        const currentDate = moment().format('YYYY-MM-DD');
        let expiryDate = moment(currentDate, "YYYY-MM-DD").add(30, 'days');

        // Convert amount to cents for Stripe (Stripe requires the amount to be in the smallest currency unit)
        const paymentAmount = amount * 100;

        // Prepare metadata for the session
        const metadata = {
            subscriptionId: subscriptionId.toString(),
            userId: userId.toString(),
            amount: amount.toString(),
            expiryDate: expiryDate.toString(),
        };

        // Create a checkout session using Stripe
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `${getSubscription.title}`,
                            description: `${getSubscription.title} subscription plan.`,
                        },
                        unit_amount: paymentAmount,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.WEB_APP_URL}/#/payment/success/sent`,
            cancel_url: `${process.env.WEB_APP_URL}/#/payment/failed`,
            metadata,
        });

        // Check if the session was created successfully
        if (!session) {
            return res.status(500).json({ error: "Error while creating Payment", status: 500 });
        }
        
        // Return the success response with the session URL
        return res.status(200).json({
            message: "Checkout session created successfully",
            status: 200,
            url: session.url,
        });

    } catch (err) {
        // Log the error and return an appropriate response
        console.error(err);
        return res.status(500).json({ error: "An error occurred", status: 500 });
    }
};

