import React from "react";
import "./quizSetup.css";
import { MDBBtn } from 'mdb-react-ui-kit';

function displayCategoryTags(){
    return ``;
}

const QuizSetup = () => {
    return (
        <div>
            <form id="quiz-setup">
                <p class="quiz-setup-title"><b>Quiz Setup</b></p>
                <div class="form-inputs">

                    <label for="quizName">Quiz name:</label><br/>
                    <input type="text" id="quizName" name="quizName" required></input><br/>
                        
                    <br/>

                    <label for="time">Time allotted (in minutes):</label><br/>
                    <input type="text" id="time" name="time" required></input><br/>
    
                    <br/>

                    <form id="category-input">
                        <label for="categories">Categories:</label><br/>
                        <input class="categories" type="text" id="categories" name="categories"></input>
                        <MDBBtn style={{color: "white", backgroundColor: "#CB12CB", marginLeft: '1rem', marginBottom: '1rem'}} rounded>+</MDBBtn>
                    </form><br/>
                    {displayCategoryTags()}
    
                    <br/>

                    <table>
                        <tr>
                            <th><h2 class="add-background">Add Background</h2></th>
                            <th><MDBBtn style={{color: "white", backgroundColor: "#00B5FF", marginLeft: '1rem', marginBottom: '1rem'}} rounded>Upload Image</MDBBtn></th>
                        </tr>
                    </table>
                    
                    <br/><br/>
                    

                        <MDBBtn class="btn btn-primary" style={{color: "white", backgroundColor: "#00B5FF", position: "relative", left: "28%"}} rounded>Publish</MDBBtn>
                    </div>
            </form>
        </div>
    );
}

export default QuizSetup;