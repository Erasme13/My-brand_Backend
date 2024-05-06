"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('JWT secret is not defined in environment variables');
    process.exit(1);
}
// User Signup
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validate input data
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
        // Check if user already exists
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        // Check if username is taken
        const existingUsername = await user_1.default.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create new user
        const newUser = await user_1.default.create({
            username,
            email,
            password: hashedPassword,
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id, isAdmin: newUser.role === 'admin' }, jwtSecret);
        res.status(201).json({ message: 'User created successfully', token });
    }
    catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Error signing up. Please try again later.' });
    }
};
exports.signup = signup;
// User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input data
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Find user by email
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Compare passwords
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token with user's role
        const token = jsonwebtoken_1.default.sign({ userId: user._id, isAdmin: user.role === 'admin' }, jwtSecret);
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in. Please try again later.' });
    }
};
exports.login = login;
