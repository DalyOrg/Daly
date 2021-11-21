require('dotenv').config()
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin'
import { toHttp } from './common/toHttp';
import { CreateQuiz, GetQuiz, GetQuizLiked, HelloWorld, UpdateQuiz, UpdateQuizLiked, GetComments, PostComment, GetLeaderboard, SubmitAttempt } from './controllers/QuizController';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';
import {db} from './common/firestore';
import session from 'express-session';
import { GetPlatform, CreatePlatform } from './controllers/PlatformController';
import { GetUser, GetUserSubscription, GetUserSubscriptionFeed, UpdateUserSubscription, UpdateUser, GetOtherUser, DeleteUser } from './controllers/UserController';
import { GetTrendingFeed } from './controllers/RecommendationController';
import { SubmitSearch } from './controllers/SearchController';

const app = express();
const port = 8080;

//  app.use(express.json()); //changed by Qiting
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({//TODO: should we put all this in env file
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

app.get('/quiz/:quizId/comments', toHttp(GetComments));
app.post('/quiz/:quizId/comments', toHttp(PostComment));

app.get('/quiz/:quizId/leaderboard', toHttp(GetLeaderboard));
app.post('/quiz/:quizId/leaderboard/attempt', toHttp(SubmitAttempt))

app.get('/platform/:platformId', toHttp(GetPlatform));
app.post('/platform', toHttp(CreatePlatform));

app.get('/platform/:platformId/subscribed', toHttp(GetUserSubscription));
app.put('/platform/:platformId/subscribed', toHttp(UpdateUserSubscription));
app.put('/user/:userId', toHttp(UpdateUser));

app.get('/user', toHttp(GetUser));
app.get('/user/:userId', toHttp(GetOtherUser));
app.get('/user/feed', toHttp(GetUserSubscriptionFeed));
app.delete('/user/:userId', toHttp(DeleteUser));

app.get('/recommendations/trending', toHttp(GetTrendingFeed));

app.post('/search', toHttp(SubmitSearch)); // POST search; GET search potentially for simpler queries

(app.post('/api/upload', async (req,res)=>{//Qiting's test code
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

// app.get('/api/images', async (req, res)=>{
//   const {resources} = await cloudinary.search.expression
//   ('folder:dev_setups')
//   .sort_by('public_id', 'desc')
//   .max_results(30)
//   .execute();
//   const publicIds = resources.map (file => file.public_id);
//   res.send(publicIds);
// })

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});