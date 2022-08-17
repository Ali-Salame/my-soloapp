
import '../Scss/index.css';
import React, {useState, useEffect} from 'react';
import { nanoid } from 'nanoid'
import { Markup } from "interweave"
import Confetti from "react-confetti";

function App() {
  let [activte, setActivate] = useState(false);
  let [newGame, setNewGame] = useState([]);
  let [Startgame, setStartgame] = useState(false);
  let [EndGame, setEndGame] = useState(false);
  let [quizes, setQuizes] = useState([]);
  let [CorrectAnswer , setCorrectAnswers] = useState()

  
  useEffect(() => {
    let mounted = true;
    if (mounted){
      fetch('https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple')
        .then(res => res.json())
        .then(data => {
          let results = data.results;
          let new_list = [];
          for (let i = 0; i < 5; i++) {
            let beforeanswers = results[i].incorrect_answers
            beforeanswers.push(results[i].correct_answer)
            let shuffled = beforeanswers
             .map(value => ({ value, sort: Math.random() }))
             .sort((a, b) => a.sort - b.sort)
             .map(({ value }) => value)
            let answers = shuffled.map(item => ({"value" : item, "Clicked": false, "key": nanoid(), "correct": item === results[i].correct_answer ? true : false}) )
            new_list.push(
              {"question":results[i].question, "Answers":{"incorrect": answers, "correct":results[i].correct_answer}}
            )
          }
          setQuizes(new_list)
        })
    }
    return () => mounted = false;
  }, [newGame])

   
  // Functions:  

  function Begin(){
    setStartgame(!Startgame)
  };


  // Components:

  function Welcome(props){
    function start(){
      props.start()
    }
    return (
      <div className="Container_welcome">
        <h1>Quizzical</h1>
        <p>You Think you are smart? <span>Show us!</span></p>
        { activte && <button onClick={start}>Start Quiz</button>}
      </div>
    )
  }

  function Answers(props) {


    let buttons = () => props.incorrect.map(num => {
      function Styles(){
        if (!EndGame){return (num.Clicked ? "answered" : "answer")}
        else if (EndGame && num.Clicked && num.correct){return ("Correct")}
        else if (EndGame && num.Clicked && !num.correct){return ("Wrong")}
        else if (EndGame && !num.Clicked && num.correct){return ("Correct")}
        else if (EndGame && !num.Clicked){return ("answer")}
        
      }
      return (
        <div onClick={(e) =>EndGame ? alert("Quiz Ended") : props.onClick(num.key,props.Ques,e)} key={num.key} id={num.key}>
          <Markup className={Styles()}  content={num.value} key={num.key}/>
        </div>
      )
    })
    return (buttons())
  }




  let RenderQuestion = () => {
    function Handleclick(id,ques,e){
      setQuizes(prevQuis => {
        return  prevQuis.map(num => {
          let allanswers = num.Answers.incorrect;
          let newAnswer = allanswers.map(item => {
            return item.key === id ? {...item, Clicked: !item.Clicked} : {...item, Clicked: num.question === ques ? false : item.Clicked}
          })
          return {...num, Answers: {...num.Answers, incorrect:newAnswer}}
        })
      })
    }



    let answers = quizes.map(num => {
      let key = nanoid()
      return (
        <div className='Container_quiz' key={key}>
          <h3><Markup content={num.question}/></h3>
          <div className='Container_quiz_answers'>
            <Answers Ques={num.question} incorrect={num.Answers.incorrect} correct={num.Answers.correct} onClick={Handleclick}/>
          </div>
        </div>
      )
    })
    return (answers)
  }
  let checkcorrect = () => {
    let answers = [];
    quizes.map(num => {
      num.Answers.incorrect.map(item => {
        if (item.Clicked && item.correct){
          answers.push(item.value)
        }
      })
    })
    setCorrectAnswers(answers.length)
  }
  function Checkanswers(){
    if (!EndGame){
      checkcorrect()
      setEndGame(true)
    }else {
      window.location.reload()
    }
    
  }



  useEffect(function() {
    setActivate(quizes.length !== 0 ? true : false)
  }, [quizes])


  return (
    <div className="Container">
      {Startgame ? <RenderQuestion /> : <Welcome start={Begin} quizes={activte}/>}
      {EndGame && <p>You Scored <span className='Last'>{CorrectAnswer}/5</span></p>}
      {Startgame && <button onClick={Checkanswers} className="check">{EndGame ? "Play Again" : "Check answers"}</button>}
      {EndGame && CorrectAnswer === 5 && <Confetti />}
    </div>
  );
}

export default App;