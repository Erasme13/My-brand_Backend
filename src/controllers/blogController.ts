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
export const createBlog = async (req: Request, res: Response) => {
    const { title, content, author } = req.body;
    try {
        const newBlog = await blogService.createBlog(title, content, author);
        res.status(201).json({ message: 'Blog created successfully', data: newBlog });
    } catch (err) {
        handleRouteError(err, res);
    }
};

// Get all blogs
export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await blogService.getAllBlogs();
        res.status(200).json(blogs);
    } catch (err) {
        handleRouteError(err, res);
    }
};

// Get a blog by ID
export const getBlogById = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const blog = await blogService.getBlogById(mongoose.Types.ObjectId.createFromHexString(blogId));
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (err) {
        handleRouteError(err, res);
    }
};

// Update a blog
export const updateBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const update = req.body;
    try {
        const updatedBlog = await blogService.updateBlog(mongoose.Types.ObjectId.createFromHexString(blogId), update);
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog updated successfully', data: updatedBlog });
    } catch (err) {
        handleRouteError(err, res);
    }
};

// Delete a blog
export const deleteBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const deletedBlog = await blogService.deleteBlog(mongoose.Types.ObjectId.createFromHexString(blogId));
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully', data: deletedBlog });
    } catch (err) {
        handleRouteError(err, res);
    }
};
