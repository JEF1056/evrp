function LoadingScreen(){
    return(
        <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
            <div className="max-w-md">
                <h1 className="text-5xl font-bold">EVEE</h1>
                <progress className="progress progress-accent w-56" max="100"></progress>
            </div>
        </div>
        </div>
    )
}

export default LoadingScreen;