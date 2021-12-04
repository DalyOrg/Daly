import { Modal } from 'mdb-ui-kit'
import { useRef } from 'react'
import { useEffect } from 'react'

const ErrorModal = ({message}) => {
    const ref = useRef()
    const modal = useRef()

    useEffect(() => {
        if(ref.current && modal.current === undefined){
            modal.current = new Modal(ref.current);
            modal.current.show();
        }
    }, [ref])

    function hideModal(){
        if(modal.current){
            modal.current.hide();
        }
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={ref}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Error!</h5>
                        <button type="button" className="btn-close" aria-label="Close"
                            onClick={hideModal}
                        />
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
