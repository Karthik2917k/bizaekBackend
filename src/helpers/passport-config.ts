import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import User, { IUser } from "../models/user.model";
import dotenv from 'dotenv';
dotenv.config();

// Serialize and deserialize the user
passport.serializeUser((user, done) => {
  done(null, (user as any)._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || false);
  } catch (error) {
    done(error, false);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: 'https://api.temple.bizaek.com/oauth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails?.[0]?.value || '', // Use optional chaining and provide default value
        name: profile.displayName
      });
      await user.save();
    }

    done(null, user);
  } catch (error) {
    done(error, false); // Use `false` instead of `null`
  }
}));

// // Facebook OAuth Strategy
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_CLIENT_ID as string,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
//   callbackURL: '/auth/facebook/callback',
//   profileFields: ['id', 'emails', 'name'] // Request the necessary data
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ facebookId: profile.id });
//     if (!user) {
//       user = new User({
//         facebookId: profile.id,
//         email: profile.emails?.[0]?.value || '', // Handle optional chaining
//         name: `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() // Handle name fields
//       });
//       await user.save();
//     }
//     done(null, user);
//   } catch (error) {
//     done(error, false); // Use `false` instead of `null`
//   }
// }));

// // Twitter OAuth Strategy
// passport.use(new TwitterStrategy({
//   consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
//   consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
//   callbackURL: '/auth/twitter/callback'
// }, async (token, tokenSecret, profile, done) => {
//   try {
//     let user = await User.findOne({ twitterId: profile.id });
//     if (!user) {
//       user = new User({
//         twitterId: profile.id,
//         name: profile.displayName
//       });
//       await user.save();
//     }
//     done(null, user);
//   } catch (error) {
//     done(error, false); // Use `false` instead of `null`
//   }
// }));
