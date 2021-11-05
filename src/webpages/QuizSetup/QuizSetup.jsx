import "./quizSetup.css";
import { MDBBtn } from 'mdb-react-ui-kit';
import { useState } from "react";
import CategoryTag from "./CategoryTag";
import { postQuiz } from "../../adapters/quiz";


const QuizSetup = () => {

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState('');
    const [time, setTime] = useState();
    const [category, setCategory] = useState('');
    //TODO: set background to new quiz summary page. 
    //TODO: set background image object to URL?
    const [background, setBackground] = useState();

    function addCategory(cat){
        if(category && category.length <= 20){
            let temp = [...categories];
            temp.push(category);
            setCategories(temp);
        }else{
            alert("Category must be 1-20 characters!");
        }
    }

    function updateBackground(event){
        var file=event.target.files[0];

        let reader = new FileReader();
        reader.onloadend = function() {
            setBackground(reader.result);
        }
        reader.readAsDataURL(file);
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
        var newQuiz = {
            name: name,
            questions: [],
            likes: 0,
            timestamp: new Date(),
            timeLimitSeconds: (time * 60),
            categories: categories,
            creator: "depKY160RzEuITdU1fij", //TODO: change this to current platformID, and add quizid to platform
            leaderboardId: undefined, //TODO: create leaderboard for this quiz
            commentsId: undefined, 
            backgroundImage: background,
            cssSettings: undefined
        };   
        var quizId = await postQuiz(newQuiz);
        if(quizId){
            console.log("hello",quizId.id);
        }
    }

    return (
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

                    <label class="reg-label" for="time">Time allotted (in minutes):</label><br/>
                    <input type="text" id="time" name="time" value={time? time : ''} required 
                    onChange={
                        e=>setTime(e.target.value.replace(/\D/,''))
                    }
                    ></input><br/>
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
                            <th><label class="reg-label" class="upload-button">
                                <input type="file" name="backgroundImage" accept=".jpg,.png,.img" onChange={e=>updateBackground(e)}></input>
                                Upload Image</label>
                            </th>
                        </tr>
                    </table>
                    
                    <br/><br/>
                    
                        {/*TODO: uploads initial quiz data and redirects to quiz edit page when clicked*/
                         //turn this back into a submit button
                        }
                        <MDBBtn type="button" class="btn btn-primary" style={{color: "white", backgroundColor: "#00B5FF", position: "relative", left: "28%"}} rounded 
                            onClick={
                                ()=>publishQuiz()
                            }
                        >Publish</MDBBtn>
                    </div>
            </form>
        </div>
    );
}

export default QuizSetup;