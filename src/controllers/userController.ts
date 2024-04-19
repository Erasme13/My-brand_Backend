import { Request, Response } from 'express';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import User from '../models/user';
import * as userService from '../services/userService';
import { userSignupSchema, userLoginSchema } from 'routes/userValidation';

// Function to handle user signup
export const signupUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body using Joi schema
        const { error } = userSignupSchema.validate(req.body);
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
        const hashedPassword = await bcrypt.hash(password, 10);
        await userService.createUser(username, email, hashedPassword);

        res.status(201).json({ message: 'Successfully registered' });
    } catch (error) {
        console.error('Error registering a user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to handle user login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body using Joi schema
        const { error } = userLoginSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        // Extract email and password
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }); 
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        // Generate JWT token  
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        
        // Respond with the token 
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in a user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

