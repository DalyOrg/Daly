import { useEffect, useState } from "react"
import { getPlatformSubscribed, putPlatformSubscribed } from "../adapters/platform"
import { useGlobalStore } from "../store/useGlobalStore";

const SubscribeButton = ({platformId}) => {
    const [store] = useGlobalStore()
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        getPlatformSubscribed(platformId).then((res) => {
            console.log(res);
            setIsSubscribed(res.isSubscribed);
            setIsReady(true);
        })
    }, [platformId]);

    async function handleClick(){
        setIsReady(false)
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
                    backgroundColor: '#00B5FF'
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
