import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { handleValidAdmin } from "../util/handleValidAdmin";

interface UserI {
  _id: string;
}

export const checkAdminPermission = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (token) {
      token = token.replace("Bearer ", "");

      try {
        const secretKey = process.env.TOKEN_SECRET || "your-secret-key";
        const decoded =await jwt.verify(token, secretKey) as UserI; // Verify token and cast to UserI

        // Ensure the decoded object contains a valid _id
        if (!decoded._id) {
          return res.status(403).json({
            message: "Forbidden: you don't have enough access to this content",
          });
        }

        // Validate the user and proceed if valid
        const validUser = await handleValidAdmin(decoded._id as string); // Await the function to check if the user is valid
        console.log('validUser:', validUser)
        if (validUser) {
          req.user = decoded; // Attach user data to request
          next(); // Proceed to the next middleware
        } else {
          res.status(403).json({
            message: "Forbidden: you don't have enough access to this content",
          });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error", status: 500 });
      }
    } else {
      res.status(401).json({ message: "Unauthorized Request", status: 401 });
    }
  };
};
