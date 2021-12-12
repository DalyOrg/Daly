import axios from 'axios';
import { wrapErrorHandling } from './common';

export async function getPlatformAdapter(platformId){
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
        let body = { platformId:platformId };
        let res = await axios.delete(
            `/platform/${platformId}`, body
        );
        console.log({message: "Platform deleted!"});
}

async function putPlatformBannerAdapter(platformId, banner){
    let body = { platformId: platformId, platformBanner: banner };
    let res = await axios.put(`/platform/${platformId}/platformBanner`, body)
    return res.data;
}

async function putPlatformPicAdapter(platformId, pic){
    let body = { platformId: platformId, platformPic: pic };
    let res = await axios.put(`/platform/${platformId}/platformPicture`, body)
    return res.data;
}

async function putPlatformNameAdapter(platformId, name){
    let body = { platformId: platformId, name: name };
    let res = await axios.put(`/platform/${platformId}/platformName`, body)
    return res.data;
}

export const putPlatformName = wrapErrorHandling(putPlatformNameAdapter);
export const putPlatformPic = wrapErrorHandling(putPlatformPicAdapter);
export const putPlatformBanner = wrapErrorHandling(putPlatformBannerAdapter);
export const deletePlatform = wrapErrorHandling(deletePlatformAdapter);
export const postPlatform = wrapErrorHandling(postPlatformAdapter);
export const getPlatform = wrapErrorHandling(getPlatformAdapter)
export const getPlatformSubscribed = wrapErrorHandling(getPlatformSubscribedAdapter);
export const putPlatformSubscribed = wrapErrorHandling(putPlatformSubscribedAdapter)
