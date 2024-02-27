import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';


export const validateSignup = [
  body('name').trim().not().isEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware to log requests
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
};

// Middleware for handling unknown endpoints
export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

// Middleware for handling errors
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    });
  }

  next(error);
};

// Middleware to check if the user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  
  if (req.isAuthenticated()) { // Assuming Passport.js is used for authentication
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Middleware to check if the user has an admin role
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  if (req.isAuthenticated() && userRole === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Insufficient rights' });
};
