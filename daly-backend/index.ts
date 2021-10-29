require('dotenv').config()
import express from 'express';
import cors from 'cors';
import { toHttp } from './common/toHttp';
import { CreateQuiz, GetQuiz, HelloWorld } from './controllers/QuizController';
import passport from 'passport';

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/', toHttp(HelloWorld));

app.get('/quiz/:quizId', toHttp(GetQuiz));
app.post('/quiz', toHttp(CreateQuiz));
app.post('login', passport.authenticate('google'),
(req: any, res: any) => {
  if (req.user) {
    console.log(req.user.username);
    res.redirect('/users/'+req.user.username);
  }
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});