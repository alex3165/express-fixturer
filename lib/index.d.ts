/// <reference types="express" />
import { Request, Response, NextFunction } from 'express';
export interface Parameters {
    saveRoutes: boolean | string[];
    fixtureRoutes: boolean | string[];
    fixtureBasePath: string;
    hashFn: (req: Request) => number | string;
}
export declare const createHash: (obj: object) => string;
declare const middlewareFactory: (opts: Parameters) => (req: Request, res: Response, next: NextFunction) => void;
export default middlewareFactory;
