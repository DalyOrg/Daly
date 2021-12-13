import axios from 'axios';
import { wrapErrorHandling } from './common';

async function deleteUserAdapter(userData){
    try{
        let body = { user: userData };
        await axios.delete(
            `/user/${userData.id}`, body
        );
    }catch(err){
    }
}

async function getUserAdapter(){
    try{
        let res = await axios.get(
            `/user`
        );
        return res.data; // User Object
    } catch(err){
        return {data: {}}
    }
}

async function getOtherUserAdapter(userId){
    let res = await axios.get(
        `/user/${userId}`
    );
    return res.data; // User Object
}

async function getLogoutAdapter(){
    try{
        await axios.get(
            `/auth/logout`
        );
        return;
    } catch(err){
    }
}

async function getSubscriptionFeedAdapter(){
    let res = await axios.get(
        `/user/feed`
    );
    return res.data;
}

async function putUserAdapter(user){
    let body = { newUser: user };
    let res = await axios.put(`/user/${user.id}`, body)
    return res.data;
}

export const getUser = getUserAdapter // don't want to display unauthorized error
export const putUser = wrapErrorHandling(putUserAdapter)
export const getLogout = wrapErrorHandling(getLogoutAdapter)
export const getSubscriptionFeed = wrapErrorHandling(getSubscriptionFeedAdapter)
export const getOtherUser = wrapErrorHandling(getOtherUserAdapter)
export const deleteUser = wrapErrorHandling(deleteUserAdapter)
