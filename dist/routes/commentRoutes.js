"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const commentValidation_1 = require("../middleware/commentValidation");
const commentRouter = express_1.default.Router();
// POST route to submit a new comment for a specific blog
commentRouter.post('/:blogId/addcomment', commentValidation_1.validateComment, commentController_1.submitComment);
// POST route to submit a reply to a specific comment
commentRouter.post('/:commentId/reply', commentController_1.submitReply);
exports.default = commentRouter;
