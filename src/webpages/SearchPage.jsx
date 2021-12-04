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

    function filterQuestions(numLessThan) {
        postFilter(numLessThan).then((res) => {
          setResults(res);
        });
    }

    useEffect(() => {
        setResults([]);
        postSearch(searchTerm).then((res) => {
            res.results.forEach((elem) => {
              if (elem.type === 'quiz') {
                getQuiz(elem.id).then((quizInfo) => {
                  let tempResults = results;
                  tempResults.push(quizInfo);
                  setResults((prevResults) => [...prevResults, quizInfo]);
                  console.log("quizInfo added, results",results);
                })
              } else {
                getPlatform(elem.id).then((platformInfo) => {
                  let tempResults = results;
                  tempResults.push(platformInfo);
                  setResults((prevResults) => [...prevResults, platformInfo]);
                  console.log("platformInfo added, results",results);
                });
              }
            })
        })
      }, [])

    return (
      <>
      <div className='row'>
        <div className="col-6"><h1 style={{color: 'white'}} className="px-5 pt-2">Results for {searchTerm}</h1></div>
        <div className='col-4 offset-10'>
        <Funnel style={{color: '#00B5FF', fontSize: '4rem'}} onClick={() => { document.getElementById('funnelDialogButton').click(); }}></Funnel>
        <button
            type="button"
            class="btn btn-primary"
            data-mdb-toggle="modal"
            data-mdb-target="#funnelDialog"
            id="funnelDialogButton"
            style={{display: 'none'}}
        >
        </button>
        </div>
        {results ? results.map((result) => {
          return <div className='row border-bottom px-3 pb-4 mb-3'>
            <div className="col-2 offset-1"><img height="100px" width="200px" src={result.backgroundImage ? result.backgroundImage : "http://placehold.it/200x100"}></img></div>
            <div className='col-4'>
              <a href={typeof result.quizzes !== 'undefined' ? "/platform/" + result.id : "/quiz/" + result.id}>
            <h1 style={{color: 'white'}}>{typeof result.quizzes !== 'undefined' ? "[Platform] " + result.name : "[Quiz] " + result.name}</h1>
            </a>
            <h3 style={{color: 'hotpink'}}>Created by Faraz Fazli</h3>
            </div>
            <div className='col-5' style={{color: 'hotpink'}}>
            <p>{result.timestamp ? "Available since: " + new Date(result.timestamp)
            : ""}</p>
            </div>
        </div>
        }) : <h1 style={{color: 'white'}} className="px-5 pt-2">No Results Found</h1>}
      </div>

    <div class="modal hide fade in" style={{pointerEvents: 'none'}} id="funnelDialog" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  
  <div class="modal-dialog" style={{pointerEvents: 'all'}}>
    <div class="modal-content">
    <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
      <div className="mx-5 py-5">
    <h1>Question # Filter</h1>
    <div class="form-check form-check-inline">
    <input class="form-check-input" type="checkbox" id="under25" value="option1"/>
    <label class="form-check-label" for="under25">Under 25 Questions</label>
  </div>
  <div class="form-check form-check-inline">
    <input class="form-check-input" type="checkbox" id="between25and50" value="option2"/>
    <label class="form-check-label" for="between25and50">25-50 Questions</label>
  </div>
  <div class="form-check form-check-inline">
    <input class="form-check-input" type="checkbox" id="over50" value="option3"/>
    <label class="form-check-label" for="over50">Over 50 Questions</label>
  </div>
  </div>  
  <button type="button" class="btn-primary" data-mdb-dismiss="modal" onClick={() => filterQuestions(50)}>Okay</button>
  </div>
  </div>
</div>
      </>
    );
}

export default SearchPage
