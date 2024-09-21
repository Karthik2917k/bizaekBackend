import { Router } from "express";
import * as authController from "../controllers/Admin/authController";
import * as userController from "../controllers/Admin/userController";
import * as accountantController from "../controllers/Admin/accountantController";
import * as retailorController from "../controllers/Admin/retailorController";
import * as templerController from "../controllers/Admin/templerController";
import * as subscriptionController from "../controllers/Admin/subscriptionController";


import { checkGuestAccess } from "../middleware/checkGuestAccess";
import { checkAdminPermission } from "../middleware/checkAdminToken";


const router = Router();

// Auth Routes

router.post("/auth/register",checkGuestAccess(), authController.register);
router.post("/auth/login",checkGuestAccess(), authController.login);



// User Routes

router.get("/user/getAllUser",checkAdminPermission(), userController.getAllUsers);
router.get("/user/getUserById",checkAdminPermission(), userController.getUserById);
router.put("/user/updateUser",checkAdminPermission(), userController.updateUser);
router.put("/user/deleteUser",checkAdminPermission(), userController.deleteUser);


// Accountant Routes

router.get("/accountant/getAllAccountant",checkAdminPermission(), accountantController.getAllAccountants);
router.get("/accountant/getAccountantById",checkAdminPermission(), accountantController.getAccountantById);
router.put("/accountant/updateAccountant",checkAdminPermission(), accountantController.updateAccountant);
router.put("/accountant/deleteAccountant",checkAdminPermission(), accountantController.deleteAccountant);

// Retailor Routes

router.get("/retailor/getAllRealtors",checkAdminPermission(), retailorController.getAllRealtors);
router.get("/retailor/getRealtorById",checkAdminPermission(), retailorController.getRealtorById);
router.put("/retailor/updateRealtor",checkAdminPermission(), retailorController.updateRealtor);
router.put("/retailor/deleteRealtor",checkAdminPermission(), retailorController.deleteRealtor);


// Templer Routes

router.get("/templer/getAllTemplers",checkAdminPermission(), templerController.getAllTemplers);
router.get("/templer/getTemplerById",checkAdminPermission(), templerController.getTemplerById);
router.put("/templer/updateTempler",checkAdminPermission(), templerController.updateTempler);
router.put("/templer/deleteTempler",checkAdminPermission(), templerController.deleteTempler);


// Subscription Routes

router.post("/subscription/createSubscription",checkAdminPermission(), subscriptionController.createSubscription);
router.get("/subscription/getAllSubscriptions",checkAdminPermission(), subscriptionController.getAllSubscriptions);
router.get("/subscription/getSubscriptionById",checkAdminPermission(), subscriptionController.getSubscriptionById);
router.put("/subscription/updateSubscription",checkAdminPermission(), subscriptionController.updateSubscription);
router.put("/subscription/deleteSubscription",checkAdminPermission(), subscriptionController.deleteSubscription);




export default router;