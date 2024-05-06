import { Request, Response, NextFunction } from 'express';
import * as blogService from '../services/blogService';
import mongoose from 'mongoose';
import { validateBlog } from '../routes/blogValidation';
import { isAdmin } from '../middleware/adminMiddleware';

// Function to handle errors in Routes
function handleRouteError(err: any, res: Response) {
    if (err instanceof Error) {
        res.status(500).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'An unknown error occurred' });
    }
}

// Create a new blog
export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, photo } = req.body;
    try {
        // Validate input data
        validateBlog(req, res, next);

        // Check if user is an admin
        isAdmin(req, res, async () => {
            if (typeof req.userId !== 'string') {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const newBlog = await blogService.createBlog(title, content, photo);
            res.status(201).json({ message: 'Blog created successfully', data: newBlog });
        });
    } catch (err) {
        handleRouteError(err, res);
    }
};

// Update a blog
export const updateBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const update = req.body;
    try {
        // Check if user is an admin
        isAdmin(req, res, async () => {
            if (typeof req.userId !== 'string') {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const updatedBlog = await blogService.updateBlog(
                mongoose.Types.ObjectId.createFromHexString(blogId),
                update
            );
            if (!updatedBlog) { 
                return res
                    .status(404)
                    .json({ message: 'Blog not found or you do not have permission to update this blog' });
            }
            res.status(200).json({ message: 'Blog updated successfully', data: updatedBlog });
        });
    } catch (err) {
        handleRouteError(err, res);
    }
};

// Delete a blog
export const deleteBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        // Check if user is an admin
        isAdmin(req, res, async () => {
            if (typeof req.userId !== 'string') {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            const deletedBlog = await blogService.deleteBlog(
                mongoose.Types.ObjectId.createFromHexString(blogId)
            );
            if (!deletedBlog) {
                return res
                    .status(404)
                    .json({ message: 'Blog not found or you do not have permission to delete this blog' });
            }
            res.status(200).json({ message: 'Blog deleted successfully', data: deletedBlog });
        });
    } catch (err) {
        handleRouteError(err, res);
    }
};

