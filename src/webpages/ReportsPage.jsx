import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { getUserReports } from "../adapters/reports";
import { useGlobalStore } from "../store/useGlobalStore"
import { MDBBtn } from "mdb-react-ui-kit";

const ReportsPage = () => {
    const [store] = useGlobalStore();
    const history = useHistory();
    const [reports, setReports] = useState([]);

    const initReports = useCallback(async function(){
        let newReports = await getUserReports();
        setReports(newReports.reports);
    }, [])

    useEffect(() => {
        if(store && store.userInfo){
            initReports()
        }
    }, [initReports, store])

    function getReportCard(report){
        let dataEle;
        switch(report.metadata.type){
            case 'quiz':
                dataEle = 
                <div className='d-flex flex-column gap-2'>
                    <MDBBtn
                      rounded
                      style={{color: "white", backgroundColor: "#5321d0"}}
                      onClick={() => history.push(`/quiz/${report.metadata.quizId}`)}
                    >
                        Go To Quiz
                    </MDBBtn>
                </div>
                break; 
            case 'comment':
                dataEle = 
                <div className='d-flex flex-column gap-2'>
                    <span>
                        Comment: {report.metadata.commentText}
                    </span>
                    <MDBBtn
                      rounded
                      style={{color: "white", backgroundColor: "#5321d0"}}
                      onClick={() => history.push(`/quiz/${report.metadata.quizId}`)}
                    >
                        Go To Quiz
                    </MDBBtn>
                </div>
                break;
            default:
                break;
        }

        return(
        <div className="card mx-auto p-3 d-flex flex-column gap-2" style={{backgroundColor: "#640979"}}>
            <h3>
                {report.reason}
            </h3>
            <span>
                Description: {report.description}
            </span>
            {dataEle}
        </div>
        );
    }

    return (
        <div className='d-flex flex-column gap-3'
            style={{color: '#FFFFFF'}}
        >
            { store && store.userInfo ?
            <h1 className='mx-auto mt-3'>
                Reports Submitted to You
            </h1> 
            :
            <h1 className='mx-auto mt-3'>
                Please log in to see your reports.
            </h1>
            }
            {
                reports.map((report) => 
                    getReportCard(report)
                )
            }
        </div>
    )
}

export default ReportsPage
