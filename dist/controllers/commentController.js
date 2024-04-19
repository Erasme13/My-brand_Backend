"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentById = exports.getAllComments = exports.createComment = void 0;
const commentService = __importStar(require("../services/commentService"));
const joi_1 = __importDefault(require("joi"));
// Joi schema for validating comment data
const commentSchema = joi_1.default.object({
    content: joi_1.default.string().required(),
    author: joi_1.default.string().required()
});
// Middleware to validate comment data
const validateCommentData = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
// Create a new comment
const createComment = async (req, res) => {
    try {
        const { content, author } = req.body;
        const newComment = await commentService.createComment(content, author);
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createComment = createComment;
// Get all comments
const getAllComments = async (req, res) => {
    try {
        const comments = await commentService.getAllComments();
        res.status(200).json(comments);
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllComments = getAllComments;
// Get comment by ID
const getCommentById = async (req, res) => {
    const commentId = req.params.id;
    try {
        const comment = await commentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    }
    catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCommentById = getCommentById;
// Update comment
const updateComment = async (req, res) => {
    const commentId = req.params.id;
    const update = req.body;
    try {
        const updatedComment = await commentService.updateComment(commentId, update);
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    }
    catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateComment = updateComment;
// Delete comment
const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    try {
        const deletedComment = await commentService.deleteComment(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteComment = deleteComment;
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
