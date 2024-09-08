import { Request, Response, NextFunction } from "express";
import { getUser } from "../util/getUsers";

interface User {
  [key: string]: any; // Allow additional properties
}

export const checkPermission = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (token) {
      token = token.replace("Bearer ", "");

      try {
        const user = await getUser(token); // Await directly

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

