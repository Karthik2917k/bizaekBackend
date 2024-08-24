import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

export const getUser = async (
  token: string,
  next: (result: IUser | "INVALID_TOKEN") => void
): Promise<void> => {
  token = token.replace("Bearer ", "");

  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string, async (err, decoded) => {
      if (err || !decoded || typeof decoded === "string") {
        next("INVALID_TOKEN");
      } else {
        const user = decoded as JwtPayload & { _id: string };
        const userData = await User.findOne({ _id: user._id }).exec();
        if (!userData) {
          next("INVALID_TOKEN");
        } else {
          next(userData);
        }
      }
    });
  } catch (error) {
    next("INVALID_TOKEN");
  }
};
