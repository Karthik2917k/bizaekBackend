import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenData {
  _id: string;
  email: string;
  // Add other fields from your token payload if necessary
}

// Extend the Request type to include the tokenData field
interface AuthenticatedRequest extends Request {
  tokenData?: TokenData;
}

// Middleware function to check if a token exists and is valid
export const checkToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized Request', status: 401 });
  } else {
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.TOKEN_SECRET as string) as TokenData;
      req.tokenData = decoded; // Attach token data to the request object
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized Request', status: 401 });
    }
  }
};
