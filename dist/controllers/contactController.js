"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactMessage = exports.updateContactMessage = exports.getContactMessageById = exports.getAllContactMessages = exports.createContactMessage = void 0;
const express_1 = __importDefault(require("express"));
const contactService = __importStar(require("../services/contactService"));
const joi_1 = __importDefault(require("joi"));
const contactRouter = express_1.default.Router();
// Joi schema for validating contact message data
const contactSchema = joi_1.default.object({
    firstname: joi_1.default.string().required(),
    lastname: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().pattern(new RegExp(/^\d{10}$/)).required(),
    message: joi_1.default.string().required()
});
// Middleware to validate contact message data
const validateContactMessage = (req, res, next) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
// Create a new contact message
const createContactMessage = async (req, res) => {
    const { firstname, lastname, email, phone, message } = req.body;
    try {
        const newContact = await contactService.createContactMessage(firstname, lastname, email, phone, message);
        res.status(201).json(newContact);
    }
    catch (err) {
        console.error('Error creating contact message:', err);
        res.status(500).json({ error: 'An error occurred while creating contact message' });
    }
};
exports.createContactMessage = createContactMessage;
// Get all contact messages
const getAllContactMessages = async (_req, res) => {
    try {
        const contactMessages = await contactService.getAllContactMessages();
        res.status(200).json(contactMessages);
    }
    catch (err) {
        console.error('Error retrieving contact messages:', err);
        res.status(500).json({ error: 'An error occurred while retrieving contact messages' });
    }
};
exports.getAllContactMessages = getAllContactMessages;
// Get a contact message by ID
const getContactMessageById = async (req, res) => {
    const contactId = req.params.id;
    try {
        const contactMessage = await contactService.getContactMessageById(contactId);
        if (!contactMessage) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.status(200).json(contactMessage);
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.getContactMessageById = getContactMessageById;
// Update a contact message
const updateContactMessage = async (req, res) => {
    const contactId = req.params.id;
    const update = req.body;
    try {
        const updatedContactMessage = await contactService.updateContactMessage(contactId, update);
        if (!updatedContactMessage) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.status(200).json(updatedContactMessage);
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.updateContactMessage = updateContactMessage;
// Delete a contact message
const deleteContactMessage = async (req, res) => {
    const contactId = req.params.id;
    try {
        const deletedContactMessage = await contactService.deleteContactMessage(contactId);
        if (!deletedContactMessage) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.status(200).json(deletedContactMessage);
    }
    catch (err) {
        handleRouteError(err, res);
    }
};
exports.deleteContactMessage = deleteContactMessage;
// Function to handle errors in Routes 
function handleRouteError(err, res) {
    if (err instanceof Error) {
        res.status(500).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'An unknown error occurred' });
    }
}
exports.default = contactRouter;
