import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    id: string;
    username: string;
    isAdmin: boolean;
}

// Extend the Request interface in the global namespace
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            lUsername?: string;
            isAdmin?: boolean;
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
        const parts = authorizationHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }
    if (!token) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token. Please log in again.' });
        }
        const { id, username, isAdmin } = decoded as DecodedToken;
        req.userId = id;
        req.lUsername = username;
        req.isAdmin = isAdmin; 
        next();
    });
};

export const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
