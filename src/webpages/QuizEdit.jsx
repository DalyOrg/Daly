import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router"
import { getQuiz, putQuizLiked } from "../adapters/quiz"
import { MDBCardBody, MDBBtn } from 'mdb-react-ui-kit';
import { PencilFill, TrashFill } from 'react-bootstrap-icons';
import { purple } from "@mui/material/colors";
import axios from "axios";
import { ConstructionOutlined } from "@mui/icons-material";
import { useHistory } from 'react-router-dom';
import { putQuiz, deleteQuiz } from "../adapters/quiz";
import { uploadUserImage } from "../adapters/images";

const QuizEdit = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState();

    //current question properties
    const [question, setQuestion] = useState(); //This will only change when user clicks on a new question, stays constant otherwise
    const [questionNum, setQuestionNum] = useState(0); //This will only change when user clicks on a new question
    
    //combine these into a question object and update quiz state when question is submitted
    const [questionText, setQuestionText] = useState(""); //changes based on user input
    const [answerText, setAnswerText] = useState([]); //changes based on user input
    const [correctAnswer, setCorrectAnswer] = useState([]); //changes based on user input
    const [imageUrl, setImageUrl] =useState(""); //changes based on user input
    const history = useHistory();

    const [timeLimitSeconds,setTimeLimitSeconds] = useState();
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();

    const [inputName, setInputName] = useState();
    const [quizName, setQuizName] = useState();

    const initQuiz = useCallback(async function(){
        let quizData = await getQuiz(quizId)
        setQuiz(quizData)
    }, [quizId])

    useEffect(() => {
        initQuiz()
        
    }, [initQuiz])

    function questionImageButton(){
        return "data:image/png;base64,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";
    }

    function setUpNewQuestion(){
        var tempQuestion = {
            questionText: "",
            answers: [{
                answerText: "",
                correctAnswer: false
            }],
            imageUrl: ""
        };
        setQuestion(tempQuestion);
        setQuestionNum(quiz.questions.length);
        setQuestionText("");
        setImageUrl("");
        setAnswerText([]);
        setCorrectAnswer([]);
        console.log(quiz.questions.length);
    }

    function handleCloseModal(){
        //clears all input data
        var tempQuestion = {
            questionText: "",
            answers: [{
                answerText: "",
                correctAnswer: false
            }],
            imageUrl: ""
        };
        setQuestion(tempQuestion);
        setQuestionNum(0);
        setQuestionText("");
        setImageUrl("");
        setAnswerText([]);
        setCorrectAnswer([]);
    }

    function initTime(){
        console.log(quiz);
        var minute = parseInt(quiz.timeLimitSeconds/60,10);
        var second = quiz.timeLimitSeconds%60;
        setMinutes(minute);
        setSeconds(second);
        setTimeLimitSeconds(quiz.timeLimitSeconds.toString());
        console.log(quiz.timeLimitSeconds);
        console.log(minutes, "min", seconds, "sec");
    }

    function handleCloseTimeModal(){
        setTimeLimitSeconds();
        setMinutes();
        setSeconds(); 
        console.log(minutes, "min", seconds, "sec");
    }

    function updateTimer(){
        var time = ((minutes * 60) + seconds);
        var tempQuiz = {
            ...quiz,
            timeLimitSeconds: time
        }
        setQuiz(tempQuiz);
        console.log(quiz.timeLimitSeconds);
    }

    function initQuestion(question, indx){
        var tempQuestion = {...question};
        var anotherQuestion = {...question};
        setQuestion(tempQuestion);
        setQuestionNum(indx);
        setQuestionText(anotherQuestion.questionText);
        setImageUrl(anotherQuestion.imageUrl);
        var tempAns = [];
        var tempCor = [];
        for(var i=0; i<question.answers.length; i++){
            tempAns.push(anotherQuestion.answers[i].answerText);
            tempCor.push(anotherQuestion.answers[i].correctAnswer);
        }
        setAnswerText(tempAns);
        setCorrectAnswer(tempCor);
    }

    function addAnswer(){
        var answer = {
            answerText : "",
            correctAnswer: false
        };
        var tempQuestion = {
            ...question,
            answers : [...question.answers, answer]
        };
        setQuestion(tempQuestion);

        setCorrectAnswer([...correctAnswer, false]);
        setAnswerText([...answerText, '']);
    }

    function deleteAnswer(idx){
        let newAnswers = question.answers;
        newAnswers.splice(idx, 1);
        var tempQuestion = {
            ...question,
            answers: newAnswers
        };
        setQuestion(tempQuestion);
        var tempAns = [...answerText];
        tempAns.splice(idx, 1);
        setAnswerText(tempAns);
    }

    //edit question
    async function changeQuestionImage(e){
        var file=e.target.files[0];
        let reader = new FileReader();
        reader.onloadend =async function() {
            var url = await uploadImage(reader.result)
            setImageUrl(url);
        }
        await reader.readAsDataURL(file);
    }

    function changeQuestionText(e){
        setQuestionText(e.target.value);
    }

    function updateCorrectAnswer(idx){
        var tempCor = [...correctAnswer];
        tempCor[idx] = !tempCor[idx];
        setCorrectAnswer(tempCor);
    }

    function updateAnswer(idx, e){
        var tempAns = [...answerText];
        tempAns[idx] = e.target.value;
        setAnswerText(tempAns);
    }

    function submitQuestion(){
        //mapping answer to its correctness
        var tempAns = [];
        for(var i=0; i<answerText.length; i++){
            var ans ={
                answerText: answerText[i],
                correctAnswer: correctAnswer[i]
            }
            tempAns.push(ans);
        }
        //migrating question properties
        var tempQuestions = [...quiz.questions];
        tempQuestions[questionNum] = {
            answers: tempAns,
            questionText: questionText,
            imageUrl: imageUrl
        }
        var tempQuiz = {
            ...quiz,
            questions : tempQuestions
        };
        setQuiz(tempQuiz);
    }

    async function addCategory(){
    }

    async function deleteQuestion(indx){
        // indx = index of question in quiz.questions
        let tempQuestions = [...quiz.questions];
        tempQuestions.splice(indx, 1);
        console.log(tempQuestions);
        var tempQuiz = {
            ...quiz,
            questions: tempQuestions
        };
        setQuiz(tempQuiz);

    }

    async function publishQuiz(){
        // hint: use PUT /quiz/:quizId
        putQuiz(quiz);
        history.push(`/quiz/` + quizId);
    }

    async function deleteQuizAction(){
        // do not implement yet
        await deleteQuiz(quiz.id);
        history.push('/home');
    }

    async function updateBackground(e){
        var file=e.target.files[0];

        let reader = new FileReader();
        reader.onloadend = async function() {
            var url = await uploadImage(reader.result);
            setQuiz({...quiz, backgroundImage:url});
        }
        await reader.readAsDataURL(file);
    }

    const uploadImage =async (base64EncodedImage)=>{
        console.log("uploading image...");
        var url = await uploadUserImage(base64EncodedImage);
        console.log("upload complete");
        if(url){
          return url.data;
        }else{
          console.log("unable to grab link", url);
        }
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
                <span className="changeBannerButton">                   
                <label style={{backgroundColor: "#00B5FF", cursor: "pointer", color:"white", fontSize:"20px", padding:"8px", borderRadius:"10px"}}>
                    <input type="file" name="backgroundImage" accept=".jpg,.png,.img,.jpeg" onChange={e=>updateBackground(e)} required></input>
                    Edit Banner Picture</label>
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
                                data-mdb-toggle="modal"
                                data-mdb-target="#nameModal"
                                onClick={()=>{
                                    setQuizName(quiz.name);
                                    setInputName(quiz.name);
                                }}
                            >
                                <PencilFill color="white" size={20}/>
                            </MDBBtn>
                        </div>
                        <div className="d-flex">
                            <span 
                                className="me-3"
                                style={{fontSize: "25px", color:'yellow'}}
                            >
                                Time Limit: {`${parseInt((quiz.timeLimitSeconds / 60), 10)}:${(quiz.timeLimitSeconds % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}`}
                            </span>
                            <MDBBtn 
                                className='me-auto'
                                rounded size='sm' style={{backgroundColor: "#00B5FF"}}
                                data-mdb-toggle="modal"
                                data-mdb-target="#timerModal"
                                onClick={()=>initTime()}
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

                <div className='d-flex flex-column'>
                    {
                        quiz.questions.map((question, indx) => 
                            <MDBCardBody
                                className='mb-3'
                                style={{
                                    backgroundColor: '#8B008B',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    document.getElementById('button').click();
                                    initQuestion(question, indx);
                                }}
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

                <div className="d-flex mb-3">
                    <MDBBtn className='me-auto' rounded size='sm' color='danger'
                        onClick={()=>deleteQuizAction()}
                    >
                        DELETE QUIZ
                    </MDBBtn>
                    <MDBBtn 
                        rounded size='sm' style={{backgroundColor: "#00B5FF"}}
                        data-mdb-toggle="modal"
                        data-mdb-target="#editModal"
                        onClick = {()=>setUpNewQuestion()}
                    >
                        Add New Question
                    </MDBBtn>
                    <MDBBtn 
                        rounded size='sm' style={{marginLeft: '1rem', backgroundColor: "green"}}
                        onClick={publishQuiz}
                    >
                        Publish Quiz
                    </MDBBtn>
                </div>

{/* modal for question edit */}
<div class="modal hide fade in" style={{pointerEvents: 'none'}} id="editModal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog" style={{pointerEvents: 'all'}}>
    <div class="modal-content">
      <div class="modal-header" style={{backgroundColor: 'purple'}}>
        <h5 class="modal-title" id="editModalLabel">Question {(questionNum + 1)}</h5>
        <button type="button" onClick={()=>handleCloseModal()} class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-center pb-0" style={{maxHeight: '460px', overflowY:'auto'}}>
        <label for="file-input">
        <img style={{cursor: 'pointer', width:'70%', height: '70%', position: 'relative'}} src={imageUrl === "" ? questionImageButton() : imageUrl}></img>
        </label>
          <input type="file" id="file" name="file" id="file-input" accept=".jpg,.png,.img,.jpeg" onChange={(e)=>changeQuestionImage(e)} multiple></input>
          <div key={question ? question.questionText : ""} className="questionBody mt-2 py-4 px-4" style={{backgroundColor: '#00B5FF', borderRadius: '20px'}}>
            <textarea defaultValue={question ? question.questionText : ""} rows="4" cols="50" style={{backgroundColor: '#00B5FF', borderRadius: '10px', color: 'white', border: 'none'}} onChange={e=>changeQuestionText(e)}></textarea>
          </div>
          <div className="answers">
                  {question ? question.answers.map((answer, idx)  =>
                  <div>
                      <span key={question.answers[idx].correctAnswer}><input type="checkbox" onClick={()=>{updateCorrectAnswer(idx)}} defaultChecked={question.answers[idx].correctAnswer}></input></span>
                      <span key={question.answers[idx].answerText}><input className="px-2 mx-1 my-2 py-1" onChange={(e)=>{updateAnswer(idx, e)}} style={{borderRadius: '20px', width: '90%'}} defaultValue={question.answers[idx].answerText}></input>
                      <TrashFill style={{cursor: 'pointer'}} color="red" size={20}
                                        onClick={(ev) => {
                                            ev.stopPropagation();
                                            deleteAnswer(idx);
                                        }}
                                    /></span>
                  </div>
                  ) : "Sample Answer"}
          </div>
      </div>
      <div class="row col-4 offset-4 mb-2">
        <button type="button" onClick={()=>addAnswer() } class="btn btn-primary" style={{backgroundColor: 'purple'}}>
          Add Answer
        </button>
        </div>
      <div class="row col-4 offset-4 my-2 mb-3">
        <button type="button" onClick={()=>submitQuestion()} class="btn btn-primary" data-mdb-dismiss="modal" style={{backgroundColor: '#00B5FF'}}>
          Submit Question
        </button>
      </div>
    </div>
  </div>
</div>

{/* modal for time change */}
<div class="modal hide fade in" style={{pointerEvents: 'none'}} id="timerModal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog" style={{pointerEvents: 'all'}}>
    <div class="modal-content">
      <div class="modal-header" style={{backgroundColor: 'purple'}}>
        <h5 class="modal-title" id="editModalLabel">Time Limit Change</h5>
        <button type="button" onClick={()=>handleCloseTimeModal()} class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-center pb-0" style={{maxHeight: '460px', overflowY:'auto'}}>
          <span>
              <table style={{color:"black", position:"relative", right: "4%"}}>
                  <tr>
                      <th>
                        <span key={timeLimitSeconds}>
                            <input type="text" id="timeMinutes" name="timeMinutes" defaultValue={timeLimitSeconds ? parseInt(parseInt(timeLimitSeconds,10)/60,10) : ''} required 
                            onChange={
                            e=>setMinutes(parseInt(e.target.value.replace(/\D/,''),10))
                            }
                        ></input></span>
                      </th>
                      <th>Min</th>
                      <th>
                      <span key={timeLimitSeconds}>
                        <input type="text" id="timeSeconds" name="timeSeconds" defaultValue={timeLimitSeconds ? parseInt(timeLimitSeconds,10)%60 : ''} required 
                            onChange={
                                e=>setSeconds(parseInt(e.target.value.replace(/\D/,''),10))
                            }
                        ></input></span>
                      </th>
                      <th>Sec</th>
                  </tr>
              </table>
          </span>
          <div class="row col-4 offset-4 my-2 mb-3">
            <button type="button" onClick={()=>updateTimer()} class="btn btn-primary" data-mdb-dismiss="modal" style={{backgroundColor: '#00B5FF'}}>
                Save
            </button>
      </div>
      </div>
    </div>
   </div>
</div>

{/* modal for name change */}
<div class="modal hide fade in" style={{pointerEvents: 'none'}} id="nameModal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog" style={{pointerEvents: 'all'}}>
    <div class="modal-content">
      <div class="modal-header" style={{backgroundColor: 'purple'}}>
        <h5 class="modal-title" id="editModalLabel">Quiz Name Change</h5>
        <button type="button" onClick={()=>setQuizName('')} class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-center pb-0" style={{maxHeight: '460px', overflowY:'auto'}}>
          <span key={quizName}>
                <input type="text" id="quizName" name="quizName" defaultValue={quizName} required 
                            onChange={
                            e=>setInputName(e.target.value)
                            }/></span>
          <div class="row col-4 offset-4 my-2 mb-3">
            <button type="button" onClick={()=>setQuiz({...quiz, name: inputName})} class="btn btn-primary" data-mdb-dismiss="modal" style={{backgroundColor: '#00B5FF'}}>
                Save
            </button>
      </div>
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
