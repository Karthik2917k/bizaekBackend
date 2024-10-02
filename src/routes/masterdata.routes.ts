import { Router } from "express";
import * as clientController from "../controllers/Admin/Masterdata/clientController";
import * as cultureController from "../controllers/Admin/Masterdata/cultureController";
import * as expertiseController from "../controllers/Admin/Masterdata/expertiseController";
import * as languagesController from "../controllers/Admin/Masterdata/languagesController";
import * as accountantTypeController from "../controllers/Admin/Masterdata/accountantTypeController";
import * as serviceController from "../controllers/Admin/Masterdata/servicesController"; // Import your service controller
import * as licenseController from "../controllers/Admin/Masterdata/licenseController"; // Import your license controller

import { checkGuestAccess } from "../middleware/checkGuestAccess";
import { checkAdminPermission } from "../middleware/checkAdminToken";

const router = Router();

// Admin Routes

// Client Routes
router.get("/client/getAllClients", checkAdminPermission(), clientController.getAllClients);
router.get("/client/getClientById", checkAdminPermission(), clientController.getClientById);
router.post("/client/createClient", checkAdminPermission(), clientController.createClient); 
router.put("/client/updateClient", checkAdminPermission(), clientController.updateClient);
router.delete("/client/deleteClient", checkAdminPermission(), clientController.deleteClient);

// Culture Routes
router.get("/culture/getAllCultures", checkAdminPermission(), cultureController.getAllCultures);
router.get("/culture/getCultureById", checkAdminPermission(), cultureController.getCultureById);
router.post("/culture/createCulture", checkAdminPermission(), cultureController.createCulture); 
router.put("/culture/updateCulture", checkAdminPermission(), cultureController.updateCulture);
router.delete("/culture/deleteCulture", checkAdminPermission(), cultureController.deleteCulture);

// Expertise Routes
router.get("/expertise/getAllExpertise", checkAdminPermission(), expertiseController.getAllExpertise);
router.get("/expertise/getExpertiseById", checkAdminPermission(), expertiseController.getExpertiseById);
router.post("/expertise/createExpertise", checkAdminPermission(), expertiseController.createExpertise); 
router.put("/expertise/updateExpertise", checkAdminPermission(), expertiseController.updateExpertise);
router.delete("/expertise/deleteExpertise", checkAdminPermission(), expertiseController.deleteExpertise);

// Language Routes
router.get("/language/getAllLanguages", checkAdminPermission(), languagesController.getAllLanguages);
router.get("/language/getLanguageById", checkAdminPermission(), languagesController.getLanguageById);
router.post("/language/createLanguage", checkAdminPermission(), languagesController.createLanguage); 
router.put("/language/updateLanguage", checkAdminPermission(), languagesController.updateLanguage);
router.delete("/language/deleteLanguage", checkAdminPermission(), languagesController.deleteLanguage);

// Service Routes
router.get("/service/getAllServices", checkAdminPermission(), serviceController.getAllServices);
router.get("/service/getServiceById", checkAdminPermission(), serviceController.getServiceById);
router.post("/service/createService", checkAdminPermission(), serviceController.createService); 
router.put("/service/updateService", checkAdminPermission(), serviceController.updateService);
router.delete("/service/deleteService", checkAdminPermission(), serviceController.deleteService);

// License Routes
router.get("/license/getAllLicenses", checkAdminPermission(), licenseController.getAllLicenses);
router.get("/license/getLicenseById", checkAdminPermission(), licenseController.getLicenseById);
router.post("/license/createLicense", checkAdminPermission(), licenseController.createLicenses); 
router.put("/license/updateLicense", checkAdminPermission(), licenseController.updateLicense);
router.delete("/license/deleteLicense", checkAdminPermission(), licenseController.deleteLicense);

// Accountant Type Routes
router.get("/accountantType/getAllAccountantTypes", checkAdminPermission(), accountantTypeController.getAllAccountantTypes);
router.get("/accountantType/getAccountantTypeById", checkAdminPermission(), accountantTypeController.getAccountantTypeById);
router.post("/accountantType/createAccountantType", checkAdminPermission(), accountantTypeController.createAccountantType); 
router.put("/accountantType/updateAccountantType", checkAdminPermission(), accountantTypeController.updateAccountantType);
router.delete("/accountantType/deleteAccountantType", checkAdminPermission(), accountantTypeController.deleteAccountantType);

// Public Routes

// Client Public Routes
router.get("/public/getAllClients", checkGuestAccess(), clientController.getAllClients);

// Culture Public Routes
router.get("/public/getAllCultures", checkGuestAccess(), cultureController.getAllCultures);

// Expertise Public Routes
router.get("/public/getAllExpertise", checkGuestAccess(), expertiseController.getAllExpertise);

// Language Public Routes
router.get("/public/getAllLanguages", checkGuestAccess(), languagesController.getAllLanguages);

// Service Public Routes
router.get("/public/getAllServices", checkGuestAccess(), serviceController.getAllServices);

// License Public Routes
router.get("/public/getAllLicenses", checkGuestAccess(), licenseController.getAllLicenses);

// Accountant Type Public Routes
router.get("/public/getAllAccountantTypes", checkGuestAccess(), accountantTypeController.getAllAccountantTypes);

export default router;
