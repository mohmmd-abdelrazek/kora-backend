"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = exports.errorHandler = exports.unknownEndpoint = exports.requestLogger = exports.validateSignup = void 0;
const express_validator_1 = require("express-validator");
exports.validateSignup = [
    (0, express_validator_1.body)('name').trim().not().isEmpty().withMessage('Name is required.'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address.'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
// Middleware to log requests
const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:  ', req.path);
    console.log('Body:  ', req.body);
    console.log('---');
    next();
};
exports.requestLogger = requestLogger;
// Middleware for handling unknown endpoints
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};
exports.unknownEndpoint = unknownEndpoint;
// Middleware for handling errors
const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'invalid token',
        });
    }
    next(error);
};
exports.errorHandler = errorHandler;
// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // Assuming Passport.js is used for authentication
        return next();
    }
    res.status(401).json({ error: 'Not authenticated' });
};
exports.isAuthenticated = isAuthenticated;
// Middleware to check if the user has an admin role
const isAdmin = (req, res, next) => {
    var _a;
    const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (req.isAuthenticated() && userRole === 'admin') {
        return next();
    }
    res.status(403).json({ error: 'Insufficient rights' });
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=middleware.js.map