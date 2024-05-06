import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../controllers/user.interface.js';
import User  from '../models/user.js';

export interface DecodedUser {
    userId: string;
    email: string;
    firstname: string;
    isAdmin: boolean;
}

export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); 

    if (!token) {
        return res.status(401).json({ message: 'You are not Authorised' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '') as DecodedUser; 
        
        if (!decodedToken.userId || !decodedToken.isAdmin) {
            throw new Error('Invalid credentials or not an admin');
        }

        const user = await User.findById(decodedToken.userId);
        if (!user || !user.role) {
            throw new Error('User not found or not an admin');
        }

        req.userData = decodedToken;
        next();
    } catch (error) {
        console.error('Token Verification Error:', error);
        return res.status(401).json({ message: 'Invalid token or not an admin' });
    }
};