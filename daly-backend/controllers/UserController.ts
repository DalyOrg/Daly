import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { Subscriptions } from "../interfaces/subscriptions";
import { User } from "../interfaces/user"
import { getData, updateData } from "./DatabaseController";
import { GetPlatform } from "./PlatformController";


interface GetUserParams{
    user: User
}
export async function GetUser({user}: GetUserParams){
    if(user === undefined){
        return({status: 401, message: 'Not logged in!'}) // TODO refactor error handling system
    }
    else{
        const userQuery = await db.collection(`users`).where('googleId', '==', user.googleId).get();
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

interface GetUserSubscriptionParams{
  platformId: string
  user: User
}
export async function GetUserSubscription({platformId, user}: GetUserSubscriptionParams){
  let platformData = await GetPlatform({platformId}) as Platform;
  let subscriberData = await getData('subscriptions', platformData.subscribersId) as Subscriptions;
  await updateData('subscriptions', platformData.subscribersId, subscriberData);
  return({isSubscribed: subscriberData.subscriptions.includes(user.id)});
}

interface UpdateUserSubscriptionParams{
  platformId: string
  add: boolean
  user: User
}
export async function UpdateUserSubscription({platformId, add, user}: UpdateUserSubscriptionParams){
  let platformData = await GetPlatform({platformId}) as Platform;
  let subscriberData = await getData('subscriptions', platformData.subscribersId) as Subscriptions;
  if(add){
    subscriberData.subscriptions.push(user.id);
  }
  else{
    subscriberData.subscriptions = subscriberData.subscriptions.filter((id) => id !== user.id);
  }
  await updateData('subscriptions', platformData.subscribersId, subscriberData);
  return({message: 'Subscription Updated'})
}

interface GetUserSubscriptionFeedParams{
  platformId: string
  user: User
}
export async function GetUserSubscriptionFeed({platformId, user}: GetUserSubscriptionParams){
  let platformData = await GetPlatform({platformId}) as Platform;
  let subscriberData = await getData('subscriptions', platformData.subscribersId) as Subscriptions;
  await updateData('subscriptions', platformData.subscribersId, subscriberData);
  return({isSubscribed: subscriberData.subscriptions.includes(user.id)});
}

