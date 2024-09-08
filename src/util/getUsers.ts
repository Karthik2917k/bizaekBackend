import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

export const getUser = async (token: string): Promise<IUser | "INVALID_TOKEN"> => {
  token = token.replace("Bearer ", "");

  try {
    // Wrapping jwt.verify in a Promise to use async/await
    const decoded = await new Promise<JwtPayload & { _id: string }>((resolve, reject) => {
      jwt.verify(token, process.env.TOKEN_SECRET as string, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
          reject("INVALID_TOKEN");
        } else {
          resolve(decoded as JwtPayload & { _id: string });
        }
      });
    });

    const userData = await User.findOne({ _id: decoded._id }).exec();
    if (!userData) {
      return "INVALID_TOKEN";
    } else {
      return userData;
    }
  } catch (error) {
    return "INVALID_TOKEN";
  }
};
