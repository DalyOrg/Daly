import { useEffect, useState } from "react"
import { getPlatformSubscribed, putPlatformSubscribed } from "../adapters/platform"
import { useGlobalStore } from "../store/useGlobalStore";
import { putUser } from "../adapters/user";
import { useCallback } from 'react';
import { getUser } from '../adapters/user';

const SubscribeButton = ({platformId, subsChange}) => {
    const [store, dispatch] = useGlobalStore()
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isReady, setIsReady] = useState(false)
    

    useEffect(() => {
        getPlatformSubscribed(platformId).then((res) => {
            console.log(res);
            setIsSubscribed(res.isSubscribed);
            setIsReady(true);
        })
    }, [platformId]);

    const addPlatformToUser = useCallback(async function(){
        if(store !== undefined){
            let userInfo = await getUser();
            userInfo.subscribedPlatforms.push(platformId);
            putUser(userInfo);
            if(userInfo.id){
              dispatch({type: 'login', payload: userInfo})
            }

        }
      }, [store, dispatch]);


      const removePlatformFromUser = useCallback(async function(){
        if(store !== undefined){
            let userInfo = await getUser();
            const index = userInfo.subscribedPlatforms.indexOf(platformId);
            if (index > -1) {
                userInfo.subscribedPlatforms.splice(index, 1);
            }
            putUser(userInfo);
            if(userInfo.id){
              dispatch({type: 'login', payload: userInfo})
            }

        }
      }, [store, dispatch]);

    async function handleClick(){
        if(!isSubscribed){
            addPlatformToUser();
        }else{
            removePlatformFromUser();
        }
        setIsReady(false);
        if(isSubscribed){
            subsChange(-1);
        }else{
            subsChange(1);
        }
        await putPlatformSubscribed(platformId, !isSubscribed);
        setIsSubscribed(!isSubscribed);
        setIsReady(true);

        
    };

    return (
        <>
        { store !== undefined && store.userInfo !== undefined ?
        <div className='d-flex justify-text-center'>
            <button className='btn'
                disabled={!isReady}
                style= {{
                    backgroundColor: '#640979',
                    color: "white"
                }}
                onClick={handleClick}
            >
                {
                    isSubscribed ?
                        <span>
                            Subscribed
                            
                        </span>
                    :
                        <span>
                            Subscribe
                            
                        </span>
                }
            </button>
        </div>
        : ''}
        </>
    )
}

export default SubscribeButton
