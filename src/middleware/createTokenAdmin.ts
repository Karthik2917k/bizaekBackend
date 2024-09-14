import jwt from 'jsonwebtoken';
import { ADMIN_TOKEN_AGE } from '../config/config';
import { IUser } from '../models/admin.model'; // Assuming `IUser` is your user interface
import { JwtPayload } from 'jsonwebtoken';

interface ITokenPayload extends JwtPayload {
  _id: string;
  email: string;
  // Add other fields from the user model as needed
}

export const createTokenAdmin = async (user: IUser): Promise<string> => {
  const expiresIn = ADMIN_TOKEN_AGE;
  
  const tokenPayload: ITokenPayload = {
    _id: user._id,
    email: user.email,
    // Add other fields if necessary
  };

  const token = await jwt.sign(tokenPayload, process.env.TOKEN_SECRET as string, {
    expiresIn,
  });
  
  return token;
};
