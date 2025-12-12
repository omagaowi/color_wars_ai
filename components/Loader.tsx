import { useEffect, useState } from 'react'
import'../styles/loader.css' 

const Loader = ({ setLoader, firstPlay, playerCount }) => {

    // console.log(firstPlay, playerCount)
    

    // const player_count = 4

    const [firstRun, setFirstRun] = useState(true)
    const [loaderIndex, setLoaderindex] = useState(0)
    const [intervalId, setIntervalId] = useState(false)
    const [fade, setFade] = useState(false)
    const [bgFade, setBgFade] = useState(false)

    // console.log(firstPlay)


    let playersArray = playerCount == 4? ['blue', 'red', 'green', 'yellow'] : ['blue', 'red', 'green'];


    const runLoader = () => {
       setLoaderindex((prevIndex) => ( prevIndex > 3? 0 : prevIndex + 1 ))
    }

    // console.log(loaderIndex, firstRun)



    const picked = playersArray.indexOf(firstPlay) + 1

    useEffect(()=>{
        if(loaderIndex > 3){
            setFirstRun(false)
        }
        
        if(loaderIndex + 1 == picked && !firstRun){
            // console.log('here')
            clearInterval(intervalId)
            // showLoader(false)
            setTimeout(() => {
                setFade(true)
                setTimeout(() => {
                    setBgFade(true)
                    setTimeout(() => {
                        setLoader(false)
                    }, 300);
                }, 500);
            }, 1400);
        }
        
    }, [loaderIndex])


    useEffect(()=>{
        const intervalId = setInterval( runLoader , 1000)
        setIntervalId(intervalId)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div className={`loader load${loaderIndex + 1} ${bgFade ? 'fade' : ''}`}>
            <div className={ `box cir${loaderIndex + 1} ${fade ? 'fade' : ''}` } style={ { width: `100px` } }>
                <div className="circle">
                    <div className="dots"></div>
                    <div className="dots"></div>
                    <div className="dots"></div>
                    <div className="dots"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader