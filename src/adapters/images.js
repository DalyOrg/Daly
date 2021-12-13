import axios from 'axios';
import { wrapErrorHandling } from './common';

  async function uploadUserImageAdapter(image){
    let body = {data: image};
    try{
        let res = await axios.post(
            `/api/upload`, body
        );
        return res.data;
    }catch(err){
    }
}

  export const uploadUserImage = wrapErrorHandling(uploadUserImageAdapter);