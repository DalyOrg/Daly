import { useEffect, useState } from "react"
import { getQuizLiked, putQuizLiked } from "../adapters/quiz"
import { useGlobalStore } from "../store/useGlobalStore";
import { Heart, HeartFill } from "react-bootstrap-icons";

const LikeButton = ({quiz, setQuiz}) => {
    const [store] = useGlobalStore()
    const [isLiked, setIsLiked] = useState(false)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        getQuizLiked(quiz.id).then((res) => {
            console.log(res)
            setIsLiked(res.isLiked)
            setIsReady(true)
        })
    }, [quiz])

    async function handleClick(){
        setIsReady(false)
        let res = await putQuizLiked(quiz.id, !isLiked)
        setQuiz({...quiz, likes: res.newLikes})
        setIsReady(true)
    }

    return (
        <>
        { store !== undefined && store.userInfo !== undefined ?
        <div className='d-flex justify-text-center'>
            <button className='btn'
                disabled={!isReady}
                style= {{
                    backgroundColor: '#640979',
                    borderTopRightRadius: '0rem',
                    borderBottomRightRadius: '0rem'
                }}
                onClick={handleClick}
            >
                {
                    isLiked ?
                        <HeartFill size={20} color={'red'}/>
                    :
                        <Heart size={20} color={'red'}/>
                }
            </button>
            <div className='bg-white p-3'
                style= {{
                    backgroundColor: '#640979',
                    borderTopRightRadius: '.25rem',
                    borderBottomRightRadius: '.25rem',
                    color: 'black'
                }}
            >
                <span>
                    {quiz.likes}
                </span>
            </div>
        </div>
        : ''}
        </>
    )
}

export default LikeButton
