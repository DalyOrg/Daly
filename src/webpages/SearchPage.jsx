import { Funnel } from 'react-bootstrap-icons';
import { useParams } from 'react-router';
import { postSearch } from "../adapters/search";
import { getQuiz } from "../adapters/quiz";
import { getPlatform } from '../adapters/platform';
import { useEffect, useState } from "react"

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
        <Funnel style={{color: '#00B5FF', fontSize: '4rem'}}></Funnel>
        </div>
        {results ? results.map((result) => {
          return <div className='row border-bottom px-3 pb-4 mb-3'>
            <div className="col-2 offset-1"><img src="http://placehold.it/200x100"></img></div>
            <div className='col-4'>
            <h1 style={{color: 'white'}}>{typeof results.quizzes !== 'undefined' ? "[Platform] " + result.name : "[Quiz] " + result.name}</h1>
            <h3 style={{color: 'hotpink'}}>Created by Faraz Fazli</h3>
            </div>
            <div className='col-5' style={{color: 'hotpink'}}>
            <p>{result.timestamp ? "Available since: " + new Date(result.timestamp._seconds*1000).getMonth() + "/" + new Date(result.timestamp._seconds*1000).getDate() + "/" + new Date(result.timestamp._seconds*1000).getFullYear()
            : ""}</p>
            </div>
        </div>
        }) : <h1 style={{color: 'white'}} className="px-5 pt-2">No Results Found</h1>}
      </div>
      </>
    );
}

export default SearchPage
