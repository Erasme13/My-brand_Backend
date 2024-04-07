import { Contact, ContactDocument } from '../models/contact';

// Create a new contact message
export async function createContactMessage(firstname: string, lastname: string, email: string,phone: string, message: string): Promise<ContactDocument> {
    const newContact = new Contact({
        firstname,
        lastname,
        email,
        phone,
        message
    });
    return await newContact.save();
}

// Retrieve all contact messages
export async function getAllContactMessages(): Promise<ContactDocument[]> {
    return await Contact.find().exec();
}

// Retrieve a contact message by its ID
export async function getContactMessageById(contactId: string): Promise<ContactDocument | null> {
    return await Contact.findById(contactId).exec();
}

// Update a contact message
export async function updateContactMessage(contactId: string, update: Partial<ContactDocument>): Promise<ContactDocument | null> {
    return await Contact.findByIdAndUpdate(contactId, update, { new: true }).exec();
}

// Delete a contact message
export async function deleteContactMessage(contactId: string): Promise<ContactDocument | null> {
    return await Contact.findByIdAndDelete(contactId).exec();
}
