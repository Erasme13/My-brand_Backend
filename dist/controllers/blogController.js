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
exports.deleteBlog = exports.updateBlog = exports.createBlog = void 0;
const blogService = __importStar(require("../services/blogService"));
const mongoose_1 = __importDefault(require("mongoose"));
const blogValidation_1 = require("../routes/blogValidation");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
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
const createBlog = async (req, res, next) => {
    const { title, content, photo } = req.body;
    try {
        // Validate input data
        (0, blogValidation_1.validateBlog)(req, res, next);
        // Check if user is an admin
        (0, adminMiddleware_1.isAdmin)(req, res, async () => {
            if (typeof req.userId !== 'string') {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const newBlog = await blogService.createBlog(title, content, photo);
            res.status(201).json({ message: 'Blog created successfully', data: newBlog });
        });
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.createBlog = createBlog;
// Update a blog
const updateBlog = async (req, res) => {
    const blogId = req.params.id;
    const update = req.body;
    try {
        // Check if user is an admin
        (0, adminMiddleware_1.isAdmin)(req, res, async () => {
            if (typeof req.userId !== 'string') {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const updatedBlog = await blogService.updateBlog(mongoose_1.default.Types.ObjectId.createFromHexString(blogId), update);
            if (!updatedBlog) {
                return res
                    .status(404)
                    .json({ message: 'Blog not found or you do not have permission to update this blog' });
            }
            res.status(200).json({ message: 'Blog updated successfully', data: updatedBlog });
        });
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
        // Check if user is an admin
        (0, adminMiddleware_1.isAdmin)(req, res, async () => {
            if (typeof req.userId !== 'string') {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            const deletedBlog = await blogService.deleteBlog(mongoose_1.default.Types.ObjectId.createFromHexString(blogId));
            if (!deletedBlog) {
                return res
                    .status(404)
                    .json({ message: 'Blog not found or you do not have permission to delete this blog' });
            }
            res.status(200).json({ message: 'Blog deleted successfully', data: deletedBlog });
        });
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.deleteBlog = deleteBlog;
