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
exports.populateBlogData = void 0;
const blogService = __importStar(require("../services/blogService"));
const mongoose_1 = __importDefault(require("mongoose"));
// Middleware to populate blog data for updating
const populateBlogData = async (req, res, next) => {
    const blogId = req.params.id;
    try {
        const blog = await blogService.getBlogById(mongoose_1.default.Types.ObjectId.createFromHexString(blogId));
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        req.blog = blog;
        next();
    }
    catch (err) {
        // Handle errors
        console.error('Error populating blog data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.populateBlogData = populateBlogData;
