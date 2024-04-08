import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Joi from 'joi';
import { userSignupSchema, userLoginSchema } from './userValidation';

export const usersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
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
usersRouter.post('/users/signup', async (req: Request, res: Response) => {
    try {
        // Validate request body using Joi schema
        const { error } = userSignupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }  

        // Extract user credentials from request body
        const { username, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Successfully registered' });
    } catch (error) {
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
usersRouter.post('/users/login', async (req: Request, res: Response) => {
    try {
        // Validate request body using Joi schema
        const { error } = userLoginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Extract email and password
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token  

        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        
        // Respond with the token 
        res.status(200).json({ token });
    } catch (error) {
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
 *     security: []  # No security requirements for login endpoint
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '400':
 *         description: Bad request. Invalid email or password provided.
 *       '401':
 *         description: Unauthorized. Email not found or password mismatch.
 *       '500':
 *         description: Internal server error.
 */


// Get all users
usersRouter.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, {password: 0});
        res.status(200).json(users);
    } catch (error) {
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
usersRouter.get('/users/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
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
usersRouter.put('/users/updateuser/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
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
usersRouter.delete('/users/delete/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User is deleted successfully' });
    } catch (error) {
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


