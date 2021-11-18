require('dotenv').config()
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin'
import { toHttp } from './common/toHttp';
import { CreateQuiz, GetQuiz, GetQuizLiked, HelloWorld, UpdateQuiz, UpdateQuizLiked } from './controllers/QuizController';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';
import {db} from './common/firestore';
import session from 'express-session';
import { GetPlatform, CreatePlatform } from './controllers/PlatformController';
import { GetUser, GetUserSubscription, GetUserSubscriptionFeed, UpdateUserSubscription, UpdateUser } from './controllers/UserController';
import { GetTrendingFeed } from './controllers/RecommendationController';

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(session({
  secret: 'keyboard cat',
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy.OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log(profile.emails)
    try{
      const userQuery = await db.collection(`users`).where('googleId', '==', profile.id).get();
      if(userQuery.docs.length > 0){ // found one
        return done(null, {...userQuery.docs[0].data(), id: userQuery.docs[0].id});
      }
      else{ 
        // create likes object
        let newLikes = {
          likes: []
        }
        const likesRes = await db.collection(`likes`).add(newLikes);
        let likeId = (await likesRes.get()).id;

        // create subscription feed object
        let newFeed = {
          feed: []
        }
        const feedRes = await db.collection(`subscriptionFeeds`).add(newFeed);
        let feedId = (await feedRes.get()).id;

        // create new user
        let newUser = {
          googleId: profile.id,
          accountCreated: admin.firestore.Timestamp.now(),
          badges: 0,
          platformsOwned: [],
          subscribedPlatforms: [],
          profileBanner: 'https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg', // white image
          profilePicture: 'https://freesvg.org/img/abstract-user-flat-4.png', // Creative Common default user icon
          username: profile.displayName,
          likeId: likeId,
          subscriptionFeedId: feedId
        }

        const res = await db.collection(`users`).add(newUser);
        let id = (await res.get()).id;

        return done(null, {...newUser, id: id});
      }
    } catch(err){
      done(err)
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/error' }),
  function(req, res) {
    res.redirect(`${process.env.FRONTEND_URL}/home`);
});

app.get('/auth/logout',
  function(req, res){
    req.session.destroy(function(err){
      console.log(err);
    });
    res.status(200);
});

app.get('/', toHttp(HelloWorld));

app.post('/quiz', toHttp(CreateQuiz));

app.get('/quiz/:quizId', toHttp(GetQuiz));
app.put('/quiz/:quizId', toHttp(UpdateQuiz));

app.get('/quiz/:quizId/liked', toHttp(GetQuizLiked));
app.put('/quiz/:quizId/liked', toHttp(UpdateQuizLiked));

app.get('/platform/:platformId', toHttp(GetPlatform));
app.post('/platform', toHttp(CreatePlatform));

app.get('/platform/:platformId/subscribed', toHttp(GetUserSubscription));
app.put('/platform/:platformId/subscribed', toHttp(UpdateUserSubscription));
app.put('/user/:userId', toHttp(UpdateUser));

app.get('/user', toHttp(GetUser));
app.get('/user/feed', toHttp(GetUserSubscriptionFeed));

app.get('/recommendations/trending', toHttp(GetTrendingFeed));

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});