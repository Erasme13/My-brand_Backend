import mongoose, { Schema, Document } from "mongoose";

export interface BlogDocument extends Document {
    title: string;
    photo: string;
    content: string;
    author: string;
    likes: number;
    comments: string[];
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
    likes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

const Blog = mongoose.model<BlogDocument>('Blog', blogSchema);

export default Blog;
