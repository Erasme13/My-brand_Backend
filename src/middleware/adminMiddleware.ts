import { Request, Response, NextFunction } from 'express';
import { UserDocument } from '../models/user';

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as UserDocument;
    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
};
