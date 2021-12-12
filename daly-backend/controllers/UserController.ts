import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { SubscriptionFeed, Subscriptions } from "../interfaces/subscriptions";
import { User } from "../interfaces/user"
import { getData, updateData } from "./DatabaseController";
import { GetPlatform } from "./PlatformController";


interface GetUserParams{
    user: User
}
export async function GetUser({user}: GetUserParams): Promise<User>{
  if(user === undefined){
    let err: StdError = {
      status: 401,
      message: 'Not logged in!'
    };
    throw err;
  }
  else{
    if(user.id){
      let userData = await getData(`users`, user.id);
      return userData;
    }
    else{
      let userQuery = await getData(`users`, {googleId: user.googleId});
      if(userQuery.length > 0){ // found one
        return userQuery;
      }
      else{
        let err: StdError = {
          status: 404,
          message: 'User could not be found!'
        };
        throw err;
      }
    }
  }
}


export async function DeleteUser({user}: GetUserParams){
  if(user === undefined){
    let err: StdError = {
      status: 401,
      message: 'Not logged in!'
    };
    throw err;
  }
  else{
      let userQuery;
      if(user.id){
        userQuery = await db.collection(`users`).doc(user.id).delete();
        return {message:"user data deleted!"};
      }
      else{
        userQuery = await db.collection(`users`).where('googleId', '==', user.googleId);
        userQuery.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          });
        });
      }
  }
}

interface GetOtherUserParams{
    userId: string
}
export async function GetOtherUser({userId}: GetOtherUserParams){
  try{
    let userData = await getData(`users`, userId) as User;
    let cleanData = {
      username: userData.username,
      profilePicture: userData.profilePicture,
      profileBanner: userData.profileBanner,
      itemsOwned: userData.itemsOwned,
      platformsOwned: userData.platformsOwned,
      subscribedPlatforms: userData.subscribedPlatforms

    };
    return cleanData;
  }
  catch(err){ // user is likely deleted
    return {
      username: '[deleted]',
      profilePicture: 'https://i.imgur.com/gpOVR3I.png',
      profileBanner:'https://i.imgur.com/H4Dksdd.jpg' 
    }
  }
}

interface UpdateUserParams{
    newUser: Object // subset of user to update
    user: User
  }
  export async function UpdateUser({newUser, user}: UpdateUserParams){
    let userData = await GetUser({user});
    await updateData(`users`, userData.id, newUser);
  
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
  await db.collection(`platforms`).doc(platformId).update("subscriberCount", subscriberData.subscriptions.length);
  console.log(subscriberData, platformId, platformData);
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

