import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/admin.model';
import ResetPassword from '../../models/reset.model';
import { createTokenAdmin } from '../../middleware/createTokenAdmin';
import { sendEmail } from '../../util/sendEmail';

// Register Admin
export const register = [
  body('email').not().isEmpty().withMessage('Email field is required'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.create({ ...req.body });
      const token = await createTokenAdmin(user);
      res.status(201).json({
        token: token,
        status: 200,
        message: 'Register Successfully',
      });
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        error: err.message,
        status: 400,
        message: 'Something went wrong',
      });
    }
  },
];

// Admin Login
export const login = [
  body('email').not().isEmpty().withMessage('Email field is required'),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await User.findOne({ email });
      if (user) {
        if (!user.status) {
          return res.status(400).json({ message: 'User is blocked', status: 400 });
        }
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          const token = await createTokenAdmin(user);
          return res.status(200).json({
            status: 200,
            message: 'Login Successfully',
            token,
          });
        } else {
          return res.status(400).json({
            status: 400,
            message: 'Please enter correct password',
          });
        }
      } else {
        return res.status(400).json({
          status: 400,
          message: 'This email is not connected to any user',
        });
      }
    } catch (err: any) {
      res.status(400).json({
        error: err.message,
        status: 400,
        message: 'Something went wrong',
      });
    }
  },
];

// Send Reset Password Link
export const sendResetLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await ResetPassword.deleteOne({ email });

    const token = jwt.sign({ email }, process.env.TOKEN_SECRET as string, { expiresIn: '1h' });
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(400).json({
        error: 'Email id is not connected to any user.',
        status: 400,
      });
    }

    const resetToken = new ResetPassword({ token, email });
    await resetToken.save();

    const resetLink = `https://yourwebsite.com/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_SENDER as string,
      to: email,
      subject: 'Password Reset Link',
      text: `
        Hi ${findUser.name},

        Here is the link to reset your password. 
        Link: ${resetLink}

        Thanks 
        Fantasy Pickelball Team`,
    };
    await sendEmail(mailOptions);

    res.status(200).json({
      message: 'Reset password link sent successfully',
      status: 200,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: 400 });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string) as jwt.JwtPayload;
    const { email } = decodedToken;

    const resetToken = await ResetPassword.findOne({ token, email });
    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token.', status: 400 });
    }

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({ error: 'User not found.', status: 400 });
    }

    const auth = await bcrypt.compare(newPassword, findUser.password);
    if (auth) {
      return res.status(400).json({
        message: "Old and new password can't be the same",
        status: 400,
      });
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
      await ResetPassword.deleteOne({ token, email });

      return res.status(200).json({
        message: 'Password reset successfully.',
        status: 200,
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: 'Invalid or expired token.', status: 400 });
  }
};
