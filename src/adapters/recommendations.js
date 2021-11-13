import axios from "axios";
import {wrapErrorHandling} from "./common"

async function getTrendingFeedAdapter(){
    let res = await axios.get(
        `/recommendations/trending`,
    );
    console.log(res)
    return res.data; // Quiz Object Array
}

export const getTrendingFeed = wrapErrorHandling(getTrendingFeedAdapter);