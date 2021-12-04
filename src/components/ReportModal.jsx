import { useState } from "react";
import { postReport } from "../adapters/reports";

const ReportModal = ({reasons, metadata}) => {
    const [reportTo, setReportTo] = useState('');
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');

    async function submitReport(){
        await postReport(reason, description, {...metadata, toStaff: reportTo === 'Staff'});
    }

    async function reset(){
        setReportTo('')
        setReason('')
        setDescription('')
    }

    return (
        <div className="modal fade" id='reportModal' tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Report</h5>
                        <button type="button" className="btn-close" aria-label="Close"
                            data-bs-dismiss="modal"
                            onClick={reset}
                        />
                    </div>
                    <div className="modal-body d-flex flex-column gap-3 m-3">
                        { reportTo === '' ?
                        <>
                        <h1 className='mx-auto'>
                            Report To Who?
                        </h1>
                        <button className="btn btn-primary" style={{backgroundColor: '#00B5FF'}}
                            onClick={() => setReportTo('Staff')}
                        >
                            Staff
                        </button>
                        <button className="btn btn-primary" style={{backgroundColor: '#00B5FF'}}
                            onClick={() => setReportTo('Platform Owner')}
                        >
                            Platform Owner
                        </button> 
                        </>
                        :
                        <>
                        <h1 className='mx-auto'>
                            Report To {reportTo}
                        </h1>
                        {
                            reasons.map((currReas) => 
                                <button className='btn p-3 rounded'
                                    style={{color: '#FFFFFF', backgroundColor: `${reason === currReas ? '#5321d0' : '#640979'}`}}
                                    onClick={() => setReason(currReas)}
                                >
                                    {currReas}
                                </button>
                            )
                        }
                        <div className="d-flex flex-column">
                            <label htmlFor='reportModalTextArea' className='form-label'>Description</label>
                            <textarea id='reportModalTextArea' className="form-control" rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-success" data-bs-dismiss="modal"
                            onClick={() => {
                                submitReport()
                                reset()
                            }}
                        >
                            Submit
                        </button> 
                        </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportModal
