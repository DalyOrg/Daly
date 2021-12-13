import axios from "axios";
import {wrapErrorHandling} from "./common"

async function getItemsAdapter(){
    let res = await axios.get(
        `/shop/items`,
    );
    return res.data;
}

export const getItems = wrapErrorHandling(getItemsAdapter);