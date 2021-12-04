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

async function getPlatformSubscribedAdapter(platformId){
    let res = await axios.get(
        `/platform/${platformId}/subscribed`
    );
    console.log(res)
    return res.data; // {isSubscribed: true/false}
}

async function putPlatformSubscribedAdapter(platformId, add){
    let body = {
        quizId: platformId,
        add: add
    }
    let res = await axios.put(
        `/platform/${platformId}/subscribed`,
        body
    );
    console.log(res)
    return res.data;
}

async function deletePlatformAdapter(platformId){
    try{
        let body = { platformId:platformId };
        let res = await axios.delete(
            `/platform/${platformId}`, body
        );
        console.log({message: "Platform deleted!"});
    }catch(err){
        console.log("Platform delete error", err)
    }
}

export const deletePlatform = wrapErrorHandling(deletePlatformAdapter);
export const postPlatform = wrapErrorHandling(postPlatformAdapter);
export const getPlatform = wrapErrorHandling(getPlatformAdapter)
export const getPlatformSubscribed = wrapErrorHandling(getPlatformSubscribedAdapter);
export const putPlatformSubscribed = wrapErrorHandling(putPlatformSubscribedAdapter)
