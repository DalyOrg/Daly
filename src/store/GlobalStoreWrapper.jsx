import { useState } from "react"
import { GlobalStoreContext } from "./useGlobalStore";
import App from "../App";

const GlobalStoreWrapper = () => {
    const [store, setStore] = useState({});

    const dispatch = async (action) => {
        switch(action.type) {
            case 'login':
                setStore({
                    ...store,
                    userInfo: action.payload
                });
                break;
            case 'logout':
                setStore({
                    ...store,
                    userInfo: undefined
                });
                break;
            default:
                throw new Error();
        }
    }

    return (
        <GlobalStoreContext.Provider value={[store, dispatch]}>
            <App />
        </GlobalStoreContext.Provider>
    )
}

export default GlobalStoreWrapper;

