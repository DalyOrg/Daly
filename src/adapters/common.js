import ErrorModal from "../components/ErrorModal";
import {render} from "react-dom";

function displayErrorModal(err){ 
    let modalRoot = document.getElementById("errorModal");

    if (modalRoot) {
        modalRoot.remove(); // reset elment
    }
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "errorModal");
    document.body.appendChild(modalRoot);

    render(<ErrorModal message={err.message} />, modalRoot);
}

export function wrapErrorHandling(adapter){
    return async function(){
        try{
            let res =  await adapter.apply(this, arguments)
            return res
        } catch(err){
            // axios error
            console.log('Error!')
            displayErrorModal(err.response.data);
            return undefined
        }
    }
}
