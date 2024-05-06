import mongoose, { Schema, Document } from 'mongoose';
import { CommentDocument } from './comment';
import { LikeDocument } from './like';

export interface BlogDocument extends Document {
    title: string;
    photo: string;
    content: string;
    author: string;
    likes: string[]; // Change the type to string array
    comments: CommentDocument[]; // Change the type to CommentDocument array
}

const blogSchema: Schema<BlogDocument> = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    photo: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: "HOZIYANA Erasme"
    },
    likes: [{ // Define likes as array of strings
        type: Schema.Types.ObjectId,
        ref: 'Like'
    }],
    comments: [{ // Define comments as array of CommentDocument
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

const Blog = mongoose.model<BlogDocument>('Blog', blogSchema);

export default Blog;
