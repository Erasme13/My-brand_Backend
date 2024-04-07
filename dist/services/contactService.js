"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactMessage = exports.updateContactMessage = exports.getContactMessageById = exports.getAllContactMessages = exports.createContactMessage = void 0;
const contact_1 = require("../models/contact");
// Create a new contact message
async function createContactMessage(firstname, lastname, email, phone, message) {
    const newContact = new contact_1.Contact({
        firstname,
        lastname,
        email,
        phone,
        message
    });
    return await newContact.save();
}
exports.createContactMessage = createContactMessage;
// Retrieve all contact messages
async function getAllContactMessages() {
    return await contact_1.Contact.find().exec();
}
exports.getAllContactMessages = getAllContactMessages;
// Retrieve a contact message by its ID
async function getContactMessageById(contactId) {
    return await contact_1.Contact.findById(contactId).exec();
}
exports.getContactMessageById = getContactMessageById;
// Update a contact message
async function updateContactMessage(contactId, update) {
    return await contact_1.Contact.findByIdAndUpdate(contactId, update, { new: true }).exec();
}
exports.updateContactMessage = updateContactMessage;
// Delete a contact message
async function deleteContactMessage(contactId) {
    return await contact_1.Contact.findByIdAndDelete(contactId).exec();
}
exports.deleteContactMessage = deleteContactMessage;
