import { Router } from "express";
import * as clientController from "../controllers/Admin/Masterdata/clientController";
import * as cultureController from "../controllers/Admin/Masterdata/cultureController";
import * as expertiseController from "../controllers/Admin/Masterdata/expertiseController";
import * as languagesController from "../controllers/Admin/Masterdata/languagesController";
import * as accountantTypeController from "../controllers/Admin/Masterdata/accountantTypeController";
import * as serviceController from "../controllers/Admin/Masterdata/servicesController"; 
import * as licenseController from "../controllers/Admin/Masterdata/licenseController"; 
import * as insuranceTypeController from "../controllers/Admin/Masterdata/InsuranceTypeController"; 
import * as categoryController from "../controllers/Admin/Masterdata/categoryController"; // Import category controller

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

// Insurance Type Routes
router.get("/insuranceType/getAllInsuranceTypes", checkAdminPermission(), insuranceTypeController.getAllInsuranceTypes);
router.get("/insuranceType/getInsuranceTypeById", checkAdminPermission(), insuranceTypeController.getInsuranceTypeById);
router.post("/insuranceType/createInsuranceType", checkAdminPermission(), insuranceTypeController.createInsuranceType);
router.put("/insuranceType/updateInsuranceType", checkAdminPermission(), insuranceTypeController.updateInsuranceType);
router.delete("/insuranceType/deleteInsuranceType", checkAdminPermission(), insuranceTypeController.deleteInsuranceType);

// Category Routes
router.get("/category/getAllCategories", checkAdminPermission(), categoryController.getAllCategories);
router.get("/category/getCategoryById", checkAdminPermission(), categoryController.getCategoryById);
router.post("/category/createCategory", checkAdminPermission(), categoryController.createCategory); 
router.put("/category/updateCategory", checkAdminPermission(), categoryController.updateCategory);
router.delete("/category/deleteCategory", checkAdminPermission(), categoryController.deleteCategory);

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

// Insurance Type Public Routes
router.get("/public/getAllInsuranceTypes", checkGuestAccess(), insuranceTypeController.getAllInsuranceTypes);

// Category Public Routes
router.get("/public/getAllCategories", checkGuestAccess(), categoryController.getAllCategories);

export default router;
