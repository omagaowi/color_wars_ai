

import { useEffect, useRef } from "react"

const OnClickOutside = ({ children, currentState, setState }) => {

    const clickOutRef = useRef(false)
    const currentStateRef =  useRef(false)

    const handleClickOut = (event) => {
        if (clickOutRef.current && !clickOutRef.current.contains(event.target)) {
            console.log('clicked out')
            console.log(currentStateRef.current); // Use the ref to get the latest value
            if (currentStateRef.current) {
              setState(false); // Update state
            }
        }
    }


    useEffect(() => {
        currentStateRef.current = currentState;
      }, [currentState]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOut)
        return () =>  document.removeEventListener('mousedown', handleClickOut)
    }, [])

    return (
        <div ref={ clickOutRef }>
            {children}
        </div>
    )
}

export default OnClickOutside