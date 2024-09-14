import { Router } from "express";
import * as authController from "../controllers/Admin/authController";
import * as userController from "../controllers/Admin/userController";
import * as accountantController from "../controllers/Admin/accountantController";
import * as retailorController from "../controllers/Admin/retailorController";
import * as templerController from "../controllers/Admin/templerController";


import { checkGuestAccess } from "../middleware/checkGuestAccess";
import { checkAdminPermission } from "../middleware/checkAdminToken";


const router = Router();

// Auth Routes

router.post("/auth/register",checkGuestAccess(), authController.register);
router.post("/auth/login",checkGuestAccess(), authController.login);



// User Routes

router.get("/user/getAllUser",checkAdminPermission(), userController.getAllUsers);
router.get("/user/getUserById",checkAdminPermission(), userController.getUserById);
router.get("/user/updateUser",checkAdminPermission(), userController.updateUser);
router.get("/user/deleteUser",checkAdminPermission(), userController.deleteUser);


// Accountant Routes

router.get("/accountant/getAllAccountant",checkAdminPermission(), accountantController.getAllAccountants);
router.get("/accountant/getAccountantById",checkAdminPermission(), accountantController.getAccountantById);
router.get("/accountant/updateAccountant",checkAdminPermission(), accountantController.updateAccountant);
router.get("/accountant/deleteAccountant",checkAdminPermission(), accountantController.deleteAccountant);

// Retailor Routes

router.get("/retailor/getAllRealtors",checkAdminPermission(), retailorController.getAllRealtors);
router.get("/retailor/getRealtorById",checkAdminPermission(), retailorController.getRealtorById);
router.get("/retailor/updateRealtor",checkAdminPermission(), retailorController.updateRealtor);
router.get("/retailor/deleteRealtor",checkAdminPermission(), retailorController.deleteRealtor);


// Templer Routes

router.get("/templer/getAllTemplers",checkAdminPermission(), templerController.getAllTemplers);
router.get("/templer/getTemplerById",checkAdminPermission(), templerController.getTemplerById);
router.get("/templer/updateTempler",checkAdminPermission(), templerController.updateTempler);
router.get("/templer/deleteTempler",checkAdminPermission(), templerController.deleteTempler);






export default router;

