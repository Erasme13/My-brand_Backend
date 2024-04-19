import express, { Request, Response } from 'express';
import * as contactService from '../services/contactService';
import Joi from 'joi';

const contactRouter = express.Router();

// Joi schema for validating contact message data
const contactSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(new RegExp(/^\d{10}$/)).required(),
    message: Joi.string().required()
});

// Middleware to validate contact message data
const validateContactMessage = (req: Request, res: Response, next: any) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Create a new contact message
export const createContactMessage = async (req: Request, res: Response) => {
    const { firstname, lastname, email, phone, message } = req.body;
    try {
        const newContact = await contactService.createContactMessage(firstname, lastname, email, phone, message);
        res.status(201).json(newContact);
    } catch (err) {
        console.error('Error creating contact message:', err);
        res.status(500).json({ error: 'An error occurred while creating contact message' });
    }
};

// Get all contact messages
export const getAllContactMessages = async (_req: Request, res: Response) => {
    try {
        const contactMessages = await contactService.getAllContactMessages();
        res.status(200).json(contactMessages);
    } catch (err) {
        console.error('Error retrieving contact messages:', err);
        res.status(500).json({ error: 'An error occurred while retrieving contact messages' });
    }
};

// Get a contact message by ID
export const getContactMessageById = async (req: Request, res: Response) => {
    const contactId = req.params.id;
    try {
        const contactMessage = await contactService.getContactMessageById(contactId);
        if (!contactMessage) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.status(200).json(contactMessage);
    } catch (err) {
        handleRouteError(err, res);
    }
};

// Update a contact message
export const updateContactMessage = async (req: Request, res: Response) => {
    const contactId = req.params.id;
    const update = req.body;
    try {
        const updatedContactMessage = await contactService.updateContactMessage(contactId, update);
        if (!updatedContactMessage) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.status(200).json(updatedContactMessage);
    } catch (err) {
        handleRouteError(err, res);
    }
};

// Delete a contact message
export const deleteContactMessage = async (req: Request, res: Response) => {
    const contactId = req.params.id;
    try {
        const deletedContactMessage = await contactService.deleteContactMessage(contactId);
        if (!deletedContactMessage) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.status(200).json(deletedContactMessage);
    } catch (err) {
        handleRouteError(err, res);
    }
};

// Function to handle errors in Routes 
function handleRouteError(err: any, res: Response) {
    if (err instanceof Error) {
        res.status(500).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'An unknown error occurred' });
    }
}

export default contactRouter;
