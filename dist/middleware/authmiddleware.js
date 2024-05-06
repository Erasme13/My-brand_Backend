"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserForClient = exports.getUserByEmail = exports.extractUserId = void 0;
const user_1 = __importDefault(require("../models/user"));
const auth_1 = require("../middleware/auth");
// Middleware to extract user ID from JWT token
async function extractUserId(req, res, next) {
    (0, auth_1.verifyToken)(req, res, () => {
        next();
    });
}
exports.extractUserId = extractUserId;
// Function to get user by email
async function getUserByEmail(email) {
    try {
        const user = await user_1.default.findOne({ email }).exec();
        return user;
    }
    catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
}
exports.getUserByEmail = getUserByEmail;
// Function to get user details for client
async function getUserForClient(email) {
    const user = await getUserByEmail(email);
    if (user) {
        return { username: user.username, isAdmin: user.role === 'admin' };
    }
    return null;
}
exports.getUserForClient = getUserForClient;
