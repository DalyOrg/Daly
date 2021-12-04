require('dotenv').config()
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin'
import { toHttp } from './common/toHttp';
import { CreateQuiz, GetQuiz, GetQuizLiked, UpdateQuiz, UpdateQuizLiked, GetComments, PostComment, GetLeaderboard, SubmitAttempt, DeleteQuiz } from './controllers/QuizController';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';
import {db} from './common/firestore';
import session from 'express-session';
import { GetPlatform, CreatePlatform } from './controllers/PlatformController';
import { GetUser, GetUserSubscription, GetUserSubscriptionFeed, UpdateUserSubscription, UpdateUser, GetOtherUser, DeleteUser } from './controllers/UserController';
import { GetTrendingFeed } from './controllers/RecommendationController';
import { SubmitSearch } from './controllers/SearchController';
import { GetItems } from './controllers/ItemController';
import { User } from './interfaces/user';
import { getData, postData } from './controllers/DatabaseController';
import { CreateReport, GetUserReports } from './controllers/ReportController';

const app = express();
const port = 8080;

//  app.use(express.json());
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true}));


app.use(cors({
  origin: true,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
}));

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy.OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
    try{
      const userQuery = await getData(`users`, {googleId: profile.id});
      console.log(userQuery)
      if(userQuery.length > 0){ // found one
        return done(null, userQuery[0]);
      }
      else{ 
        // create likes object
        let newLikes = {
          likes: []
        }
        let likeId = await postData(`likes`, newLikes);

        // create subscription feed object
        let newFeed = {
          feed: []
        }
        let feedId = await postData(`subscriptionFeeds`, newFeed);

        // create new default user
        let newUser = {
          googleId: profile.id,
          accountCreated: admin.firestore.Timestamp.now(),
          badges: 500,
          platformsOwned: [],
          itemsOwned: [{picUrl: "https://i.imgur.com/uHJU1hj.png", price: 100},{picUrl:"https://i.imgur.com/rnGQWYi.png", price: 80}],
          subscribedPlatforms: [],
          profileBanner: 'https://i.imgur.com/H4Dksdd.jpg', // white image
          profilePicture: 'https://i.imgur.com/gpOVR3I.png', // Creative Common default user icon
          username: profile.displayName,
          likeId: likeId,
          subscriptionFeedId: feedId
        }

        let userId = await postData(`users`, newUser);

        return done(null, {...newUser, id: userId});
      }
    } catch(err){
      done(err);
    }
  }
));

passport.serializeUser(function(user: User, done) {
  done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
  done(null, {id: userId});
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

// quiz
app.get('/quiz/:quizId/liked', toHttp(GetQuizLiked));
app.put('/quiz/:quizId/liked', toHttp(UpdateQuizLiked));

app.get('/quiz/:quizId/comments', toHttp(GetComments));
app.post('/quiz/:quizId/comments', toHttp(PostComment));

app.get('/quiz/:quizId/leaderboard', toHttp(GetLeaderboard));
app.post('/quiz/:quizId/leaderboard/attempt', toHttp(SubmitAttempt))

app.get('/quiz/:quizId', toHttp(GetQuiz));
app.put('/quiz/:quizId', toHttp(UpdateQuiz));
app.delete('/quiz/:quizId', toHttp(DeleteQuiz));

app.post('/quiz', toHttp(CreateQuiz));

// platform
app.get('/platform/:platformId/subscribed', toHttp(GetUserSubscription));
app.put('/platform/:platformId/subscribed', toHttp(UpdateUserSubscription));

app.get('/platform/:platformId', toHttp(GetPlatform));

app.post('/platform', toHttp(CreatePlatform));

// user
app.get('/user/feed', toHttp(GetUserSubscriptionFeed));

app.get('/user/:userId', toHttp(GetOtherUser));
app.put('/user/:userId', toHttp(UpdateUser));
app.delete('/user/:userId', toHttp(DeleteUser));

app.get('/user', toHttp(GetUser));

// shop
app.get('/shop/items', toHttp(GetItems));

// recommendations
app.get('/recommendations/trending', toHttp(GetTrendingFeed));

// search
app.post('/search', toHttp(SubmitSearch)); // POST search; GET search potentially for simpler queries

// report
app.get('/report/userReports', toHttp(GetUserReports));
app.post('/report', toHttp(CreateReport));

// upload
(app.post('/api/upload', async (req,res)=>{
  console.log("attempting to upload...");
  try{
    const fileStr = req.body.data;
    console.log(fileStr);
    const uploadedResponse = await cloudinary.uploader
    .upload(fileStr, {
      upload_preset: 'dev_setups',
      resource_type: "image"
    })
    .then((result) => {
      res.send({data: result.secure_url});
    });
  } catch (error){
    console.error(error);
    res.status(500).json({err: 'Something went wrong'})
  }
}));

// 404
app.get('*', async (req, res) => {
  res.status(404).json({message: 'URI path not found.'})
});

// error handling middleware
app.use(async (error: any, req: express.Request, res: express.Response, next) => {
  if(error.status && error.message){ // StdError
    res.status(error.status).json({message: error.message});
  }
  else{
    res.status(500).json({message: 'Unknown Error'});
  }
})

// start server
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});