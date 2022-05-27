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
    minDisplay: "00",
    secondDisplay: "0",
    msDisplay: "0",
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
      minDisplay: "00",
      secondDisplay: "00",
      msDisplay: "000",
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
          const secondsfloat = (prevDuration.msTotal + 1) / 1000;

          const min = String(Math.floor(secondsfloat / 60));
          console.log("ms:" + prevDuration.msTotal);
          const secOnly = String(secondsfloat % 60).split(".")[0];
          let msOnly = String(secondsfloat).split(".")[1];
          // Question error here + I only wantn to take the first 2
          // if (msOnly.length > 2) {
          //   console.log(msOnly);
          //   msOnly = msOnly.substring(0, 2);
          //   console.log(msOnly[0] + msOnly[1]);

          // }
          // console.log(`${min} : ${secondsfloat}`);
          return {
            minDisplay: min.length > 1 ? min : "0" + min,
            secondDisplay: secOnly.length > 1 ? secOnly : "0" + secOnly,
            msDisplay: msOnly,
            msTotal: prevDuration.msTotal + 1
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
    const min = Math.floor(61.918 / 60);
    console.log(`${min
      } : ${60.918} `);
    // if play new Game after winning
    if (tenzies === true) {
      setTenzies(false);

      // Question: If I want to refactor time component to another JS file, how can I do reset timer when game ends ?
      // This is resetting the object. So I cannot keep the duration object in timer.js?
      // I have to pass on the timer object?
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

        {/* Question3: What's the best way to refactor this? */}
        <div className="time-container">
          <div className="time-cell time-cell-left">
            <h3> {duration.minDisplay}</h3>
          </div>
          <div className="time-cell time-cell-dot">
            <h3>:</h3>
          </div>
          <div className="time-cell">
            <h3>{duration.secondDisplay}</h3>
          </div>
          <div className="time-cell time-cell-dot">
            <h3>.</h3>
          </div>
          <div className="time-cell time-cell-right">
            <h3> {duration.msDisplay}</h3>
          </div>
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
