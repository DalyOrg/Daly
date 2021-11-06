import { Request, Response, NextFunction } from "express";

export function toHttp(controller: ((params: Object) => any)){
    return async function(req: Request, res: Response, next: NextFunction){
        try{
            let params = {...req.query, ...req.body, ...req.params, user: req.user};
            let ret = await controller(params);
            console.log(ret);
            if(ret.status){
                res.status(ret.status);
            }
            else{
                res.status(200);
            }
            res.json(ret);
        } catch(err){
            next(err);
        }
    }
}
