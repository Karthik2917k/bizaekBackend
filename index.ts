import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import https from "https";
import http from "http";
import dotenv from "dotenv";
import { checkGuestAccess } from "./src/middleware/checkGuestAccess";
import session from "express-session";
import passport from "passport";
import "./src/helpers/passport-config"; // Import your passport configuration file
import httpLogger from "./src/util/createLogger";
// import './helpers/passport-config';

import userRoute from "./src/routes/user.routes";
import utilRoute from "./src/routes/utils.routes";
import oauthRoute from "./src/routes/oauth.routes";
import adminRoute from "./src/routes/admin.routes";
import masterdataRoute from "./src/routes/masterdata.routes";

dotenv.config();

const app = express();
const v1Router  = express.Router();
let server: http.Server | https.Server = http.createServer(app);

v1Router.get("/", (req: Request, res: Response) => res.send("Working!!!"));

// Extract CORS_ORIGIN from environment variable and split it into an array
const allowedOrigins = process.env.CORS_ORIGIN?.split(",");

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Check if the origin is in the allowedOrigins array or if no origin (for non-browser requests)
    if (!origin || allowedOrigins?.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Use CORS middleware with options
app.use(cors(corsOptions));
// Initialize cookie-parser middleware
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
const dbURI: string = process.env.DB_URI || "";



// ADMIN ROUTES
v1Router.use("/api/admin", adminRoute);
v1Router.use("/api/admin", masterdataRoute);

// USER ROUTES
v1Router.use("/api/user", userRoute);
v1Router.use("/api/util", checkGuestAccess(), utilRoute);
v1Router.use("/api/oauth", oauthRoute);

// v1 apply the v1 prefix globally
app.use("/v1", v1Router);


mongoose.set("strictQuery", true);
mongoose
  .connect(dbURI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server now connected on port ${process.env.PORT}.`);
    });
  })
  .catch((err) => console.log(err));
