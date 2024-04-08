import mongoose, { Schema, Model, Document } from 'mongoose';

export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    rememberMe?: boolean;
}

const userSchema: Schema<UserDocument> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 40
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        match: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}$/
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    rememberMe: {
        type: Boolean
    }
});

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);

export default User;
