import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { SubscriptionFeed, Subscriptions } from "../interfaces/subscriptions";
import { User } from "../interfaces/user"
import { getData, updateData } from "./DatabaseController";
import { DeletePlatform, GetPlatform } from "./PlatformController";
import {Quiz} from "../interfaces/quiz";
import { GetQuiz } from "./QuizController";


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

interface Likes{
  id: string
  likes: string[]
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
      var userObj = await GetUser({user:user}) as User;
      //delete platforms owned
      for(var i=0; i<userObj.platformsOwned.length; i++){
        try{
          console.log("deleting platform", userObj.platformsOwned[i]);
          await DeletePlatform({platformId:userObj.platformsOwned[i], user: userObj});
          console.log("deleting platform completed");
        }catch(err){
          console.log("platform already deleted")
        }
      }
      //unsubscribe from subscribed platforms, platform subscription number -1
      for(var i=0; i<userObj.subscribedPlatforms.length; i++){
        try{
          console.log("unsubscribing platform", userObj.subscribedPlatforms[i]);
          await UpdateUserSubscription({platformId:userObj.subscribedPlatforms[i], add: false, user: userObj});
          console.log("unsubscribing platform completed");
        }catch(err){
          console.log("platform already deleted, cannot unsubscibe");
        }
      }
      //delete likes from like id
      var likesQuery = await GetUserLikes({user:userObj}) as Likes;
      for(var i=0; i<likesQuery.likes.length; i++){
        try{
          console.log("unliking", likesQuery.likes[i]);
          var currentLikeCount = await GetQuiz({quizId: likesQuery.likes[i]}) as Quiz;
          await db.collection(`quizzes`).doc(likesQuery.likes[i]).update("likes", currentLikeCount.likes - 1);
          await UpdateUserLikes({quizId:likesQuery.likes[i], add:false, user:userObj});
          console.log("unliking completed");
        }catch(err){
          console.log("quiz does not exist, cannot unlike");
        }
      }

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
  let userData = await GetUser({user}) as User;
  let platformData = await GetPlatform({platformId}) as Platform;
  let subscriberData = await getData('subscriptions', platformData.subscribersId) as Subscriptions;
  if(add){
    subscriberData.subscriptions.push(userData.id);
    // async update feed
    const updateFeed = async () => {
      let quizToAdd = platformData.quizzes[platformData.quizzes.length - 1];
      let quizData = await GetQuiz({quizId: quizToAdd});
      let subscriptionFeed = await GetUserSubscriptionFeed({user});
      let newFeed = [];
      let added = false;
      console.log(subscriptionFeed.feed)
      for(let quiz of subscriptionFeed.feed){
        try{
          // @ts-ignore timestamp is actually a string; might be the case that the conversion fails so try catch is needed
          if (new Date(quiz.timestamp).getUTCSeconds() < new Date(quizData.timestamp).getUTCSeconds()){
            newFeed.push(quizToAdd);
            newFeed.push(quiz.id);
            added = true;
          }
          else{
            newFeed.push(quiz.id);
          }
        }
        catch{
          newFeed.push(quiz.id);
        }
      }
      if(!added){
        newFeed.push(quizToAdd);
      }
      console.log(newFeed);
      await updateData('subscriptionFeeds', userData.subscriptionFeedId, {feed: newFeed});
    }
    updateFeed();
  }
  else{
    subscriberData.subscriptions = subscriberData.subscriptions.filter((id) => id !== user.id);
    // async update feed
    const updateFeed = async () => {
      let subscriptionFeed = await GetUserSubscriptionFeed({user});
      let newFeed = subscriptionFeed.feed.filter((quiz) => quiz.platformId !== platformId);
      newFeed = newFeed.map((quizData) => quizData.id);
      await updateData('subscriptionFeeds', userData.subscriptionFeedId, {feed: newFeed});
    }
    updateFeed();
  }
  await updateData('subscriptions', platformData.subscribersId, subscriberData);
  await db.collection(`platforms`).doc(platformId).update("subscriberCount", subscriberData.subscriptions.length);
  return({message: 'Subscription Updated'})
}

interface GetUserSubscriptionFeedParams{
  user: User
}
export async function GetUserSubscriptionFeed({user}: GetUserSubscriptionFeedParams){
  let userData = await GetUser({user}) as User;
  let subscriberData = await getData('subscriptionFeeds', userData.subscriptionFeedId) as SubscriptionFeed;
  let retFeed = []
  let garbageQueue = []
  for(let quizId of subscriberData.feed){
    try{
      let quizData = await GetQuiz({quizId});
      retFeed.push(quizData);
    }
    catch {
      garbageQueue.push(quizId);
    }
  }
  if(garbageQueue.length > 0){
    let newFeed = subscriberData.feed.filter((id) => !garbageQueue.includes(id));
    await updateData('subscriptionFeeds', userData.subscriptionFeedId, {feed: newFeed})
  }
  return({feed: retFeed});
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

