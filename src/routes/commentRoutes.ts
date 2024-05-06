import express from 'express';
import { submitComment, submitReply } from '../controllers/commentController';
import { validateComment } from '../middleware/commentValidation';

const commentRouter = express.Router();

// POST route to submit a new comment for a specific blog
commentRouter.post('/:blogId/addcomment', validateComment, submitComment);

// POST route to submit a reply to a specific comment
commentRouter.post('/:commentId/reply', submitReply);

export default commentRouter;
