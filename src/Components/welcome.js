import React from "react";



export default function Welcome(props){
    
    function start(){
        props.start()
    }

    return (
        <div className="Container_welcome">
            <h1>Quizzical</h1>
            <p>You Think you are smart? <span>Show us!</span></p>
            { props.checkstart && <button onClick={start}>Start Quiz</button>}
        </div>
    )
}