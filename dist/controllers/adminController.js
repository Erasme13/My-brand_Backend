"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoteAdminToUser = exports.promoteUserToAdmin = void 0;
const user_1 = __importDefault(require("../models/user"));
// Promote a user to admin
const promoteUserToAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        // Find the user by ID
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update the user's role to admin
        user.role = 'admin';
        await user.save();
        res.status(200).json({ message: 'User promoted to admin successfully' });
    }
    catch (error) {
        console.error('Error promoting user to admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.promoteUserToAdmin = promoteUserToAdmin;
// Demote a user from admin to regular user
const demoteAdminToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        // Find the user by ID
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update the user's role to user
        user.role = 'user';
        await user.save();
        res.status(200).json({ message: 'User demoted to regular user successfully' });
    }
    catch (error) {
        console.error('Error demoting user from admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.demoteAdminToUser = demoteAdminToUser;
