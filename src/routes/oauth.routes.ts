import express from "express";
import passport from "passport";
import { createTokenUser } from "../middleware/createTokenUser";
import { IUser } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    if (req.user) {
      const token = await createTokenUser(req.user as IUser); // Now passing IUser-compliant object
      const redirectUrl = process.env.GOOGLE_REDIRECT_URL as string;
      const environment = process.env.ENVIRONMENT;

      environment === "production"
        ? res.cookie("token", token, {
            httpOnly: true, // Prevents JavaScript access
            secure: true,
            domain: ".bizaek.com", // Allow cookie for subdomains   // Set to false for local development (HTTP)
            sameSite: "lax", // Lax allows cookies to be sent on top-level navigation
            maxAge: 24 * 60 * 60 * 1000 * 7, // 7 day in milliseconds
            path: "/", // Ensure the cookie is available on all paths
          })
        : res.cookie("token", token, {
            httpOnly: true,
            secure: false, // disable in local development
            sameSite: "none", // Lax allows cookies to be sent on top-level navigation
            // path: "/", // Available throughout the application
            maxAge: 24 * 60 * 60 * 1000 * 7, // 7 day in milliseconds
          });
      res.redirect(`${redirectUrl}`); // Redirect after successful login
    } else {
      res.redirect("/"); // Handle the case where `req.user` is undefined
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
