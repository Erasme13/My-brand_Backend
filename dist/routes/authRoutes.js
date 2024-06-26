"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const blog_1 = __importDefault(require("../models/blog"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('JWT secret is not defined in environment variables');
    process.exit(1);
}
const authRouter = express_1.default.Router();
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.userId = decoded.userId;
        next();
    });
};
authRouter.post('/users/signup', async (req, res) => {
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
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET);
        res.status(201).json({ message: 'User created successfully', token });
    }
    catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Error signing up. Please try again later.' });
    }
});
authRouter.post('/users/login', async (req, res) => {
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
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in. Please try again later.' });
    }
});
// Protected route to add blog (requires valid JWT token)
authRouter.post('/api/addblog', verifyToken, async (req, res) => {
    try {
        const { title, photo, content } = req.body;
        // Create a new blog post
        const newBlogPost = await blog_1.default.create({
            title,
            photo,
            content,
            author: req.userId
        });
        res.status(201).json({ message: 'Blog post added successfully', blogPost: newBlogPost });
    }
    catch (error) {
        console.error('Error adding blog post:', error);
        res.status(500).json({ message: 'Error adding blog post. Please try again later.' });
    }
});
exports.default = authRouter;
