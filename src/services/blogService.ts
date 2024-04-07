import Blog, { BlogDocument } from '../models/blog';
import mongoose from 'mongoose';

export async function createBlog(title: string, content: string, author: String): Promise<BlogDocument> {
    const newBlog = new Blog({
        title,
        content,
        author
    });
    return await newBlog.save();
}

export async function getAllBlogs(): Promise<BlogDocument[]> {
    return await Blog.find().exec();
}

export async function getBlogById(blogId: mongoose.Types.ObjectId): Promise<BlogDocument | null> {
    return await Blog.findById(blogId).exec();
}

export async function updateBlog(blogId: mongoose.Types.ObjectId, update: Partial<BlogDocument>): Promise<BlogDocument | null> {
    return await Blog.findByIdAndUpdate(blogId, update, { new: true }).exec();
}

export async function deleteBlog(blogId: mongoose.Types.ObjectId): Promise<BlogDocument | null> {
    return await Blog.findByIdAndDelete(blogId).exec();
}