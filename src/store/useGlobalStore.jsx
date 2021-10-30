import { useState, useContext, createContext } from "react"

const GlobalStoreContext = createContext();

export const GlobalStoreWrapper = ({children}) => {
    const [store, setStore] = useState({});

    const dispatch = async (action) => {
        switch(action.type) {
            case 'login':
                setStore({
                    userInfo: action.payload
                });
                break;
            default:
                throw new Error();
        }
    }

    return (
        <GlobalStoreContext.Provider value={[store, dispatch]}>
            {children}
        </GlobalStoreContext.Provider>
    )
}

export const useGlobalStore = () => useContext(GlobalStoreContext);

