import mongoose, {Schema, Document} from 'mongoose';

export interface CommentDocument extends Document {
    content: string;
    author: string;
}

const commentSchema: Schema<CommentDocument> = new Schema ({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        ref: 'User',
        required: true
      }
});

const Comment = mongoose.model<CommentDocument>('Comment', commentSchema);

export default Comment;