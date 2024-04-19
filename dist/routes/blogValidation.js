"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlog = void 0;
const joi_1 = __importDefault(require("joi"));
// Define Joi schema for validating blog data
const blogSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).max(100).required(),
    photo: joi_1.default.string().uri().allow(null).optional(),
    content: joi_1.default.string().required(),
    author: joi_1.default.string(),
});
// Validation middleware function to validate incoming blog data
const validateBlog = (req, res, next) => {
    const { error } = blogSchema.validate(req.body);
    if (error) {
        // Return validation error response
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateBlog = validateBlog;
