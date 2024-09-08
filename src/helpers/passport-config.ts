import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User, { IUser } from "../models/user.model";

// Passport serialization
passport.serializeUser((user: any, done) => {
   done(null, user.id); // Serialize user by ID
});

passport.deserializeUser(async (id: string, done) => {
   try {
      const user = await User.findById(id);
      if (user) {
         done(null, user); // No error, return user object
      } else {
         done(new Error("User not found"), null); // User not found
      }
   } catch (err) {
      done(err, null); // Return error if there's an issue
   }
});

passport.use(new GoogleStrategy({
   clientID: process.env.GOOGLE_CLIENT_ID!,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
   callbackURL: "/auth/google/callback"
},
async (accessToken: string, refreshToken: string, profile: any, done:any) => {
   try {
      console.log("Google Profile:", profile); // Log profile data for debugging
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
         user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,  // Optional chaining for safety
         });
         await user.save();
      }
      return done(null, user);  // Ensure `null` is passed for no errors
   } catch (err) {
      console.error("Error in Google Strategy:", err);  // Log the error
      return done(err, null); // Pass error to Passport
   }
}));

// passport.use(new FacebookStrategy({
//    clientID: process.env.FACEBOOK_APP_ID!,
//    clientSecret: process.env.FACEBOOK_APP_SECRET!,
//    callbackURL: "/auth/facebook/callback",
//    profileFields: ['id', 'displayName', 'email']
// },
// async (accessToken: string, refreshToken: string, profile: any, done:any) => {
//    try {
//       console.log("Facebook Profile:", profile); // Log profile data for debugging
//       let user = await User.findOne({ facebookId: profile.id });
//       if (!user) {
//          user = new User({
//             facebookId: profile.id,
//             name: profile.displayName,
//             email: profile.emails?.[0]?.value,  // Optional chaining for safety
//          });
//          await user.save();
//       }
//       return done(null, user);  // Ensure `null` is passed for no errors
//    } catch (err) {
//       console.error("Error in Facebook Strategy:", err);  // Log the error
//       return done(err, null); // Pass error to Passport
//    }
// }));

// passport.use(new GitHubStrategy({
//    clientID: process.env.GITHUB_CLIENT_ID!,
//    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//    callbackURL: "/auth/github/callback"
// },
// async (accessToken: string, refreshToken: string, profile: any, done:any) => {
//    try {
//       console.log("GitHub Profile:", profile); // Log profile data for debugging
//       let user = await User.findOne({ githubId: profile.id });
//       if (!user) {
//          user = new User({
//             githubId: profile.id,
//             name: profile.displayName,
//             email: profile.emails?.[0]?.value,  // Optional chaining for safety
//          });
//          await user.save();
//       }
//       return done(null, user);  // Ensure `null` is passed for no errors
//    } catch (err) {
//       console.error("Error in GitHub Strategy:", err);  // Log the error
//       return done(err, null); // Pass error to Passport
//    }
// }));
