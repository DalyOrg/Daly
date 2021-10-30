import axios from 'axios';
import { wrapErrorHandling } from './common';

async function getUserAdapter(){
    try{
        let res = await axios.get(
            `/user`
        );
        console.log(res);
        return res.data; // User Object
    } catch(err){
        return {data: {}}
    }
}

async function getLogoutAdapter(){
    try{
        await axios.get(
            `/auth/logout`
        );
        return;
    } catch(err){
        console.log(err);
    }
}

export const getUser = wrapErrorHandling(getUserAdapter)
export const getLogout = wrapErrorHandling(getLogoutAdapter)
