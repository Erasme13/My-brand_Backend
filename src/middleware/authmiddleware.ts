import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/user';

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
        }
    }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err, user) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user as UserDocument;
        next();
    });
}

export async function getUserByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email }).exec();
}

export async function getUserForClient(email: string): Promise<{ username: string; isAdmin: boolean } | null> {
    const user = await getUserByEmail(email);
    if (user) {
        return { username: user.username, isAdmin: user.role === 'admin' };
    }
    return null;
}
