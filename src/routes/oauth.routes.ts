import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  console.log('req:', req.user)
  res.redirect('/dashboard'); // Redirect to the desired page after successful login
});

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
