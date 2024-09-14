import { Router } from "express";
import * as authController from "../controllers/User/authController";
import * as userController from "../controllers/User/userController";
import * as accountantController from "../controllers/User/accountantController";
import * as retailorController from "../controllers/User/retailorController";
import * as templerController from "../controllers/User/templerController";


import { checkGuestAccess } from "../middleware/checkGuestAccess";
import { checkPermission } from "../middleware/checkPermission";


const router = Router();

// Auth Routes

router.post("/auth/register",checkGuestAccess(), authController.register);
router.post("/auth/verifyOtpAndRegister",checkGuestAccess(), authController.verifyOtpAndRegister);
router.post("/auth/login",checkGuestAccess(), authController.login);

// router.post("/socialAuth", authController.socialAuth);

// User Routes

router.get("/getUser",checkPermission() ,userController.getUser);
// router.put("/updateUser", userController.updateUser);
// router.put("/deleteAccount", userController.deleteAccount);


// Accountant Routes

router.post("/accountant/createAccountant",checkPermission(), accountantController.createAccountant);
router.get("/accountant/getAccountantProfile",checkPermission(), accountantController.getAccountantProfile);
router.get("/accountant/updateAccountant",checkPermission(), accountantController.updateAccountant);
router.get("/accountant/deleteAccountant",checkPermission(), accountantController.deleteAccountant);

// Retailor Routes

router.post("/retailor/createRealtor",checkPermission(), retailorController.createRealtor);
router.get("/retailor/getRealtorProfile",checkPermission(), retailorController.getRealtorProfile);
router.get("/retailor/updateRealtor",checkPermission(), retailorController.updateRealtor);
router.get("/retailor/deleteRealtor",checkPermission(), retailorController.deleteRealtor);


// Templer Routes

router.post("/templer/createTempler",checkPermission(), templerController.createTempler);
router.get("/templer/getTemplerProfile",checkPermission(), templerController.getTemplerProfile);
router.get("/templer/updateTempler",checkPermission(), templerController.updateTempler);
router.get("/templer/deleteTempler",checkPermission(), templerController.deleteTempler);


//public routes

router.get("/public/getAllAccountant",checkGuestAccess(), accountantController.getAllAccountantsPublic);
router.get("/public/getAllRealtors",checkGuestAccess(), retailorController.getAllRealtorsPublic);
router.get("/public/getAllTemplers",checkGuestAccess(), templerController.getAllTemplersPublic);



export default router;
