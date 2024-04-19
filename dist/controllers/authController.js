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
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        const existingUsername = await user_1.default.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await user_1.default.create({
            username,
            email,
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, jwtSecret);
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
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret);
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in. Please try again later.' });
    }
};
exports.login = login;
