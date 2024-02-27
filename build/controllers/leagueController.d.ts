import { Request, Response } from "express";
export declare const createLeague: (req: Request, res: Response) => Promise<void>;
export declare const getLeague: (req: Request, res: Response) => Promise<void>;
export declare const getLeagues: (req: Request, res: Response) => Promise<void>;
export declare const generateSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
