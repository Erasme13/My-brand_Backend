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
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const blogService = __importStar(require("../services/blogService"));
const mongoose_1 = __importDefault(require("mongoose"));
// Function to handle errors in Routes
function handleRouteError(err, res) {
    if (err instanceof Error) {
        res.status(500).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'An unknown error occurred' });
    }
}
// Create a new blog
const createBlog = async (req, res) => {
    const { title, content, author } = req.body;
    try {
        const newBlog = await blogService.createBlog(title, content, author);
        res.status(201).json({ message: 'Blog created successfully', data: newBlog });
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.createBlog = createBlog;
// Get all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogService.getAllBlogs();
        res.status(200).json(blogs);
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.getAllBlogs = getAllBlogs;
// Get a blog by ID
const getBlogById = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blog = await blogService.getBlogById(mongoose_1.default.Types.ObjectId.createFromHexString(blogId));
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.getBlogById = getBlogById;
// Update a blog
const updateBlog = async (req, res) => {
    const blogId = req.params.id;
    const update = req.body;
    try {
        const updatedBlog = await blogService.updateBlog(mongoose_1.default.Types.ObjectId.createFromHexString(blogId), update);
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog updated successfully', data: updatedBlog });
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.updateBlog = updateBlog;
// Delete a blog
const deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    try {
        const deletedBlog = await blogService.deleteBlog(mongoose_1.default.Types.ObjectId.createFromHexString(blogId));
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully', data: deletedBlog });
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.deleteBlog = deleteBlog;
