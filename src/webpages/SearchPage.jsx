import { Funnel } from 'react-bootstrap-icons';
import { useParams } from 'react-router';
import { postSearch } from "../adapters/search";
import { getQuiz } from "../adapters/quiz";
import { getPlatform } from '../adapters/platform';
import { useEffect, useState } from "react"

const SearchPage = () => {
    const {searchTerm} = useParams();
    const [results, setResults] = useState("");

    useEffect(() => {
        let tempResults = []
        postSearch(searchTerm).then((res) => {
            res.results.forEach((elem) => {
              if (elem.type === 'quiz') {
                getQuiz(elem.id).then((quizInfo) => {
                  console.log("Quiz Info", quizInfo);
                  tempResults.push(quizInfo.data);
                })
              } else {
                getPlatform(elem.id).then((platformInfo) => {
                  console.log("Platform Info", platformInfo);
                  tempResults.push(platformInfo.data);
                });
              }
            })
        })
        setResults(tempResults);
      }, [])

    return (
      <>
      <div className='row'>
        <div className="col-6"><h1 style={{color: 'white'}} className="px-5 pt-2">Results for {searchTerm}</h1></div>
        <div className='col-4 offset-10'>
        <Funnel style={{color: '#00B5FF', fontSize: '4rem'}}></Funnel>
        </div>

        {results ? results.map((result) => {
          <div className='row border-bottom px-3 pb-4 mb-3'>
            <div className="col-2 offset-1"><img src="http://placehold.it/200x100"></img></div>
            <div className='col-4'>
            <h1 style={{color: 'white'}}>{result['name']}</h1>
            <h3 style={{color: 'hotpink'}}>Created by Faraz Fazli</h3>
            </div>
            <div className='col-5' style={{color: 'hotpink'}}>
            <p>Available since: 9/15/21</p>
            </div>
        </div>
        }) : "No results found"}
      </div>
      </>
    );
}

export default SearchPage
