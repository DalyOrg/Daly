const Results = ({answerChoices}) => {
    function calculate(){
        let correct = 0;
        for(let question in answerChoices){
            if(answerChoices[question].correctAnswer)
                correct++;
        }
        return (correct/answerChoices.length) *100;
    }

    return (
        <div>
            <h3>Results</h3>
            <p>Score: {calculate()}%</p>
        </div>
    )
}

export default Results