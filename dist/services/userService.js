"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.createUser = void 0;
const user_1 = __importDefault(require("../models/user"));
// Function to create a new user
async function createUser(username, email, password, rememberMe = false) {
    const newUser = new user_1.default({ username, email, password });
    return await newUser.save();
}
exports.createUser = createUser;
// Function to retrieve a user by email
async function getUserByEmail(email) {
    return await user_1.default.findOne({ email }).exec();
}
exports.getUserByEmail = getUserByEmail;
