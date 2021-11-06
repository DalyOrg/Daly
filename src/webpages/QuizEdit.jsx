import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router"
import { getQuiz } from "../adapters/quiz"
import { MDBCardBody, MDBBtn } from 'mdb-react-ui-kit';
import { PencilFill, TrashFill } from 'react-bootstrap-icons';
import { purple } from "@mui/material/colors";

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
                                onClick={() => document.getElementById('button').click()}
                            >
                                
                                <div className='d-flex'>
                                    <span className='me-auto'>
                                        {question.questionText}
                                    </span>
                                    <button
                                        type="button"
                                        class="btn btn-primary"
                                        data-mdb-toggle="modal"
                                        data-mdb-target="#editModal"
                                        id="button"
                                        style={{display: 'none'}}
                                    >
                                    </button>
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

<div
  class="modal fade"
  id="editModal"
  tabindex="-1"
  aria-labelledby="editModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header" style={{backgroundColor: 'purple'}}>
        <h5 class="modal-title" id="editModalLabel">Question 2</h5>
        <button
          type="button"
          class="btn-close"
          data-mdb-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body text-center pb-0">
          <label for="file-input">
          <img src="data:image/png;base64,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"></img>
          </label>
          <input type="file" id="file" name="file" id="file-input" multiple></input>
          <div className="questionBody mt-2 py-4 px-4" style={{backgroundColor: '#00B5FF', borderRadius: '20px'}}>
            <p>Which pixar movie has a character named Mr. Potato Head?</p>
          </div>
          <div className="answers">

              <ul style={{listStyleType: 'none', textAlign: 'left'}}>
                  <li style={{backgroundColor: 'purple', borderRadius: '20px'}} className="px-3 my-2 py-2">Toy Story</li>
                  <li style={{backgroundColor: 'purple', borderRadius: '20px'}} className="px-3 my-2 py-2">Monsters Inc.</li>
                  <li style={{color: 'gray', border: '1px solid gray', borderRadius: '12px'}} className="px-2 py-1">Type an answer option...</li>
              </ul>
          </div>
      </div>
      <div class="row col-4 offset-4 mb-2">
        <button type="button" class="btn btn-primary" data-mdb-dismiss="modal" style={{backgroundColor: 'purple'}}>
          Add Answer
        </button>
        </div>
      <div class="row col-4 offset-4 my-2 mb-3">
        <button type="button" class="btn btn-primary" data-mdb-dismiss="modal" style={{backgroundColor: '#00B5FF'}}>
          Submit Question
        </button>
      </div>
    </div>
  </div>
</div>
            </div>
        </div>
        }</>
    )
}

export default QuizEdit
