import { Router } from "express";
import * as contactController from "../controllers/Common/contactController";


import { checkGuestAccess } from "../middleware/checkGuestAccess";
import { checkAdminPermission } from "../middleware/checkAdminToken";

const router = Router();



// Contact Routes
router.get("/contact/getAllContacts", checkAdminPermission(), contactController.getAllContacts);
router.get("/contact/getContactById", checkAdminPermission(), contactController.getContactById); 
router.put("/contact/updateContact", checkAdminPermission(), contactController.updateContact);
router.delete("/contact/deleteContact", checkAdminPermission(), contactController.deleteContact);

// Public Routes
router.post("/contact/createContact", checkGuestAccess(), contactController.createContact);

export default router;
