import { Request, Response } from "express";
export declare const submitPlayer: (req: Request, res: Response) => Promise<void>;
export declare const getPlayer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePlayer: (req: Request, res: Response) => Promise<void>;
export declare const deletePlayer: (req: Request, res: Response) => Promise<void>;
