import mongoose, { Schema, Document } from "mongoose"; 

// Interface representing contact Document

interface ContactDocument extends Document {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    message: string;
    createdAt: Date;
}

const contactSchema = new Schema ({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    email: {type: String, required: true},
    message: { type: String, required: true},
    phone: { type: String, required: true},
    createdAt: { type: Date, default: Date.now }
});

const Contact =mongoose.model<ContactDocument>('Contact', contactSchema);

export { Contact, ContactDocument };