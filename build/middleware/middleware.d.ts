import { Request, Response, NextFunction } from 'express';
export declare const validateSignup: (import("express-validator").ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>))[];
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const unknownEndpoint: (req: Request, res: Response) => void;
export declare const errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const isAuthenticated: (req: Request, res: Response, next: NextFunction) => void;
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => void;
