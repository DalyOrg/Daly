require('dotenv').config()
import express from 'express';
import { toHttp } from './common/toHttp';
import { GetQuiz, HelloWorld } from './controllers/QuizController';

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', toHttp(HelloWorld));

app.get('/quiz/:quizId', toHttp(GetQuiz));

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});