import { Request as ExpressRequest, Response, NextFunction } from 'express';
import * as blogService from '../services/blogService';
import mongoose from 'mongoose';

// Define a new interface extending Express' Request interface
interface CustomRequest extends ExpressRequest {
    blog?: any;
}

// Middleware to populate blog data for updating
export const populateBlogData = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const blogId = req.params.id;
    try {
        const blog = await blogService.getBlogById(
            mongoose.Types.ObjectId.createFromHexString(blogId)
        );
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        req.blog = blog;
        next(); 
    } catch (err) {
        // Handle errors
        console.error('Error populating blog data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
