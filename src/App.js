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
  const [tenzies, setTenzies] = React.useState(
    {
      win: false,
      startTime: performance.now(),
      endTime: 0,
      elapsedTime: 0
    });

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
      setTenzies(prevTenzies => {
        console.log("start time:" + prevTenzies.startTime);
        console.log("end time:" + performance.now());
        // get end time and elapsed time
        return {
          ...prevTenzies,
          win: true,
          endTime: performance.now(),
          elapsedTime: Math.round((performance.now() - prevTenzies.startTime) / 1000)
        }
      });
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


  // 5.2 called at every clicking "roll"
  function rollOrNewGame() {
    // if tenzies (won)
    if (tenzies.win === true) {
      console.log("new game--->" + tenzies.startTime);
      setTenzies({
        win: false,
        startTime: performance.now(),
        endTime: 0,
        elapsedTime: 0
      });
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
    <div>
      <main>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="die-container">
          {dieJSXElements}
        </div>
        {/* onclick only takes void function */}
        <button onClick={rollOrNewGame}>{tenzies.win ? "New Game" : "Roll"}</button>
        {tenzies.win && <Confetti /> && <p>{tenzies.elapsedTime} seconds taken!</p>}
      </main >
    </div >
  );
}

export default App;
