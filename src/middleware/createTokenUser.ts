import jwt from "jsonwebtoken";
import { USER_TOKEN_AGE } from "../config/config";
import { IUser } from "../models/user.model"; // Assuming you have the IUser interface defined here

export const createTokenUser = async (user: IUser): Promise<string> => {
  const expiresIn = USER_TOKEN_AGE;

  // Type assertion to avoid TypeScript error on accessing `_doc`
  const userDoc = user.toObject() as IUser;

  const token = await jwt.sign(userDoc, process.env.TOKEN_SECRET as string, {
    expiresIn,
  });

  return token;
};
