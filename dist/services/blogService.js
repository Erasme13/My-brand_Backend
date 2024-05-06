"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLike = exports.addReply = exports.addComment = exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const blog_1 = __importDefault(require("../models/blog"));
const comment_1 = __importDefault(require("../models/comment"));
async function createBlog(title, content, photo) {
    const newBlog = new blog_1.default({
        title,
        content,
        photo
    });
    return await newBlog.save();
}
exports.createBlog = createBlog;
async function getAllBlogs() {
    return await blog_1.default.find().exec();
}
exports.getAllBlogs = getAllBlogs;
async function getBlogById(blogId) {
    try {
        const blog = await blog_1.default.findById(blogId).exec();
        return blog;
    }
    catch (error) {
        throw new Error('Error retrieving blog');
    }
}
exports.getBlogById = getBlogById;
async function updateBlog(blogId, update) {
    try {
        const blogData = await getBlogById(blogId);
        if (!blogData) {
            throw new Error('Blog not found');
        }
        const updatedBlog = await blog_1.default.findByIdAndUpdate(blogId, update, { new: true }).exec();
        return updatedBlog;
    }
    catch (error) {
        throw new Error('Error updating blog');
    }
}
exports.updateBlog = updateBlog;
async function deleteBlog(blogId) {
    try {
        const deletedBlog = await blog_1.default.findByIdAndDelete(blogId).exec();
        return deletedBlog;
    }
    catch (error) {
        throw new Error('Error deleting blog');
    }
}
exports.deleteBlog = deleteBlog;
async function addComment(blogId, commentContent, loggedInUsername) {
    try {
        const blog = await blog_1.default.findById(blogId).exec();
        if (!blog) {
            throw new Error('Blog not found');
        }
        // Create a new comment using the createComment function from the Comment model
        const newComment = await comment_1.default.createComment(commentContent, loggedInUsername);
        // Push the comment's ID to the blog's comments array
        blog.comments.push(newComment._id);
        // Save the updated blog
        const updatedBlog = await blog.save();
        return updatedBlog;
    }
    catch (error) {
        throw new Error('Error adding comment');
    }
}
exports.addComment = addComment;
async function addReply(commentId, replyContent, loggedInUsername) {
    try {
        const comment = await comment_1.default.findById(commentId).exec();
        if (!comment) {
            throw new Error('Comment not found');
        }
        // Add the reply to the comment's replies array
        comment.replies.push({ content: replyContent, author: loggedInUsername });
        // Save the updated comment
        const updatedComment = await comment.save();
        return updatedComment;
    }
    catch (error) {
        throw new Error('Error adding reply');
    }
}
exports.addReply = addReply;
async function toggleLike(blogId, userId) {
    try {
        const blog = await blog_1.default.findById(blogId).exec();
        if (!blog) {
            throw new Error('Blog not found');
        }
        const userIndex = blog.likes.indexOf(userId);
        if (userIndex === -1) {
            blog.likes.push(userId);
        }
        else {
            blog.likes.splice(userIndex, 1);
        }
        const updatedBlog = await blog.save();
        return updatedBlog;
    }
    catch (error) {
        throw new Error('Error toggling like');
    }
}
exports.toggleLike = toggleLike;
