import mongoose, { Schema, Document, Model } from 'mongoose';
import { addReply } from '../services/blogService';

interface CommentReply {
    content: string;
    author: string;
}

export interface CommentDocument extends Document {
    content: string;
    author: string;
    replies: CommentReply[];
    createdAt: Date;
}

export interface CommentModel extends Model<CommentDocument> {
    createComment(content: string, author: string): Promise<CommentDocument>;
    addReply(commentId: mongoose.Types.ObjectId, replyContent: string, loggedInUsername: string): Promise<CommentDocument | null>;
}

const commentSchema: Schema<CommentDocument, CommentModel> = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    replies: [{
        content: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

commentSchema.statics.createComment = async function(content: string, author: string): Promise<CommentDocument> {
    return this.create({ content, author });
};

commentSchema.statics.addReply = async function(commentId: mongoose.Types.ObjectId, replyContent: string, loggedInUsername: string): Promise<CommentDocument | null> {
    const comment = await this.findById(commentId).exec();
    if (!comment) {
        return null;
    }
    comment.replies.push({ content: replyContent, author: loggedInUsername });
    return comment.save();
};

const Comment = mongoose.model<CommentDocument, CommentModel>('Comment', commentSchema);

export default Comment;
