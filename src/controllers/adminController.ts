import { Request, Response } from 'express';
import User, { UserDocument } from '../models/user';

// Promote a user to admin
export const promoteUserToAdmin = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        // Find the user by ID
        const user: UserDocument | null = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's role to admin
        user.role = 'admin';
        await user.save();

        res.status(200).json({ message: 'User promoted to admin successfully' });
    } catch (error) {
        console.error('Error promoting user to admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Demote a user from admin to regular user
export const demoteAdminToUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        // Find the user by ID
        const user: UserDocument | null = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's role to user
        user.role = 'user';
        await user.save();

        res.status(200).json({ message: 'User demoted to regular user successfully' });
    } catch (error) {
        console.error('Error demoting user from admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
