import { useState } from "react"

export const useGlobalStore =()=> {
    const [store, setStore]= useState({
        userInfo = {
            userId: '',
            profilePicture: '',
            badges: 0,
            accessToken: '',
            refreshToken: ''
        },

        searchInfo = {
            query: '',
            isHidden: false
        }
    });

    const storeReducer = (action) =>{
        const {type, payload} =action;
        switch(type) {
            case GlobalStoreActionType.LOGIN: {
                //change the userInfo state in the store
            }
        }

    }
}