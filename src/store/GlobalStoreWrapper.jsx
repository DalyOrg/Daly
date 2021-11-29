import { useState, useEffect, useCallback } from "react"
import { GlobalStoreContext } from "./useGlobalStore";
import App from "../App";
import { getUser } from "../adapters/user";

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
            case 'enter-platform': //will change everytime user enters a platform..
                setStore({
                    ...store,
                    platformId: action.payload
                });
                break;
            //TODO: do we need exist platform?
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

