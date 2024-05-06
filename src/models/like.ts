import mongoose, { Schema, Document } from 'mongoose';

export interface LikeDocument extends Document {
    userId: string;
}

const likeSchema: Schema<LikeDocument> = new Schema({
    userId: {
        type: String,
        required: true,
    }
});

const Like = mongoose.model<LikeDocument>('Like', likeSchema);

export default Like;
