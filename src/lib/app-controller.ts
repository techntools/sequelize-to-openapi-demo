import { Router, Request, Response, NextFunction } from 'express';

import { AsyncRequestHandler } from '../lib/types';


export default class AppController {
    public basePath: string

    public router: Router = Router()

    static asyncHandler = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next).catch(next)
    }
}
