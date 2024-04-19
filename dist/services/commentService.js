"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsForBlog = exports.deleteComment = exports.updateComment = exports.getCommentById = exports.getAllComments = exports.createComment = void 0;
const joi_1 = __importDefault(require("joi"));
const comment_1 = __importDefault(require("../models/comment"));
// Joi schema for validating comment data
const commentSchema = joi_1.default.object({
    content: joi_1.default.string().required(),
    author: joi_1.default.string().required()
});
// Validate comment data
function validateCommentData(data) {
    return commentSchema.validate(data);
}
// Create a new comment
async function createComment(content, author) {
    try {
        // Validate comment data
        const { error } = validateCommentData({ content, author });
        if (error) {
            throw new Error(error.details[0].message);
        }
        const newComment = await comment_1.default.create({ content, author });
        return newComment;
    }
    catch (error) {
        throw error;
    }
}
exports.createComment = createComment;
// Get all comments
async function getAllComments() {
    try {
        const comments = await comment_1.default.find();
        return comments;
    }
    catch (error) {
        throw error;
    }
}
exports.getAllComments = getAllComments;
// Get comment by ID
async function getCommentById(commentId) {
    try {
        const comment = await comment_1.default.findById(commentId);
        return comment;
    }
    catch (error) {
        throw error;
    }
}
exports.getCommentById = getCommentById;
// Update comment
async function updateComment(commentId, update) {
    try {
        const updatedComment = await comment_1.default.findByIdAndUpdate(commentId, update, { new: true });
        return updatedComment;
    }
    catch (error) {
        throw error;
    }
}
exports.updateComment = updateComment;
// Delete comment
async function deleteComment(commentId) {
    try {
        const deletedComment = await comment_1.default.findByIdAndDelete(commentId);
        return deletedComment;
    }
    catch (error) {
        throw error;
    }
}
exports.deleteComment = deleteComment;
function getCommentsForBlog(blogId) {
    throw new Error('Function not implemented.');
}
exports.getCommentsForBlog = getCommentsForBlog;
