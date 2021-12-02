import axios from 'axios';
import { wrapErrorHandling } from './common';

  async function uploadUserImageAdapter(image){
    let body = {data: image};
    try{
        let res = await axios.post(
            `/api/upload`, body
        );
        console.log({message: "Image uploaded"});
        return res.data;
    }catch(err){
        console.log("image upload error", err)
    }
}

  export const uploadUserImage = wrapErrorHandling(uploadUserImageAdapter);