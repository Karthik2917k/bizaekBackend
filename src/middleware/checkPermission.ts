import { Request, Response, NextFunction } from "express";
import { getUser } from "../util/getUsers";

// Define an interface that extends Request with user property
interface User {
  _id: string;
  [key: string]: any; // Allow additional properties if necessary
}

interface IRequestWithUser extends Request {
  user?: User;
}

export const checkPermission = () => {
  return async (req:Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (token) {
      token = token.replace("Bearer ", "");

      try {
        const user:any = await getUser(token);

        if (user) {
          req.user = user;
          next();
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
