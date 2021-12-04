import axios from "axios";
import {wrapErrorHandling} from "./common"

async function getUserReportsAdapter(){
    let res = await axios.get(
        `/report/userReports`,
    );
    console.log(res)
    return res.data;
}

async function postReportAdapter(reason, description, metadata){
    let body = {
        reason, description, metadata
    }
    let res = await axios.post(
        `/report`,
        body
    );
    console.log(res)
    return res.data;
}

export const getUserReports = wrapErrorHandling(getUserReportsAdapter);
export const postReport = wrapErrorHandling(postReportAdapter);