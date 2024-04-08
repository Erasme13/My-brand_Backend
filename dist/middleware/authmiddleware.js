"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserForClient = exports.getUserByEmail = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
}
exports.authenticateToken = authenticateToken;
async function getUserByEmail(email) {
    return await user_1.default.findOne({ email }).exec();
}
exports.getUserByEmail = getUserByEmail;
async function getUserForClient(email) {
    const user = await getUserByEmail(email);
    if (user) {
        return { username: user.username, isAdmin: user.role === 'admin' };
    }
    return null;
}
exports.getUserForClient = getUserForClient;
