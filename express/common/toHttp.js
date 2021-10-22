import express from 'express';

export function toHttp(controller){
    return function(req, res, next){
        try{
            let ret = controller();
            res.send(ret);
        } catch(err){
            next(err);
        }
    }
}