"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminRouter = express_1.default.Router();
// Route for promoting a user to admin
adminRouter.put('/admin/promote/:userId', adminController_1.promoteUserToAdmin);
// Route for demoting a user from admin to regular user
adminRouter.put('/admin/demote/:userId', adminController_1.demoteAdminToUser);
exports.default = adminRouter;
