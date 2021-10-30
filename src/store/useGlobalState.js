import { useState } from "react"

export const useGlobalStore =()=> {
    const [store, setStore]= useState({//state
        userInfo: {
            username: "Qiting"//delete this later
        }
        // },
        // searchInfo: {}
    });

    const storeReducer = (action) =>{//action
        const {type, payload} =action;
        switch(type) {
            case 'login': {
                //change the userInfo state in the store
                return setStore({
                    userInfo: payload
                    //searchInfo: store.searchInfo //how do i make the rest of the store stay the same..?
                });
            }
            default:
                return store;
            
        }
        //return {store, action}; //Should this even be here?
    }
}

export default useGlobalStore;