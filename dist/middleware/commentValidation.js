"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateComment = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blog_js_1 = __importDefault(require("../models/blog.js"));
const mongoose_1 = __importDefault(require("mongoose"));
// Define Joi schema for reply and comment
const replySchema = joi_1.default.object({
    content: joi_1.default.string().required(),
});
const commentSchema = joi_1.default.object({
    content: joi_1.default.string().required(),
    replies: joi_1.default.array().items(replySchema)
}).unknown(true);
// Middleware to validate comment
const validateComment = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        let decodedToken;
        try {
            // Verify the token using the secret key
            decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        }
        catch (error) {
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
        if (!mongoose_1.default.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: 'Invalid blogId format' });
        }
        // Find the blog by its ID
        const article = await blog_js_1.default.findById(blogId);
        if (!article) {
            return res.status(404).json({ message: 'The specified article does not exist' });
        }
        // If all validations pass, proceed to the next middleware
        next();
    }
    catch (err) {
        // Handle any unexpected errors
        console.error('Error validating comment:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.validateComment = validateComment;
