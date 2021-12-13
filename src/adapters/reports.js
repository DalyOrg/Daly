import axios from "axios";
import {wrapErrorHandling} from "./common"

async function getUserReportsAdapter(){
    let res = await axios.get(
        `/report/userReports`,
    );
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
    return res.data;
}

export const getUserReports = wrapErrorHandling(getUserReportsAdapter);
export const postReport = wrapErrorHandling(postReportAdapter);