import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define Joi schema for validating blog data
const blogSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    photo: Joi.string().uri().allow(null).optional(),
    content: Joi.string().required(),
    author: Joi.string(),
});

// Validation middleware function to validate incoming blog data
export const validateBlog = (req: Request, res:Response, next: NextFunction) => {
    const { error } = blogSchema.validate(req.body);
    if (error) {
        // Return validation error response
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
