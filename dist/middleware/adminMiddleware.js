"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const user = req.user;
    if (user && user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ error: 'Unauthorized' });
    }
};
exports.isAdmin = isAdmin;
