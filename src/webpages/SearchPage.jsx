import { Funnel } from 'react-bootstrap-icons';
import { useParams } from 'react-router';
const SearchPage = () => {
    const {searchTerm} = useParams();

    return (
      <>
      <div class='row'>
        <div class="col-6"><h1>Results for {searchTerm}</h1></div>
        <div class='col-4 offset-10'>
        <Funnel style={{color: '#00B5FF', fontSize: '4rem'}}></Funnel>
        </div>

        <div class='row border-bottom px-3 pb-4 mb-3'>
            <div class="col-2 offset-1"><img src="http://placehold.it/200x100"></img></div>
            <div class='col-4'>
            <h1 style={{color: 'white'}}>Ragdoll Quiz</h1>
            <h3 style={{color: 'hotpink'}}>Created by Faraz Fazli</h3>
            </div>
            <div class='col-5' style={{color: 'hotpink'}}>
            <p>Available since: 9/15/21</p>
            </div>
        </div>
      </div>
        <div class='row border-bottom px-3 pb-4'>
            <div class="col-2 offset-1"><img src="http://placehold.it/200x100"></img></div>
            <div class='col-4'>
            <h1 style={{color: 'white'}}>Ragdoll Quiz</h1>
            <h3 style={{color: 'hotpink'}}>Created by Faraz Fazli</h3>
            </div>
            <div class='col-5' style={{color: 'hotpink'}}>
            <p>Available since: 9/15/21</p>
            </div>
        </div>
      </>
    );
}

export default SearchPage
