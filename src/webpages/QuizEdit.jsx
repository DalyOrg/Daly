import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router"
import { getQuiz } from "../adapters/quiz"
import { MDBCardBody, MDBBtn } from 'mdb-react-ui-kit';
import { PencilFill, TrashFill } from 'react-bootstrap-icons';

const QuizEdit = () => {
    const { quizId } = useParams()
    const [quiz, setQuiz] = useState()

    const initQuiz = useCallback(async function(){
        let quizData = await getQuiz(quizId)
        setQuiz(quizData)
    }, [quizId])

    useEffect(() => {
        initQuiz()
    }, [initQuiz])

    // Popup Hooks
    async function editBanner(){
    }

    async function editName(){
    }

    async function editTimeLimit(){
    }

    async function addCategory(){
    }

    async function addQuestion(){
    }

    async function editQuestion(indx){
        // indx = index of question in quiz.questions
    }

    async function deleteQuestion(indx){
        // indx = index of question in quiz.questions
    }

    async function publishQuiz(){
        // hint: use PUT /quiz/:quizId
    }

    async function deleteQuiz(){
        // do not implement yet
    }

    return (
        <>{ quiz &&
        <div>
            <div className="platformBanner mb-3"
                style={{
                    backgroundSize: 'cover',
                    backgroundImage:`url(${quiz.backgroundImage})`
                }}
            >
                <span className="changeBannerButton"
                    onClick={editBanner}
                >
                    <MDBBtn style={{backgroundColor: "#00B5FF"}}>
                        Edit Banner Picture
                    </MDBBtn>
                </span> 
            </div>

            <div className="container"
                style={{color: 'white'}}
            >
                <div className="d-flex mb-3">
                        <div className="d-flex me-auto">
                            <span 
                                className="me-3"
                                style={{fontSize: "25px"}}
                            >
                                {quiz.name}
                            </span>
                            <MDBBtn rounded size='sm' style={{backgroundColor: "#00B5FF"}}
                                onClick={editName}
                            >
                                <PencilFill color="white" size={20}/>
                            </MDBBtn>
                        </div>
                        <div className="d-flex">
                            <span 
                                className="me-3"
                                style={{fontSize: "25px", color:'yellow'}}
                            >
                                Time Limit: {`${quiz.timeLimitSeconds / 60}:${(quiz.timeLimitSeconds % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}`}
                            </span>
                            <MDBBtn 
                                className='me-auto'
                                rounded size='sm' style={{backgroundColor: "#00B5FF"}}
                                onClick={editTimeLimit}
                            >
                                <PencilFill color="white" size={20}/>
                            </MDBBtn>
                        </div>
                </div>

                <div className="d-flex mb-3 gap-3">
                    {
                        quiz.categories.map((category) => 
                            <MDBBtn style={{backgroundColor: '#CB12CB'}}>
                                {category}
                            </MDBBtn>
                        )
                    }
                    <MDBBtn style={{backgroundColor: '#CB12CB'}}
                        onClick={addCategory}
                    >
                        Add +
                    </MDBBtn>
                </div>

                <div className="d-flex mb-3">
                    <MDBBtn 
                        className='me-auto'
                        rounded size='sm' style={{backgroundColor: "#00B5FF"}}
                        onClick={addQuestion}
                    >
                        Add New Question
                    </MDBBtn>
                    <MDBBtn 
                        rounded size='sm' style={{backgroundColor: "#00B5FF"}}
                        onClick={publishQuiz}
                    >
                        Publish Quiz
                    </MDBBtn>
                </div>

                <div className='d-flex flex-column'>
                    {
                        quiz.questions.map((question, indx) => 
                            <MDBCardBody
                                className='mb-3'
                                style={{
                                    backgroundColor: '#8B008B',
                                    cursor: 'pointer'
                                }}
                                onClick={() => editQuestion(indx)}
                            >
                                <div className='d-flex'>
                                    <span className='me-auto'>
                                        {question.questionText}
                                    </span>
                                    <TrashFill color="red" size={20}
                                        onClick={(ev) => {
                                            ev.stopPropagation();
                                            deleteQuestion(indx);
                                        }}
                                    />
                                </div>
                            </MDBCardBody>
                        )
                    }
                </div>

                <div className='d-flex'>
                    <MDBBtn rounded className='' color='danger'
                        onClick={deleteQuiz}
                    >
                        DELETE QUIZ
                    </MDBBtn>
                </div>
            </div>
        </div>
        }</>
    )
}

export default QuizEdit
