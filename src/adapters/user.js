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

export const getUser = wrapErrorHandling(getUserAdapter)
