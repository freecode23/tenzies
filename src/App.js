import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function App() {
  // 1. init the state of the dice array. Lazy init
  const [diceStateArr, setDiceStateArr] = React.useState(() => initDiceArray());
  const [tenzies, setTenzies] = React.useState(false);
  const [duration, setDuration] = React.useState({
    secondDisplay: 0,
    msDisplay: 0,
    msTotal: 0
  });
  const [isGameOn, setIsGameOn] = React.useState(() => { return true });


  // 2. generate new dice array - only called once
  // Start timer here
  function initDiceArray() {
    // console.log("init game--->" + tenzies.startTime);
    const newDiceArr = [];
    for (let i = 0; i < 10; i++) {
      // create dice obj
      const diceObj = {
        id: nanoid(),
        value: getRandomInt(6) + 1,
        isHeld: false
      }
      // push 

      newDiceArr.push(diceObj);
    }
    return newDiceArr;
  }



  // 3. create the array die JSX elements using map - called at every roll
  const dieJSXElements = diceStateArr.map(dieObj => {
    return <Die
      key={dieObj.id}
      id={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      holdDice={setArrHoldDie} />
  });

  function resetTimer() {
    setDuration({
      secondDisplay: 0,
      msDisplay: 0,
      msTotal: 0
    });
  }

  // 4. Check the winning state everytime diceState array changed
  // use useEffect because we are dealing with multiple states:
  // check dice array state, and set tenzies state
  React.useEffect(() => {
    // conditions:
    const allEqual = diceStateArr => diceStateArr.every(die => die === diceStateArr[0]);
    var allHeld = true;
    for (let i = 0; i < 10; i++) {
      // - check if all of the array are held
      if (!diceStateArr[i].isHeld) {
        allHeld = false;
      }
    }

    // If won
    if (allEqual && allHeld) {
      setTenzies(true);
      setIsGameOn(false);
    }
  }, [diceStateArr])

  /**
   * 
   * 5. Dice Setters
   */
  // 5.1 Function to change 1 element of the array
  function setArrHoldDie(id) {
    // - set new die
    setDiceStateArr(prevDiceArr => {
      // - map a new die
      return prevDiceArr.map(prevDice => {

        // - if id matches to the one we want to hold
        const newArrHoldDice = prevDice.id === id ?
          // - return the same obj, else return the previous one
          { ...prevDice, isHeld: true } : prevDice
        return newArrHoldDice;
      })
    })
  }

  React.useEffect(() => {
    let interval = null;

    // if game is on start counting
    if (isGameOn) {
      interval = setInterval(() => {
        setDuration(prevDuration => {


          return {
            secondDisplay: (prevDuration.msTotal + 1) > 1000 ? Math.round((prevDuration.msTotal + 1) / 1000) : 0,
            msDisplay: (prevDuration.msTotal + 1) % 1000,
            msTotal: (prevDuration.msTotal + 1)
          }

        });
      }, 1);

      // clean up if
    } else if (!isGameOn && (duration.msTotal !== 0)) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isGameOn, duration]);

  // 5.2 called at every clicking "roll"
  function rollOrNewGame() {

    // if play new Game after winning
    if (tenzies === true) {
      setTenzies(false);
      resetTimer();
      setIsGameOn(true);
      setDiceStateArr(initDiceArray)

    } else { //else roll
      // - get new diceArray
      setDiceStateArr(prevDiceArr => {
        // - return a new mapped dice
        return prevDiceArr.map(prevDice => {

          // - if its supposed to be held return it
          return prevDice.isHeld === true ?
            prevDice :
            // - else return a new obj
            {
              id: nanoid(),
              value: getRandomInt(6) + 1,
              isHeld: false
            }
        })
      })
    }
  }

  return (
    <div className="main-container">
      <main>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="time-container">
          <h3> {duration.secondDisplay}</h3>
          <h3> : </h3>
          <h3>{duration.msDisplay}</h3>
          <h3>seconds taken!</h3>
        </div>
        <div className="die-container">
          {dieJSXElements}
        </div>
        {/* onclick only takes void function */}
        <button onClick={rollOrNewGame}>{tenzies ? "New Game" : "Roll"}</button>
        {tenzies && <Confetti />}
      </main >
    </div >
  );
}

export default App;
