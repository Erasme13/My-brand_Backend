import express from 'express';
import { promoteUserToAdmin, demoteAdminToUser } from '../controllers/adminController';

const adminRouter = express.Router();

// Route for promoting a user to admin
adminRouter.put('/admin/promote/:userId', promoteUserToAdmin);

// Route for demoting a user from admin to regular user
adminRouter.put('/admin/demote/:userId', demoteAdminToUser);

export default adminRouter;