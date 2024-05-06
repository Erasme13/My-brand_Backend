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
const express_1 = __importDefault(require("express"));
const blogService = __importStar(require("../services/blogService"));
const mongoose_1 = __importDefault(require("mongoose"));
const blogValidation_1 = require("./blogValidation");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const blogRouter = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the blog
 *         content:
 *           type: string
 *           description: Content of the blog
 *         photo:
 *           type: string
 *           description: Link to the photo associated with the blog
 */
// Create a new blog
blogRouter.post('/addblog', adminMiddleware_1.isAdmin, blogValidation_1.validateBlog, async (req, res) => {
    const { title, content, photo } = req.body;
    const newBlog = await blogService.createBlog(title, content, photo);
    res.status(201).json({ message: 'Blog created successfully', data: newBlog });
});
/**
 * @swagger
 * /api/addblog:
 *   post:
 *     summary: Create a new blog post
 *     description: Create a new blog post with the provided title, content, and photo.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       '201':
 *         description: Blog post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request. Invalid blog data provided.
 */
// Get all blogs
blogRouter.get('/blogs', async (req, res) => {
    try {
        const blogs = await blogService.getAllBlogs();
        res.status(200).json(blogs);
    }
    catch (err) {
        handleRouteError(err, res);
    }
});
/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieve a list of all blogs.
 *     tags: [Blog]
 *     responses:
 *       '200':
 *         description: A list of blogs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
// Get a blog by ID
blogRouter.get('/blog/:id', async (req, res) => {
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
});
/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     description: Retrieve a single blog post by its ID.
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the blog post to retrieve.
 *     responses:
 *       '200':
 *         description: A single blog post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '404':
 *         description: Blog not found.
 */
// Update a blog
blogRouter.put('/blog/update/:id', adminMiddleware_1.isAdmin, blogValidation_1.validateBlog, async (req, res) => {
    const blogId = req.params.id;
    const update = req.body;
    const updatedBlog = await blogService.updateBlog(mongoose_1.default.Types.ObjectId.createFromHexString(blogId), update);
    if (!updatedBlog) {
        return res.status(404).json({ message: 'Blog not found or you do not have permission to update this blog' });
    }
    res.status(200).json({ message: 'Blog updated successfully', data: updatedBlog });
});
/**
 * @swagger
 * /api/blog/update/{id}:
 *   put:
 *     summary: Update a blog post
 *     description: Update an existing blog post with the provided ID.
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the blog post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       '200':
 *         description: Blog post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request. Invalid blog data provided.
 *       '404':
 *         description: Blog not found.
 */
// Delete a blog
blogRouter.delete('/blog/delete/:id', adminMiddleware_1.isAdmin, async (req, res) => {
    const blogId = req.params.id;
    const deletedBlog = await blogService.deleteBlog(mongoose_1.default.Types.ObjectId.createFromHexString(blogId));
    if (!deletedBlog) {
        return res.status(404).json({ message: 'Blog not found or you do not have permission to delete this blog' });
    }
    res.status(200).json({ message: 'Blog deleted successfully', data: deletedBlog });
});
/**
 * @swagger
 * /api/blog/delete/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     description: Delete an existing blog post with the provided ID.
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the blog post to delete.
 *     responses:
 *       '200':
 *         description: Blog post deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '404':
 *         description: Blog not found.
 */
// Function to handle errors in Routes 
function handleRouteError(err, res) {
    if (err instanceof Error) {
        res.status(500).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'An unknown error occurred' });
    }
}
exports.default = blogRouter;
