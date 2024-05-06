"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_js_1 = __importDefault(require("../models/user.js"));
const isAdmin = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'You are not Authorised' });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        if (!decodedToken.userId || !decodedToken.isAdmin) {
            throw new Error('Invalid credentials or not an admin');
        }
        const user = await user_js_1.default.findById(decodedToken.userId);
        if (!user || !user.role) {
            throw new Error('User not found or not an admin');
        }
        req.userData = decodedToken;
        next();
    }
    catch (error) {
        console.error('Token Verification Error:', error);
        return res.status(401).json({ message: 'Invalid token or not an admin' });
    }
};
exports.isAdmin = isAdmin;
