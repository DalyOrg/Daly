import Question from '../components/Question'
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getQuiz } from '../adapters/quiz';

const Quiz = () => {
    const {quizId} = useParams();
    const [quiz, setQuiz] = useState();

    useEffect(() => {
        getQuiz(quizId).then((quiz) => {
            setQuiz(quiz);
        });
    });

    return (
        <div> 
            <h1>
                {quiz.name}
            </h1>
        </div>
    )
}

export default Quiz
