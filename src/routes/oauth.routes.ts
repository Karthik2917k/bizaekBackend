import express from 'express';
import passport from 'passport';
import { createTokenUser } from "../middleware/createTokenUser";
import { IUser } from '../models/user.model'; 


const router = express.Router();



// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    if (req.user) {
      const token = await createTokenUser(req.user as IUser); // Now passing IUser-compliant object
      const redirectUrl = process.env.GOOGLE_REDIRECT_URL as string;
      res.cookie("token", token, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      res.redirect(`${redirectUrl}`); // Redirect after successful login
    } else {
      res.redirect('/'); // Handle the case where `req.user` is undefined
    }
  }
);


// Facebook OAuth routes
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
//   res.redirect('/dashboard');
// });

// // Twitter OAuth routes
// router.get('/twitter', passport.authenticate('twitter'));
// router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
//   res.redirect('/dashboard');
// });

export default router;
