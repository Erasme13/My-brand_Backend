"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const user_1 = __importDefault(require("/models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function loginUser(email, password) {
    try {
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return null;
        }
        // Compare passwords
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return null;
        }
        return user;
    }
    catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}
exports.loginUser = loginUser;
