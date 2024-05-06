import Blog, { BlogDocument } from '../models/blog';
import mongoose from 'mongoose';
import Comment, { CommentDocument } from '../models/comment';

export async function createBlog(title: string, content: string, photo: string): Promise<BlogDocument> {
    const newBlog = new Blog({
        title,
        content,
        photo
    });
    return await newBlog.save();
}

export async function getAllBlogs(): Promise<BlogDocument[]> {
    return await Blog.find().exec();
}

export async function getBlogById(blogId: mongoose.Types.ObjectId): Promise<BlogDocument | null> {
    try {
        const blog = await Blog.findById(blogId).exec();
        return blog;
    } catch (error) {
        throw new Error('Error retrieving blog');
    }
}

export async function updateBlog(blogId: mongoose.Types.ObjectId, update: Partial<BlogDocument>): Promise<BlogDocument | null> {
    try {
        const blogData = await getBlogById(blogId);
        if (!blogData) {
            throw new Error('Blog not found');
        }

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, update, { new: true }).exec();
        return updatedBlog;
    } catch (error) {
        throw new Error('Error updating blog');
    }
}

export async function deleteBlog(blogId: mongoose.Types.ObjectId): Promise<BlogDocument | null> {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(blogId).exec();
        return deletedBlog;
    } catch (error) {
        throw new Error('Error deleting blog');
    }
}

export async function addComment(blogId: mongoose.Types.ObjectId, commentContent: string, loggedInUsername: string): Promise<BlogDocument | null> {
    try {
        const blog = await Blog.findById(blogId).exec();
        if (!blog) {
            throw new Error('Blog not found');
        }

        // Create a new comment using the createComment function from the Comment model
        const newComment = await Comment.createComment(commentContent, loggedInUsername);

        // Push the comment's ID to the blog's comments array
        blog.comments.push(newComment._id);

        // Save the updated blog
        const updatedBlog = await blog.save();
        return updatedBlog;
    } catch (error) {
        throw new Error('Error adding comment');
    }
}

export async function addReply(commentId: mongoose.Types.ObjectId, replyContent: string, loggedInUsername: string): Promise<CommentDocument | null> {
    try {
        const comment = await Comment.findById(commentId).exec();
        if (!comment) {
            throw new Error('Comment not found');
        }

        // Add the reply to the comment's replies array
        comment.replies.push({ content: replyContent, author: loggedInUsername });

        // Save the updated comment
        const updatedComment = await comment.save();
        return updatedComment;
    } catch (error) {
        throw new Error('Error adding reply');
    }
}

export async function toggleLike(blogId: mongoose.Types.ObjectId, userId: string): Promise<BlogDocument | null> {
    try {
        const blog = await Blog.findById(blogId).exec();
        if (!blog) {
            throw new Error('Blog not found');
        }

        const userIndex = blog.likes.indexOf(userId);
        if (userIndex === -1) {
            blog.likes.push(userId);
        } else {
            blog.likes.splice(userIndex, 1);
        }

        const updatedBlog = await blog.save();
        return updatedBlog;
    } catch (error) {
        throw new Error('Error toggling like');
    }
}
