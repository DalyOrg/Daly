import axios from 'axios';
import { wrapErrorHandling } from './common';

async function getPlatformAdapter(platformId){
    console.log(platformId);
    let res = await axios.get(
        `/user/${platformId}`
    );
    console.log(res)
    return res.data; // Quiz Object
}

export const getPlatform = wrapErrorHandling(getPlatformAdapter)
