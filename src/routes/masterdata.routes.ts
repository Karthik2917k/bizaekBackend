import { Router } from "express";
import * as clientController from "../controllers/Admin/Masterdata/clientController";
import * as cultureController from "../controllers/Admin/Masterdata/cultureController";
import * as expertiseController from "../controllers/Admin/Masterdata/expertiseController";
import * as languagesController from "../controllers/Admin/Masterdata/languagesController";

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

// Public Routes

// Client Public Routes
router.get("/public/getAllClients", checkGuestAccess(), clientController.getAllClients);

// Culture Public Routes
router.get("/public/getAllCultures", checkGuestAccess(), cultureController.getAllCultures);

// Expertise Public Routes
router.get("/public/getAllExpertise", checkGuestAccess(), expertiseController.getAllExpertise);

// Language Public Routes
router.get("/public/getAllLanguages", checkGuestAccess(), languagesController.getAllLanguages);

export default router;
