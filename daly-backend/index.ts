require('dotenv').config()
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin'
import { toHttp } from './common/toHttp';
import { CreateQuiz, GetQuiz, HelloWorld } from './controllers/QuizController';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';
import {db} from './common/firestore';
import session from 'express-session';
import { GetPlatform } from './controllers/PlatformController';

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

app.get('/', toHttp(HelloWorld));

app.get('/quiz/:quizId', toHttp(GetQuiz));
app.post('/quiz', toHttp(CreateQuiz));

app.get('/platform/:platformId', toHttp(GetPlatform));

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
      else{ // create new user
        let newUser = {
          googleId: profile.id,
          accountCreated: admin.firestore.Timestamp.now(),
          badges: 0,
          profileBanner: 'https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg', // white image
          profilePicture: 'https://freesvg.org/img/abstract-user-flat-4.png', // Creative Common default user icon
          username: profile.displayName
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

app.get('/user',
  (req, res) => {
    console.log(req.user)
    if(!req.user){
      res.status(401).json({message: 'Not logged in!'})
    }
    else{
      res.json(req.user)
    }
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});