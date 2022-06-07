import React from "react";
import Die from "./components/Die";
import Timer from "./components/Timer";
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function App() {
  // 1. Initialize all states. Lazy init the array since we are using function
  const [diceStateArr, setDiceStateArr] = React.useState(() => initDiceArray());
  const [isGameOn, setIsGameOn] = React.useState(() => { return true });
  const [isWon, setIsWon] = React.useState(false); // winning state
  const [timer, setTimer] = React.useState({
    minDisplay: "00",
    secondDisplay: "0",
    msDisplay: "0",
    msTotal: 0
  });

  // 2. Generate new dice array - only called once
  // this function will get called at every render if we dont do lazy init
  function initDiceArray() {
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

  // 3. diceArray setter
  // Function to change 1 element of the array
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

  // 4. timer state setter
  function resetTimer() {
    setTimer({
      minDisplay: "00",
      secondDisplay: "00",
      msDisplay: "000",
      msTotal: 0
    });
  }

  // 5. At every change of dice array, check if won and if game is on
  // use useEffect because we are dealing with multiple states:
  // check dice array state, and set isWon state
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
      setIsWon(true);
      setIsGameOn(false);
    }
  }, [diceStateArr])

  // 6. At every change of is game on and timer, display new time
  React.useEffect(() => {
    let interval = null;

    // if game is on start counting
    if (isGameOn) {
      interval = setInterval(() => {
        setTimer(prevtimer => {
          const secondsfloat = (prevtimer.msTotal + 1) / 1000;

          const min = String(Math.floor(secondsfloat / 60));
          console.log("ms:" + prevtimer.msTotal);
          const secOnly = String(secondsfloat % 60).split(".")[0];
          let msOnly = String(secondsfloat).split(".")[1];

          // Question 3: error here + I only want to take the first 2
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
            msTotal: prevtimer.msTotal + 1
          }
        });
      }, 1);

      // clean up if
    } else if (!isGameOn && (timer.msTotal !== 0)) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isGameOn, timer]);


  // 7. called at every clicking "roll"
  const resetTimerFunc = React.useRef(null)
  function rollOrNewGame() {
    // if play new Game after winning
    if (isWon === true) {
      setIsWon(false);
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


  // 8. Create the array die JSX elements using map - called at every roll
  const dieJSXElements = diceStateArr.map(dieObj => {
    return <Die
      key={dieObj.id}
      id={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      holdDice={setArrHoldDie}
      resetTimer={resetTimerFunc}
    />
  });

  return (
    <div className="main-container">
      <main>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

        <Timer
          isGameOn={isGameOn}
          isWon={isWon}
          timer={timer}
        />

        <div className="die-container">
          {dieJSXElements}
        </div>
        {/* onclick only takes void function */}
        <button onClick={rollOrNewGame}>{isWon ? "New Game" : "Roll"}</button>
        {isWon && <Confetti />}
      </main >
    </div >
  );
}

export default App;

