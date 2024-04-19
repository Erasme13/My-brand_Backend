import mongoose, { Schema, Document } from 'mongoose';

export interface BlacklistedTokenDocument extends Document {
    token: string;
    createdAt: Date;
}

const blacklistedTokenSchema: Schema<BlacklistedTokenDocument> = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d', 
    },
});

const BlacklistedToken = mongoose.model<BlacklistedTokenDocument>('BlacklistedToken', blacklistedTokenSchema);

export default BlacklistedToken;
