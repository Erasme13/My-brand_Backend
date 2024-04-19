import express, { Request, Response } from 'express';
import * as blogService from '../services/blogService';
import mongoose from 'mongoose';
import { validateBlog } from './blogValidation';
import { isAdmin } from '../middleware/adminMiddleware';

const blogRouter = express.Router();

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
blogRouter.post('/addblog', isAdmin, validateBlog, async (req: Request, res: Response) => {
    const { title, content, photo } = req.body;
    try {
        const newBlog = await blogService.createBlog(title, content, photo);
        res.status(201).json({ message: 'Blog created successfully', data: newBlog });
    } catch (err) {
        handleRouteError(err, res);
    }
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
blogRouter.get('/blogs', async (req: Request, res: Response) => {
    try {
        const blogs = await blogService.getAllBlogs();
        res.status(200).json(blogs);
    } catch (err) {
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
blogRouter.get('/blog/:id', async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const blog = await blogService.getBlogById(mongoose.Types.ObjectId.createFromHexString(blogId));
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (err) {
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
blogRouter.put('/blog/update/:id', isAdmin, validateBlog, async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const update = req.body;
    try {
        const updatedBlog = await blogService.updateBlog(mongoose.Types.ObjectId.createFromHexString(blogId), update);
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog updated successfully', data: updatedBlog });
    } catch (err) {
        handleRouteError(err, res);
    }
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
blogRouter.delete('/blog/delete/:id', isAdmin, async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const deletedBlog = await blogService.deleteBlog(mongoose.Types.ObjectId.createFromHexString(blogId));
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully', data: deletedBlog });
    } catch (err) {
        handleRouteError(err, res);
    }
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
function handleRouteError(err: any, res: Response) {
    if (err instanceof Error) {
        res.status(500).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'An unknown error occurred' });
    }
}

export default blogRouter;
