import { Router } from "express";
import * as authController from "../controllers/User/authController";
import * as userController from "../controllers/User/userController";
import * as accountantController from "../controllers/User/accountantController";


import { checkGuestAccess } from "../middleware/checkGuestAccess";
import { checkPermission } from "../middleware/checkPermission";


const router = Router();

// Auth Routes

router.post("/auth/register",checkGuestAccess(), authController.register);
router.post("/auth/verifyOtpAndRegister",checkGuestAccess(), authController.verifyOtpAndRegister);
router.post("/auth/login",checkGuestAccess(), authController.login);

// router.post("/socialAuth", authController.socialAuth);

// User Routes

// router.get("/getUser", userController.getUser);
// router.put("/updateUser", userController.updateUser);
// router.put("/deleteAccount", userController.deleteAccount);


// Accountant Routes

router.post("/accountant/createAccountant",checkPermission(), accountantController.createAccountant);
router.get("/getAllAccountant",checkGuestAccess(), accountantController.getAllAccountants);
router.get("/getAccountantById",checkPermission(), accountantController.getAccountantById);
router.get("/updateAccountant",checkPermission(), accountantController.updateAccountant);
router.get("/deleteAccountant",checkPermission(), accountantController.deleteAccountant);


export default router;
