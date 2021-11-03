import { Request, Response, NextFunction } from "express";

export function toHttp(controller: ((params: Object) => Object)){
    return async function(req: Request, res: Response, next: NextFunction){
        try{
            let params = {...req.query, ...req.body, ...req.params, user: req.user};
            let ret = await controller(params);
            console.log(ret)
            res.json(ret);
        } catch(err){
            next(err);
        }
    }
}
