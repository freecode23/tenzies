import React from "react";

function Timer(props) {
    const styles = {
        backgroundColor: props.isWon ? "#f5ce42" : "black"
    }

    return (
        // How to change to not repeat the styles
        <div className="time-container" >
            <div className="time-cell time-cell-left" style={styles}>
                <h3> {props.timer.minDisplay}</h3>
            </div>
            <div className="time-cell time-cell-dot" style={styles}>
                <h3>:</h3>
            </div>
            <div className="time-cell" style={styles}>
                <h3>{props.timer.secondDisplay}</h3>
            </div>
            <div className="time-cell time-cell-dot" style={styles}>
                <h3>:</h3>
            </div>
            <div className="time-cell time-cell-right" style={styles}>
                <h3> {props.timer.msDisplay}</h3>
            </div>
        </div>

    );
}

export default Timer;