"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    let token;
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const parts = authorizationHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }
    if (!token) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token. Please log in again.' });
        }
        const { id, username, isAdmin } = decoded;
        req.userId = id;
        req.lUsername = username;
        req.isAdmin = isAdmin;
        next();
    });
};
exports.verifyToken = verifyToken;
exports.JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
