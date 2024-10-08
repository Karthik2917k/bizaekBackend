import { Request, Response } from "express";
import User, { IUser } from "../../models/user.model";
import ResetPassword from "../../models/reset.model";
import IResetPassword from "../../models/reset.model";
import passport from "passport";
import { createTokenUser } from "../../middleware/createTokenUser";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { generateNumericOTP } from "../../helpers/common";
import { sendEmail } from "../../util/sendEmail";
import dotenv from "dotenv";

dotenv.config();

// Interface for Register Request Body
interface RegisterRequestBody {
  email: string;
  password?: string;
  [key: string]: any; // This allows other fields in the body
}

// Register Function
export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
) => {
  const { email, name } = req.body;

  try {
    const findUser = (await User.findOne({ email })) as IUser | null;

    if (findUser) {
      return res
        .status(403)
        .json({ error: "Email already connected with a user", status: 403 });
    }

    // Generate OTP
    const otp = generateNumericOTP(6);
    const expirationTime = 15 * 60 * 1000; // 15 minutes
    const expiresAt = Date.now() + expirationTime;

    // Hash password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }

    // Store OTP for verification
    const otpRecord = new ResetPassword({
      otp,
      email,
      name,
      password: req.body.password,
      expirationTime: expiresAt,
      reason: "Register",
    });
    await otpRecord.save();

    // Send OTP to email
    const mailOptions = {
      from: process.env.EMAIL_SENDER!,
      to: email.toLowerCase(),
      subject: "One-Time Password (OTP) for Registration",
      text: `Hello,
  
      Your OTP for verification is: ${otp}.
      Please use this OTP within the next 15 minutes.

      Thanks 
      Bizaek Team`,
    };
    await sendEmail(mailOptions);

    res.status(200).json({
      message: "OTP sent successfully. Please verify to complete registration.",
      status: 200,
    });
  } catch (err: any) {
    let error = err.message;
    res.status(400).json({ error });
  }
};

// OTP Verification Function
export const verifyOtpAndRegister = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record
    const otpVerification = await ResetPassword.findOne({
      email: email,
    });

    // Ensure otpVerification is defined
    if (!otpVerification) {
      return res
        .status(400)
        .json({ error: "Invalid or expired OTP.", status: 400 });
    }

    // Extract values safely with type checking
    const { otp: storedOtp, expirationTime } = otpVerification;

    // Ensure expirationTime is not undefined
    if (
      storedOtp !== otp ||
      expirationTime === undefined ||
      expirationTime < Date.now()
    ) {
      return res
        .status(400)
        .json({ status: 400, error: "Invalid or expired OTP." });
    }

    // Create user after OTP verification
    const user = (await User.create({
      email,
      password: otpVerification?.password,
      name: otpVerification?.name,
    })) as IUser;

    // Generate token for the user
    const token = await createTokenUser(user);

    // Remove OTP record after successful verification
    await ResetPassword.deleteOne({ email, reason: "Register" });

    const environment = process.env.ENVIRONMENT;

    environment === "production"
      ? res.cookie("token", token, {
          httpOnly: true, // Prevents JavaScript access
          secure: true,
          domain: ".bizaek.com", // Allow cookie for subdomains   // Set to false for local development (HTTP)
          sameSite: "lax", // Lax allows cookies to be sent on top-level navigation
          maxAge: 24 * 60 * 60 * 1000 * 7, // 7 day in milliseconds
        })
      : res.cookie("token", token, {
          httpOnly: true,
          secure: true, // disable in local development
          sameSite: "none", // Lax allows cookies to be sent on top-level navigation
          maxAge: 24 * 60 * 60 * 1000 * 7, // 7 day in milliseconds
        });
    res
      .status(201)
      .json({ status: 201, message: "Register Successfully", token });
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
        return res.status(400).json({ status: 400, errors: errors.array() });
      }

      const user = (await User.findOne({ email })) as IUser | null;

      if (user) {
        if (password) {
          const auth = await bcrypt.compare(password, user.password || "");
          if (!auth) {
            return res
              .status(400)
              .json({ status: 400, error: "Incorrect password" });
          }
        }

        if (user.status === "BLOCKED") {
          return res
            .status(400)
            .json({ status: 400, error: "User is blocked" });
        }

        // await User.findByIdAndUpdate(user._id, { fcmToken });

        // const userWithoutPassword = await User.findById(user._id).select('-password');
        const token = await createTokenUser(user as IUser);

        const environment = process.env.ENVIRONMENT;

        environment === "production"
          ? res.cookie("token", token, {
              httpOnly: true, // Prevents JavaScript access
              secure: true,
              domain: "temple.bizaek.com", // Allow cookie for subdomains   // Set to false for local development (HTTP)
              sameSite: "lax", // Lax allows cookies to be sent on top-level navigation
              maxAge: 24 * 60 * 60 * 1000 * 7, // 7 day in milliseconds
            })
          : res.cookie("token", token, {
            httpOnly: true,
            secure: true, // disable in local development
            sameSite: "none", // Lax allows cookies to be sent on top-level navigation
            maxAge: 24 * 60 * 60 * 1000 * 7, // 7 day in milliseconds
            });
        res
          .status(200)
          .json({ status: 200, message: "Login Successfully", token });
      } else {
        throw new Error("Please enter registered email");
      }
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ status: 400, error: err.message });
    }
  },
];
