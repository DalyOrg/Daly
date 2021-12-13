import "./quizSetup.css";
import { MDBBtn } from 'mdb-react-ui-kit';
import { useState } from "react";
import CategoryTag from "./CategoryTag";
import { postQuiz } from "../../adapters/quiz";
import { Redirect, useParams } from "react-router";
import { GlobalStoreContext } from '../../store/useGlobalStore';
import React, {useContext} from "react";
import {uploadUserImage} from "../../adapters/images"


const QuizSetup = () => {
    //TODO: make sure user is logged in
    const [store] = useContext(GlobalStoreContext);
    const {platformId} = useParams();

    const [quizId, setquizId] = useState();

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState('');
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const [category, setCategory] = useState('');
    const [background, setBackground] = useState('https://cdn.discordapp.com/attachments/880269941146792009/908928075083960320/Screen_Shot_2021-11-12_at_10.55.37_PM.png');
    const [backgroundURL, setBackgroundURL] = useState('https://cdn.discordapp.com/attachments/880269941146792009/908928075083960320/Screen_Shot_2021-11-12_at_10.55.37_PM.png');

    const [uploadProgress, setUploadProgress] = useState('');

    function addCategory(cat){
        if(category && category.length <= 20){
            let temp = [...categories];
            temp.push(category);
            setCategories(temp);
        }else{
            alert("Category must be 1-20 characters!");
        }
    }

    const uploadImage =async (base64EncodedImage)=>{
        setUploadProgress("Uploading...");
        var url = await uploadUserImage(base64EncodedImage);
        setUploadProgress("Upload Complete!");
        if(url){
          return url.data;
        }
      }

    async function updateBackground(){
        var url = await uploadImage(background);
        setBackgroundURL(url);
    }

    function categoryStyle(){
        if(category && category.length > 20)
        {
            return 'red';
        }
        else{
            return 'white';
        }
            
    }

    function deleteCategory(index){
        let temp = [...categories];
        temp.splice(index,1);
        setCategories(temp);
    }

    async function publishQuiz(){ 
        //TODO: redirect user to login page
        if(store.userInfo === undefined){
            alert("You must log in to create a quiz.");
            return;
        }
        var newQuiz = {
            name: name,
            questions: [],
            likes: 0,
            timestamp: new Date(),
            timeLimitSeconds: ((min * 60) + sec),
            categories: categories,
            platformId: platformId, 
            leaderboardId: undefined, //create leaderboard when the first person takes the quiz
            commentsId: undefined, //create comment when the first person comments
            backgroundImage: backgroundURL,
            cssSettings: undefined
        }; 
        if(((min * 60) + sec)>0){
            //console.log(min, sec, ((min * 60) + sec));
            var quiz = await postQuiz(newQuiz);
            if(quiz){
                setquizId(quiz);
            }
        }else{
            alert('Please input a time for the quiz!');
        }
        
    }

    return (
        <>
        <div>
            <form id="quiz-setup">
                <p class="quiz-setup-title"><b>Quiz Setup</b></p>
                <div class="form-inputs">

                    <label class="reg-label" for="quizName">Quiz name:</label><br/>
                    <input type="text" id="quizName" name="quizName" value={name ? name : ''} required 
                    onChange={
                        e=>setName(e.target.value)
                    }
                    ></input><br/>
                        
                    <br/>

                    <label class="reg-label" for="min">Time allotted:</label><br/>
                    <span>
                    <table style={{color:"white", position:"relative"}}>
                  <tr>
                      <td>
                        <span>
                            <input style={{width:"100%"}} type="number" id="min" name="min" value={min? min : ''} required 
                            onChange={
                            //e=>setMin(parseInt(e.target.value.replace(/\D/,''),10))
                            e=>setMin(parseInt(e.target.value,10))
                            }
                        ></input></span>
                      </td>
                      <td style={{paddingRight:"50px", paddingLeft:"20px"}}>Min</td>
                      <td>
                      <span>
                        <input style={{width:"100%"}} type="number" id="sec" name="sec" value={sec? sec : ''} required 
                            onChange={
                                //e=>setSec(parseInt(e.target.value.replace(/\D/,''),10))
                                e=>setSec(parseInt(e.target.value,10))
                            }
                        ></input></span>
                      </td>
                      <td style={{paddingLeft:"20px"}}>Sec</td>
                  </tr>
              </table>

                    </span>
                    <br/>

                    <label for="categories" style={{color: categoryStyle()}}>Categories: (Character limit: {category.length}/20)</label><br/>
                    <input class="categories" type="text" id="categories" name="categories" value={category? category : ''}
                    onChange={
                        e=>setCategory(e.target.value)
                    }
                    ></input>
                    <MDBBtn type="button" style={{color: "white", backgroundColor: "#CB12CB", marginLeft: '1rem', marginBottom: '1rem'}} rounded 
                    onClick={
                        e=>addCategory(e.target.value)
                    }
                    >+</MDBBtn>
                    <br/>
                        <div>
                            <fieldset class="category-tags">
                                {
                                    categories.map((tag, index)=>
                                        <CategoryTag
                                            categoryNum = {index}
                                            category = {tag}
                                            deleteCategory = {deleteCategory}
                                        />
                                    )
                                }
                            </fieldset>
                        </div>
                    <br/>

                    <table class="background">
                        <tr>
                            <th><h2 class="add-background">Add Background</h2></th>
                            <th><MDBBtn data-bs-toggle="modal" data-bs-target="#backgroundModal" type="button" style={{color: "white", backgroundColor: "#CB12CB", marginLeft: '1rem', marginBottom: '1rem'}} rounded 
                                onClick={()=>{
                                    setUploadProgress("");
                                }} >Upload Image</MDBBtn>
                            </th>
                        </tr>
                    </table>
                    
                    <br/><br/>
                    
                        <MDBBtn type="Button" class="btn btn-primary" style={{color: "white", backgroundColor: "#00B5FF", position: "relative", left: "27%"}} rounded 
                            onClick={
                                ()=>publishQuiz()
                            }
                        >Create Quiz</MDBBtn>
                    </div>

                    {
                        quizId ? <Redirect to={`/quiz/${quizId}/edit`}/>
                        : ""
                    }
            </form>
        </div>

{/* pic change modal */}
<div id="backgroundModal" className="modal fade" tabindex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Change Background Picture</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setUploadProgress("")}></button>
      </div>
      <div className="modal-body">
      <label style={{color: "white", backgroundColor: "#8B008B", borderRadius: '50px'}} className="upload-button">
                                <input type="file"  accept=".jpg,.png,.img,.jpeg" onChange={event=>{
                                  var file=event.target.files[0];

                                  let reader = new FileReader();
                                  reader.onloadend = function() {
                                      setBackground(reader.result);
                                  }
                                  reader.readAsDataURL(file);
                                }}>
                                </input>
                                Upload Image</label>
      <div>
          {background !== undefined ? <img style={{width:'70%', height: '70%', position: 'relative'}} src={background}/> : ""}                          
      </div>
                                
      </div>
      <div className="modal-footer">
        <h3 key={uploadProgress}>{uploadProgress}</h3>
        <p>note it will take longer for image to update if the file is big</p>
        <MDBBtn rounded type="button" onClick={()=>updateBackground()} style={{color: "white", backgroundColor: "#00B5FF"}}>Submit</MDBBtn>
      </div>
    </div>
  </div>
</div>
                    
        </>
    );
}

export default QuizSetup;