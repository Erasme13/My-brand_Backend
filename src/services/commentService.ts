import Joi from 'joi';
import Comment, { CommentDocument } from '../models/comment';

// Joi schema for validating comment data
const commentSchema = Joi.object({
    content: Joi.string().required(),
    author: Joi.string().required()
});

// Validate comment data
function validateCommentData(data: any): Joi.ValidationResult {
    return commentSchema.validate(data);
}

// Create a new comment
export async function createComment(content: string, author: string): Promise<CommentDocument> {
    try {
        // Validate comment data
        const { error } = validateCommentData({ content, author });
        if (error) {
            throw new Error(error.details[0].message);
        }

        const newComment: CommentDocument = await Comment.create({ content, author });
        return newComment;
    } catch (error) {
        throw error;
    }
}

// Get all comments
export async function getAllComments(): Promise<CommentDocument[]> {
    try {
        const comments: CommentDocument[] = await Comment.find();
        return comments;
    } catch (error) {
        throw error;
    }
}

// Get comment by ID
export async function getCommentById(commentId: string): Promise<CommentDocument | null> {
    try {
        const comment: CommentDocument | null = await Comment.findById(commentId);
        return comment;
    } catch (error) {
        throw error;
    }
}

// Update comment
export async function updateComment(commentId: string, update: any): Promise<CommentDocument | null> {
    try {
        const updatedComment: CommentDocument | null = await Comment.findByIdAndUpdate(commentId, update, { new: true });
        return updatedComment;
    } catch (error) {
        throw error;
    }
}

// Delete comment
export async function deleteComment(commentId: string): Promise<CommentDocument | null> {
    try {
        const deletedComment: CommentDocument | null = await Comment.findByIdAndDelete(commentId);
        return deletedComment;
    } catch (error) {
        throw error;
    }
}

export function getCommentsForBlog(blogId: string) {
    throw new Error('Function not implemented.');
}
