"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const blog_1 = __importDefault(require("../models/blog"));
async function createBlog(title, content, author) {
    const newBlog = new blog_1.default({
        title,
        content,
        author
    });
    return await newBlog.save();
}
exports.createBlog = createBlog;
async function getAllBlogs() {
    return await blog_1.default.find().exec();
}
exports.getAllBlogs = getAllBlogs;
async function getBlogById(blogId) {
    return await blog_1.default.findById(blogId).exec();
}
exports.getBlogById = getBlogById;
async function updateBlog(blogId, update) {
    return await blog_1.default.findByIdAndUpdate(blogId, update, { new: true }).exec();
}
exports.updateBlog = updateBlog;
async function deleteBlog(blogId) {
    return await blog_1.default.findByIdAndDelete(blogId).exec();
}
exports.deleteBlog = deleteBlog;
