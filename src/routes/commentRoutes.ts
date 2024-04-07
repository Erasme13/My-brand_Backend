import express, { Request, Response } from 'express';
import Comment, { CommentDocument } from '../models/comment';

const commentRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment.
 *         author:
 *           type: string
 *           description: The ID of the user who authored the comment.
 */


// Create a new comment
commentRouter.post('/addcomment', async (req: Request, res: Response) => {
    try {
        const { content, author } = req.body;
        
        // Create new comment
        const newComment: CommentDocument = await Comment.create({
            content,
            author
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/addcomment:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment.
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       '201':
 *         description: A new comment is created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Internal server error
 */

// Get all comments
commentRouter.get('/comments', async (req: Request, res: Response) => {
    try {
        const comments: CommentDocument[] = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve all comments.
 *     tags: [Comments]
 *     responses:
 *       '200':
 *         description: A list of comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Internal server error
 */

// Get comment by ID
commentRouter.get('/comments/:id', async (req: Request, res: Response) => {
    const commentId = req.params.id;
    try {
        const comment: CommentDocument | null = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Retrieve a comment by its ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to retrieve.
 *     responses:
 *       '200':
 *         description: A comment object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */


// Update comment
commentRouter.put('/comments/update/:id', async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const update = req.body;
    try {
        const updatedComment: CommentDocument | null = await Comment.findByIdAndUpdate(commentId, update, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/comments/update/{id}:
 *   put:
 *     summary: Update a comment
 *     description: Update a comment by its ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       '200':
 *         description: Updated comment object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */


// Delete comment
commentRouter.delete('/comments/delete/:id', async (req: Request, res: Response) => {
    const commentId = req.params.id;
    try {
        const deletedComment: CommentDocument | null = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/comments/delete/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment by its ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to delete.
 *     responses:
 *       '200':
 *         description: Comment deleted successfully.
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */

export default commentRouter;
