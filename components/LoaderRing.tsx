import '../styles/loaderRing.css'

const LoaderRing = ( { customClass, color }) => {
    return (
        <div className={`loading-ring ${customClass} ${color}`}>
            <div className="spinner"></div>
        </div>
    )
}

export default LoaderRing