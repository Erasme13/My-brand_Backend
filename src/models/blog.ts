import mongoose, {Schema, Document} from "mongoose";

export interface BlogDocument extends Document {
    title: String;
    content: String;
    author: String;
}

const blogSchema: Schema<BlogDocument> = new Schema ({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3, 
        maxlength: 100
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: "HOZIYANA Erasme"
    }
});

const Blog = mongoose.model<BlogDocument>('Blog', blogSchema);

export default Blog;