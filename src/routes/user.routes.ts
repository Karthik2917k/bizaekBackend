import { Router } from "express";
import * as Controller from "../controllers/User/authController";

const router = Router();

// Auth Routes
// Uncomment and update these routes when you have corresponding methods in authController

router.post("/register", Controller.register);
router.post("/login", Controller.login);
// router.post("/socialAuth", authController.socialAuth);

// User Routes

// router.get("/getUser", userController.getUser);
// router.put("/updateUser", userController.updateUser);
// router.put("/deleteAccount", userController.deleteAccount);

export default router;
