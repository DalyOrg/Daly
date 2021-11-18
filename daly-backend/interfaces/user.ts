import { Timestamp } from "firebase-admin/firestore";

export interface User{
    id: string
    googleId: string
    accountCreated: Timestamp
    username: string
    badges: number
    interestsId: string
    platformsOwned: string[]
    subscribedPlatforms: string[]
    subscriptionsId: string
    subscriptionFeedId: string
    likesId: string
    profilePicture: string
    profileBanner: string
    rewardsUnlocked: {
        rewardId: string
        level: number
    }[]
}