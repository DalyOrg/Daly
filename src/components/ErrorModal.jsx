import { Modal } from 'mdb-ui-kit'
import { useRef } from 'react'
import { useEffect } from 'react'

const ErrorModal = ({message}) => {
    const ref = useRef()
    useEffect(() => {
        if(ref.current){
            let thisModal = new Modal(ref.current);
            thisModal.show();
        }
    }, [ref])
    return (
        <div className="modal fade" tabIndex="-1" ref={ref}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Error!</h5>
                        <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorModal
