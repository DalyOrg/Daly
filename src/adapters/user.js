import axios from 'axios';
import { wrapErrorHandling } from './common';

async function deleteUserAdapter(userData){
    console.log("attempting to delete user data...");
    try{
        let body = { user: userData };
        let res = await axios.delete(
            `/user/${userData.id}`, body
        );
        console.log({message: "User data deleted!"});
    }catch(err){
        console.log("user delete error", err)
    }
}

async function getUserAdapter(){
    try{
        let res = await axios.get(
            `/user`
        );
        console.log(res);
        return res.data; // User Object
    } catch(err){
        return {data: {}}
    }
}

async function getOtherUserAdapter(userId){
    let res = await axios.get(
        `/user/${userId}`
    );
    console.log(res);
    return res.data; // User Object
}

async function getLogoutAdapter(){
    try{
        await axios.get(
            `/auth/logout`
        );
        return;
    } catch(err){
        console.log(err);
    }
}

async function getSubscriptionFeedAdapter(){
    let res = await axios.get(
        `/user/feed`
    );
    console.log(res);
    return res.data;
}

async function putUserAdapter(user){
    console.log(user);
    let body = { newUser: user };
    let res = await axios.put(`/user/${user.id}`, body)
    console.log(res);
    return res.data;
}

export const getUser = wrapErrorHandling(getUserAdapter)
export const putUser = wrapErrorHandling(putUserAdapter)
export const getLogout = wrapErrorHandling(getLogoutAdapter)
export const getSubscriptionFeed = wrapErrorHandling(getSubscriptionFeedAdapter)
export const getOtherUser = wrapErrorHandling(getOtherUserAdapter)
export const deleteUser = wrapErrorHandling(deleteUserAdapter)
