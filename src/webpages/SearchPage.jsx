import { Funnel } from 'react-bootstrap-icons';
import { useParams } from 'react-router';
import { postSearch } from "../adapters/search";
import { postFilter } from "../adapters/search";
import { getQuiz } from "../adapters/quiz";
import { getPlatform } from '../adapters/platform';
import { useEffect, useState } from "react"
import { Placeholder } from 'react-bootstrap';

const SearchPage = () => {
    const {searchTerm} = useParams();
    const [results, setResults] = useState([]);

  

    useEffect(() => {
        setResults([]);
        postSearch(searchTerm).then((res) => {
            res.results.forEach((elem) => {
              if (elem.type === 'quiz') {
                getQuiz(elem.id).then((quizInfo) => {
                  let tempResults = results;
                  tempResults.push(quizInfo);
                  setResults((prevResults) => [...prevResults, quizInfo]);
                  
                })
              } else {
                getPlatform(elem.id).then((platformInfo) => {
                  let tempResults = results;
                  tempResults.push(platformInfo);
                  setResults((prevResults) => [...prevResults, platformInfo]);
                  
                });
              }
            })
        })
      }, [])

    return (
      <>
      
        <div style={{marginBottom: "5rem"}}><h2 style={{color: 'white', fontWeight:"bold"}} className="px-5 pt-2">Results for {searchTerm} :</h2></div>
        
        {results ? results.map((result) => {
          return <div className='d-flex bd-highlight mb-3'>
            <div className="p-2 bd-highlight">
            <a href={typeof result.quizzes !== 'undefined' ? "/platform/" + result.id : "/quiz/" + result.id}>
            {(typeof result.quizzes !== 'undefined') ?
            <img style={{borderRadius: "50px", objectFit: "cover"}}height="200px" width="200px" src={result.platformPicture ? result.platformPicture : "https://i.imgur.com/H4Dksdd.jpg" }></img>
            :
            <img style={{borderRadius: "50px", objectFit: "cover"}}height="200px" width="200px" src={result.backgroundImage ? result.backgroundImage : "https://i.imgur.com/H4Dksdd.jpg" }></img>
            }
            </a>
            </div>
            <div className="p-2 bd-highlight">
              <a href={typeof result.quizzes !== 'undefined' ? "/platform/" + result.id : "/quiz/" + result.id}>
                <h2 style={{color: 'white'}}>{result.name}</h2>
            <h3 style={{color: 'grey'}}>{typeof result.quizzes !== 'undefined' ? "Platform"  : "Quiz" }</h3>
            </a>
            </div>

            
            <div className="ms-auto p-2 bd-highlight">
            <p style={{color: 'hotpink'}}>{result.timestamp ? `Available since: ${new Date(result.timestamp).getMonth() + 1}${"/" +new Date(result.timestamp).getDate() + "/" + new Date(result.timestamp).getFullYear()}` : ""}
            </p>
            </div>
            
        </div>
        }) : <h1 style={{color: 'white'}} className="px-5 pt-2">No Results Found</h1>}
     

      </>
    );
}

export default SearchPage
