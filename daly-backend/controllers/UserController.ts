import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { SubscriptionFeed, Subscriptions } from "../interfaces/subscriptions";
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
        let userQuery;
        if(user.id){
          userQuery = await db.collection(`users`).doc(user.id).get();
          return {...userQuery.data(), id: userQuery.id};
        }
        else{
          userQuery = await db.collection(`users`).where('googleId', '==', user.googleId).get();
          if(userQuery.docs.length > 0){ // found one
            return {...userQuery.docs[0].data(), id: userQuery.docs[0].id};
          }
        }
    }
}

interface GetOtherUserParams{
    userId: string
}
export async function GetOtherUser({userId}: GetOtherUserParams){
  console.log(userId);
  let userData = (await db.collection(`users`).doc(userId).get()).data() as User;
  let cleanData = {
    username: userData.username,
    profilePicture: userData.profilePicture,
    profileBanner: userData.profileBanner
  };
  return cleanData;
}

interface UpdateUserParams{
    userId: string
    newUser: Object // subset of user to update
  }
  export async function UpdateUser({userId, newUser}: UpdateUserParams){
    console.log(newUser);
    const res = await db.collection(`users`).doc(userId).update(newUser);
  
    console.log(res)
    // check if res is fine then send a confirmation message
    return { message: 'User Updated' };
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
  console.log(platformData);
  let subscriberData = await getData('subscriptions', platformData.subscribersId) as Subscriptions;
  console.log(subscriberData);
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
  user: User
}
export async function GetUserSubscriptionFeed({user}: GetUserSubscriptionFeedParams){
  let userData = await GetUser({user}) as User;
  let subscriberData = await getData('subscriptionFeeds', userData.subscriptionFeedId) as SubscriptionFeed;
  return(subscriberData);
}

interface UpdateUserSubscriptionFeedParams{
  newQuizId: string
  add: boolean
  user: User
}
export async function UpdateUserSubscriptionFeed({newQuizId, add, user}: UpdateUserSubscriptionFeedParams){
  let userData = await GetUser({user}) as User;
  let subscriptionFeed = await GetUserSubscriptionFeed({user}) as SubscriptionFeed;
  let newFeed;
  if(add){
    newFeed = [newQuizId, ...subscriptionFeed.feed];
  }
  else{
    newFeed = subscriptionFeed.feed.filter((quizId) => quizId !== newQuizId);
  }
  let res = await updateData('subscriptionFeeds', userData.subscriptionFeedId, {feed: newFeed});
  return({message: 'Feed Updated'});
}

