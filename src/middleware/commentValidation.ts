import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import Blog from '../models/blog.js';
import mongoose from 'mongoose';

// Define Joi schema for reply and comment
const replySchema = Joi.object({
    content: Joi.string().required(),
});

const commentSchema = Joi.object({
  content: Joi.string().required(),
  replies: Joi.array().items(replySchema)
}).unknown(true);

// Middleware to validate comment
const validateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
      // Extract token from request headers
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).json({ message: 'Unauthorized' });
      }

      let decodedToken;
      try {
          // Verify the token using the secret key
          decodedToken = jwt.verify(token, process.env.JWT_SECRET || '') as { username: string };
      } catch (error) {
          // If token verification fails, return an error response
          return res.status(403).json({ message: 'Invalid token' });
      }

      // Add the username from the token to the request body
      req.body.author = decodedToken.username;

      // Validate the comment schema
      const validationResult = commentSchema.validate(req.body, { abortEarly: false });
      if (validationResult.error) {
          const errorMessage = validationResult.error.details.map((detail) => detail.message).join('; ');
          return res.status(400).json({ message: errorMessage });
      }

      // Check if the blogId in the request parameters is valid
      const { blogId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
          return res.status(400).json({ message: 'Invalid blogId format' });
      }

      // Find the blog by its ID
      const article = await Blog.findById(blogId);
      if (!article) {
          return res.status(404).json({ message: 'The specified article does not exist' });
      }
      
      // If all validations pass, proceed to the next middleware
      next();
  } catch (err) {
      // Handle any unexpected errors
      console.error('Error validating comment:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
};

export { validateComment };
