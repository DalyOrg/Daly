import axios from 'axios';

function wrapErrorHandling(adapter){
    return function(){
        try{
            adapter(getQuiz)
        } catch(err){
            // do stuff
        }
    }
}

async function getQuiz(quizId){
    let res = await axios.get(
        'url/api'
    );
    res.data = 'json we want';
    return res.data;
}

