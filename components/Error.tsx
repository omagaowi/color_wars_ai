import '../styles/alerts.css'
import { useState, useEffect } from 'react'

const Error = ({ error, setError }) => {
    useEffect(() => {
        if(error){
            // console.log(msg)
           setTimeout(() => {
            setError(false)
           }, 1000)
        }
    }, [error])
    return (
        <div className={`error-component ${error? 'show': ''}`}>
            <h5>{ error }</h5>
        </div>
    )
}

export default Error