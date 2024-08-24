import { Request, Response } from "express";
import User, { IUser } from "../../models/user.model";

import { createTokenUser } from "../../middleware/createTokenUser";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

// Interface for Register Request Body
interface RegisterRequestBody {
  email: string;
  password?: string;
  [key: string]: any; // This allows other fields in the body
}

// Register Function
export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  const { email } = req.body;

  try {
    const findUser = await User.findOne({ email }) as IUser | null;

    if (req.body.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }

    if (!findUser) {
      const user = await User.create(req.body) as IUser;
    
      const token = await createTokenUser(user as IUser);
      return res.status(201).json({ user: user, token });
    } else {
      res.status(400).json({ error: "Email already connected with any user" });
    }
  } catch (err: any) {
    let error = err.message;
    res.status(400).json({ error });
  }
};


// Interface for Login Request Body
interface LoginRequestBody {
  email: string;
  password?: string;
  fcmToken?: string;
}

// Login Function
export const login = [
  async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { email, password } = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findOne({ email }) as IUser | null;

      if (user) {
        if (password) {
          const auth = await bcrypt.compare(password, user.password || '');
          if (!auth) {
            return res.status(400).json({ error: "Incorrect password" });
          }
        }

        if (user.status === "BLOCKED") {
          return res.status(400).json({ error: "User is blocked" });
        }

        // await User.findByIdAndUpdate(user._id, { fcmToken });

        // const userWithoutPassword = await User.findById(user._id).select('-password');
        const token = await createTokenUser(user as IUser);
        res.status(200).json({ message: "Login Successfully", token });
      } else {
        throw new Error("Please enter registered email");
      }
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  },
];

