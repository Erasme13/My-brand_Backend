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
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const userService = __importStar(require("../services/userService"));
const userValidation_1 = require("./userValidation");
const blackListedToken_1 = __importDefault(require("../models/blackListedToken"));
exports.usersRouter = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: username for login
 *         email:
 *           type: string
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password for login
 */
// User registration(Signup)
exports.usersRouter.post('/users/signup', async (req, res) => {
    try {
        // Validate request body using Joi schema
        const { error } = userValidation_1.userSignupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // Extract user credentials from request body
        const { username, email, password } = req.body;
        // Check if email already exists
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
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
});
/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: User Signup
 *     description: Register a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *       '400':
 *         description: Bad request. Invalid user data provided.
 *       '500':
 *         description: Internal server error.
 */
// User login 
exports.usersRouter.post('/users/login', async (req, res) => {
    try {
        // Validate request body using Joi schema
        const { error } = userValidation_1.userLoginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // Extract email and password
        const { email, password } = req.body;
        // Find user by email
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Compare password with hashed password
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token  
        const token = jsonwebtoken_1.default.sign({ userID: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        // Respond with the token 
        res.status(200).json({ token, message: 'Successfully logged in' });
    }
    catch (error) {
        console.error('Error logging in a user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user and generate a JWT token for authorization.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login successful. Returns JWT token.
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *       '400':
 *         description: Bad request. Invalid email or password provided.
 *       '401':
 *         description: Unauthorized. Email not found or password mismatch.
 *       '500':
 *         description: Internal server error.
 */
// User logout endpoint
exports.usersRouter.post('/users/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'Token not provided' });
        }
        // Add the token to the blacklist
        const blacklistedToken = new blackListedToken_1.default({ token });
        await blacklistedToken.save();
        res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        console.error('Error logging out a user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
/**
 * @swagger
 * components:
 *   schemas:
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Message indicating the logout was successful.
 */
/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidate the user's authentication token.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       '500':
 *         description: Internal server error.
 *       '401':
 *         description: Unauthorized. The user is not authenticated.
 */
// Get all users
exports.usersRouter.get('/users', async (req, res) => {
    try {
        const users = await user_1.default.find({}, { password: 0 });
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all registered users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 */
// Get a user by ID
exports.usersRouter.get('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error getting a user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a single user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve.
 *     responses:
 *       '200':
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 */
// Update user 
exports.usersRouter.put('/users/updateuser/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await user_1.default.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error updating a user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
/**
 * @swagger
 * /api/users/updateuser/{userId}:
 *   put:
 *     summary: Update user
 *     description: Update an existing user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 */
// Delete a user
exports.usersRouter.delete('/users/delete/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await user_1.default.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User is deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting a user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
/**
 * @swagger
 * /api/users/delete/{userId}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete an existing user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete.
 *     responses:
 *       '200':
 *         description: User deleted successfully.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 */
