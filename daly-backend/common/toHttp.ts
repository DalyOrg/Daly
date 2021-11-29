import { Request, Response, NextFunction } from "express";

export function toHttp(controller: ((params: Object) => any), status = 200){
    return async function(req: Request, res: Response, next: NextFunction){
        try{
            let params = {...req.query, ...req.body, ...req.params, user: req.user};
            let ret = await controller(params);
            res.status(status).json(ret);
        } catch(err){
            return next(err);
        }
    }
}
