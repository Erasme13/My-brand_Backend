import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { Document, ObjectId } from 'mongoose';
import { verifyToken } from '../middleware/auth';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export interface IUser {
    email: string;
    username: string;
    role: string;
}

// Define the interface for User Document
export interface UserDocument extends Document, IUser {
    _id: ObjectId;
}

// Middleware to extract user ID from JWT token
export async function extractUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    verifyToken(req, res, () => {
        next();
    });
}

// Function to get user by email
export async function getUserByEmail(email: string): Promise<UserDocument | null> {
    try {
        const user = await User.findOne({ email }).exec();
        return user as UserDocument;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
}

// Function to get user details for client
export async function getUserForClient(email: string): Promise<{ username: string; isAdmin: boolean } | null> {
    const user = await getUserByEmail(email);
    if (user) {
        return { username: user.username, isAdmin: user.role === 'admin' };
    }
    return null;
}
