"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (err instanceof Error) {
        console.error(err.stack);
        let statusCode = 500;
        if (err.name === 'ValidationError') {
            statusCode = 400;
        }
        res.status(statusCode).json({ error: err.message });
    }
    else {
        console.error('Unknown error:', err);
        res.status(500).json({ error: 'An unknown error occurred' });
    }
};
exports.default = errorHandler;
