"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signupUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const userService = __importStar(require("../services/userService"));
const userValidation_1 = require("routes/userValidation");
// Function to handle user signup
const signupUser = async (req, res) => {
    try {
        // Validate request body using Joi schema
        const { error } = userValidation_1.userSignupSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        // Extract user credentials from request body
        const { username, email, password } = req.body;
        // Check if email already exists
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        // Hash password using bcrypt
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await userService.createUser(username, email, hashedPassword);
        res.status(201).json({ message: 'Successfully registered' });
    }
    catch (error) {
        console.error('Error registering a user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.signupUser = signupUser;
// Function to handle user login
const loginUser = async (req, res) => {
    try {
        // Validate request body using Joi schema
        const { error } = userValidation_1.userLoginSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        // Extract email and password
        const { email, password } = req.body;
        // Find user by email
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Compare password with hashed password
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, isAdmin: user.role === 'admin' }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
        // Respond with the token 
        res.status(200).json({ token });
    }
    catch (error) {
        console.error('Error logging in a user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.loginUser = loginUser;
