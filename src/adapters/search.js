import axios from 'axios';
import { wrapErrorHandling } from './common';

async function postSearchAdapter(query){
    console.log(query);
    let body = {
        query: query
    }
    let res = await axios.put(
        `/search/${query}`,
        body
    );
    console.log(res)
    return res.data;
}

export const postSearch = wrapErrorHandling(postSearchAdapter);