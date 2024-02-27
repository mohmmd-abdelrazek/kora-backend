import { Request, Response } from "express";
export declare const signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => void;
export declare const logout: (req: Request, res: Response) => void;
export declare const googleCallback: any;
export declare const status: (req: Request, res: Response) => void;
