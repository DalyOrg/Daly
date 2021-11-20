import axios from 'axios';
import { wrapErrorHandling } from './common';

async function postSearchAdapter(query){
    console.log(query);
    let body = {
        query: query
    }
    let res = await axios.post(
        `/search`,
        body
    );
    console.log(res.data)
    return res.data;
}

export const postSearch = wrapErrorHandling(postSearchAdapter);