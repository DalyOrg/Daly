require('dotenv').config()
import express from 'express';
import cors from 'cors';
import { toHttp } from './common/toHttp';
import { CreateQuiz, GetQuiz, HelloWorld } from './controllers/QuizController';

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/', toHttp(HelloWorld));

app.get('/quiz/:quizId', toHttp(GetQuiz));
app.post('/quiz', toHttp(CreateQuiz));

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});