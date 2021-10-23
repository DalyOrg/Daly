import express from 'express';
import { toHttp } from './common/toHttp';
import { HelloWorld } from './controllers/QuizController';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', toHttp(HelloWorld));

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});