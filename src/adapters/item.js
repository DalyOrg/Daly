import axios from "axios";
import {wrapErrorHandling} from "./common"

async function getItemsAdapter(){
    let res = await axios.get(
        `/shop/items`,
    );
    console.log(res)
    return res.data;
}

export const getItems = wrapErrorHandling(getItemsAdapter);