import express from 'express';
import { getAllLikes } from '../controllers/likeController';

const likeRouter = express.Router();

// GET route to retrieve all likes for a blog
likeRouter.get('/:blogId/likes', getAllLikes);

export default likeRouter;
