"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitReply = exports.submitComment = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const comment_1 = __importDefault(require("../models/comment"));
async function submitComment(req, res) {
    try {
        // Extract author and comment content from request body
        const { author, content } = req.body;
        // Check if author and content are provided
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        // Create a new comment using the Comment model
        const newComment = await comment_1.default.createComment(content, author);
        // Return the newly created comment
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error('Error submitting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.submitComment = submitComment;
async function submitReply(req, res) {
    // Check if user is authenticated
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        // Extract username from token
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        const loggedInUsername = decodedToken.username;
        // Extract comment ID and reply content from request body
        const { commentId, replyContent } = req.body;
        // Check if commentId and replyContent are provided
        if (!commentId || !replyContent) {
            return res.status(400).json({ message: 'Comment ID and reply content are required' });
        }
        // Add the reply to the comment using the Comment model
        const updatedComment = await comment_1.default.addReply(commentId, replyContent, loggedInUsername);
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        // Return success response with the updated comment
        res.status(201).json({ message: 'Reply added successfully', updatedComment });
    }
    catch (error) {
        console.error('Error submitting reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.submitReply = submitReply;
