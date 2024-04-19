import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/commentService';
import Joi from 'joi';

// Joi schema for validating comment data
const commentSchema = Joi.object({
    content: Joi.string().required(),
    author: Joi.string().required()
});

// Middleware to validate comment data
const validateCommentData = (req: Request, res: Response, next: NextFunction) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Create a new comment
export const createComment = async (req: Request, res: Response) => {
    try {
        const { content, author } = req.body;
        const newComment = await commentService.createComment(content, author);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all comments
export const getAllComments = async (req: Request, res: Response) => {
    try {
        const comments = await commentService.getAllComments();
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get comment by ID
export const getCommentById = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    try {
        const comment = await commentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update comment
export const updateComment = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const update = req.body;
    try {
        const updatedComment = await commentService.updateComment(commentId, update);
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete comment
export const deleteComment = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    try {
        const deletedComment = await commentService.deleteComment(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// // A route to get comments for a specific blog
// export const getCommentsForBlog = async (req: Request, res: Response) => {
//     const blogId = req.params.id;
//     try {
//         const comments = commentService.getCommentsForBlog(blogId);
//         res.status(200).json(comments);
//     } catch (error) {
//         console.error('Error fetching comments for blog:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

