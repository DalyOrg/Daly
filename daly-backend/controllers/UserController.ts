import { db } from "../common/firestore";
import { User } from "../interfaces/user"


interface GetUserParams{
    user: User
}
export async function GetUser({user}: GetUserParams){
    console.log(user)
    if(!user){
        return({status: 401, message: 'Not logged in!'}) // TODO refactor error handling system
    }
    else{
        const userQuery = await db.collection(`users`).where('googleId', '==', user.id).get();
        if(userQuery.docs.length > 0){ // found one
          return {...userQuery.docs[0].data(), id: userQuery.docs[0].id};
        }
    }
}

interface GetUserLikesParams{
    user: User
}
export async function GetUserLikes({user}: GetUserLikesParams){
    let userData: any = await GetUser({user});
    if(userData.id){
        let likeId = userData.likeId;
        const likesDoc = await db.collection(`likes`).doc(likeId).get();
        return {...likesDoc.data(), id: likesDoc.id}
    }
    else{
        return({status: 401, message: 'Not logged in!'}) // TODO refactor error handling system
    }
}

interface UpdateUserLikesParams{
    quizId: string,
    add: boolean,
    user: User
}
export async function UpdateUserLikes({quizId, add, user}: UpdateUserLikesParams){
    let likeData: any = await GetUserLikes({user});
    if(likeData.likes){
        if(add){
            likeData.likes.push(quizId);
        }
        else{
            likeData.likes = likeData.likes.filter((id) => id !== quizId)
        }
        const res = await db.collection(`likes`).doc(likeData.id).set(likeData);
        return {message: 'Likes Updated'}
    }
    else{
        return({status: 401, message: 'Not logged in!'}) // TODO refactor error handling system
    }
}

