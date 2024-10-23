import { Router } from "express";
import * as contactController from "../controllers/Common/contactController";


import { checkGuestAccess } from "../middleware/checkGuestAccess";
import { checkAdminPermission } from "../middleware/checkAdminToken";

const router = Router();



// Contact Routes
router.get("/contact/getAllClients", checkAdminPermission(), contactController.getAllContacts);
router.get("/contact/getClientById", checkAdminPermission(), contactController.getContactById); 
router.put("/contact/updateClient", checkAdminPermission(), contactController.updateContact);
router.delete("/contact/deleteClient", checkAdminPermission(), contactController.deleteContact);

// Public Routes
router.post("/contact/createClient", checkGuestAccess(), contactController.createContact);

export default router;
