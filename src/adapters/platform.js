import axios from 'axios';
import { wrapErrorHandling } from './common';

async function getPlatformAdapter(platformId){
    console.log(platformId);
    let res = await axios.get(
        `/platform/${platformId}`
    );
    console.log(res)
    return res.data; 
}


async function postPlatformAdapter(platformObject){
    console.log(platformObject);
    let body = { newPlatform: platformObject };
    console.log(body);
    let res = await axios.post(
        `/platform`, body
    );
    console.log(res);
    return res.data;
}



export const postPlatform = wrapErrorHandling(postPlatformAdapter);
export const getPlatform = wrapErrorHandling(getPlatformAdapter)
