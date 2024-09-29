import { Router } from "express";
import * as authController from "../controllers/User/authController";
import * as userController from "../controllers/User/userController";
import * as accountantController from "../controllers/User/accountantController";
import * as retailorController from "../controllers/User/retailorController";
import * as templerController from "../controllers/User/templerController";
import * as subscriptionController from "../controllers/Admin/subscriptionController";
import * as paymentController from "../controllers/User/paymentController";
import * as locationController from "../controllers/User/locationController";


import { checkGuestAccess } from "../middleware/checkGuestAccess";
import { checkPermission } from "../middleware/checkPermission";


const router = Router();

// Auth Routes

router.post("/auth/register", checkGuestAccess(), authController.register);
router.post("/auth/verifyOtpAndRegister", checkGuestAccess(), authController.verifyOtpAndRegister);
router.post("/auth/login", checkGuestAccess(), authController.login);

// router.post("/socialAuth", authController.socialAuth);

// User Routes

router.get("/getUser", checkPermission(), userController.getUser);
// router.put("/updateUser", userController.updateUser);
// router.put("/deleteAccount", userController.deleteAccount);


// Accountant Routes

router.post("/accountant/createAccountant", checkPermission(), accountantController.createAccountant);
router.get("/accountant/getAccountantProfile", checkPermission(), accountantController.getAccountantProfile);
router.put("/accountant/updateAccountant", checkPermission(), accountantController.updateAccountant);
router.put("/accountant/deleteAccountant", checkPermission(), accountantController.deleteAccountant);

// Retailor Routes

router.post("/retailor/createRealtor", checkPermission(), retailorController.createRealtor);
router.get("/retailor/getRealtorProfile", checkPermission(), retailorController.getRealtorProfile);
router.put("/retailor/updateRealtor", checkPermission(), retailorController.updateRealtor);
router.put("/retailor/deleteRealtor", checkPermission(), retailorController.deleteRealtor);


// Templer Routes

router.post("/templer/createTempler", checkPermission(), templerController.createTempler);
router.get("/templer/getTemplerProfile", checkPermission(), templerController.getTemplerProfile);
router.put("/templer/updateTempler", checkPermission(), templerController.updateTempler);
router.put("/templer/deleteTempler", checkPermission(), templerController.deleteTempler);


//Subscription routes

router.get("/subscription/getAllSubscriptions", checkPermission(), subscriptionController.getAllSubscriptions);
router.post("/subscription/buySubscription", checkPermission(), paymentController.buySubscription);

//public routes

router.get("/public/getAllAccountant", checkGuestAccess(), accountantController.getAllAccountantsPublic);
router.get("/public/getAccountantById", checkGuestAccess(), accountantController.getAccountantById);
router.get("/public/getAllRealtors", checkGuestAccess(), retailorController.getAllRealtorsPublic);
router.get("/public/getRealtorById", checkGuestAccess(), retailorController.getRealtorById);
router.get("/public/getAllTemplers", checkGuestAccess(), templerController.getAllTemplersPublic);
router.get("/public/getTemplerById", checkGuestAccess(), templerController.getTemplerById);


//location Routes

router.get('/location/countries', locationController.getAllCountries);
router.get('/location/countries/:countryId/states', locationController.getStatesByCountry);
router.get('/location/states/:stateId/cities', locationController.getCitiesByState);





export default router;
