import { Request, Response } from 'express';
import Blog from '../models/blog';

export async function getAllLikes(req: Request, res: Response) {
    const blogId = req.params.blogId;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const likesCount = blog.likes.length;
        return res.status(200).json({ likes: likesCount });
    } catch (error) {
        console.error('Error getting likes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
