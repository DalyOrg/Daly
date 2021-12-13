const Results = ({answerMap}) => {
    function calculateScore(){
        let sum = 0;
        for(let question in answerMap){
            if(answerMap[question].correctAnswer)
                sum++;
        }
        return sum;
    }

    return (
        <div>
            <h3>
                Results
            </h3>
            <span>
                Score: {calculateScore()}
            </span>
        </div>
    )
}

export default Results
