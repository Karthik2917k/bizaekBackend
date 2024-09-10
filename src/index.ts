import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import https from "https";
import http from "http";
import dotenv from "dotenv";
import { checkGuestAccess } from "./middleware/checkGuestAccess";
import session from 'express-session';
import passport from 'passport';
import './helpers/passport-config'; // Import your passport configuration file
import httpLogger  from "./util/createLogger";
// import './helpers/passport-config';

import userRoute from "./routes/user.routes"; 
import utilRoute from "./routes/utils.routes"; 
import oauthRoute from "./routes/oauth.routes"; 

dotenv.config();



const app = express();
let server: http.Server | https.Server = http.createServer(app);

app.get("/", (req: Request, res: Response) => res.send("Working!!!"));

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
const dbURI: string = process.env.DB_URI || "";

mongoose.set("strictQuery", true);
mongoose
  .connect(dbURI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server now connected on port ${process.env.PORT}.`);
    });
  })
  .catch((err) => console.log(err));

// USER ROUTES
app.use("/api/user", userRoute);
app.use("/api/util",checkGuestAccess(), utilRoute);
app.use('/oauth', oauthRoute);


