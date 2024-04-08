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
/**
 * @swagger
 * components:
 *   schemas:
 *     ContactMessage:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *           description: First name of the contact.
 *         lastname:
 *           type: string
 *           description: Last name of the contact.
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the contact.
 *         phone:
 *           type: string
 *           pattern: '^\d{10}$'
 *           description: Phone number of the contact (10 digits).
 *         message:
 *           type: string
 *           description: Message content.
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - phone
 *         - message
 */
/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact message management
 */
// Create a new contact message
contactRouter.post('/addmessage', validateContactMessage, async (req, res) => {
    const { firstname, lastname, email, phone, message } = req.body;
    try {
        const newContact = await contactService.createContactMessage(firstname, lastname, email, phone, message);
        res.status(201).json(newContact);
    }
    catch (err) {
        console.error('Error creating contact message:', err);
        res.status(500).json({ error: 'An error occurred while creating contact message' });
    }
});
/**
 * @swagger
 * /api/addmessage:
 *   post:
 *     summary: Create a new contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessage'
 *     responses:
 *       '201':
 *         description: New contact message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       '400':
 *         description: Invalid request body format
 *       '500':
 *         description: Internal server error
 */
// Get all contact messages
contactRouter.get('/messages', async (_req, res) => {
    try {
        const contactMessages = await contactService.getAllContactMessages();
        res.status(200).json(contactMessages);
    }
    catch (err) {
        console.error('Error retrieving contact messages:', err);
        res.status(500).json({ error: 'An error occurred while retrieving contact messages' });
    }
});
/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Contact]
 *     responses:
 *       '200':
 *         description: List of all contact messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContactMessage'
 *       '500':
 *         description: Internal server error
 */
// Get a contact message by ID
contactRouter.get('/messages/:id', async (req, res) => {
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
});
/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get a contact message by ID
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact message to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Retrieved contact message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       '404':
 *         description: Contact message not found
 *       '500':
 *         description: Internal server error
 */
// Update a contact message
contactRouter.put('/messages/update/:id', validateContactMessage, async (req, res) => {
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
});
/**
 * @swagger
 * /api/messages/update/{id}:
 *   put:
 *     summary: Update a contact message
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact message to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessage'
 *     responses:
 *       '200':
 *         description: Updated contact message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       '404':
 *         description: Contact message not found
 *       '400':
 *         description: Invalid request body format
 *       '500':
 *         description: Internal server error
 */
// Delete a contact message
contactRouter.delete('/messages/delete/:id', async (req, res) => {
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
});
/**
 * @swagger
 * /api/messages/delete/{id}:
 *   delete:
 *     summary: Delete a contact message
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact message to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Contact message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       '404':
 *         description: Contact message not found
 *       '500':
 *         description: Internal server error
 */
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
