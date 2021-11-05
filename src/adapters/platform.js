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

export const getPlatform = wrapErrorHandling(getPlatformAdapter)
