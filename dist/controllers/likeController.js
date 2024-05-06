"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLikes = void 0;
const blog_1 = __importDefault(require("../models/blog"));
async function getAllLikes(req, res) {
    const blogId = req.params.blogId;
    try {
        const blog = await blog_1.default.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const likesCount = blog.likes.length;
        return res.status(200).json({ likes: likesCount });
    }
    catch (error) {
        console.error('Error getting likes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.getAllLikes = getAllLikes;
