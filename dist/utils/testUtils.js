"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
async function clearUsersFromDatabase() {
    try {
        await user_1.default.deleteMany({});
    }
    catch (error) {
        console.error('Error clearing users from database:', error);
        throw error;
    }
}
exports.default = clearUsersFromDatabase;
