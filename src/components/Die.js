import React from "react";

function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "#FFFFFF"
    }

    return (
        <div
            className="die-face"
            style={styles}
            onClick={() => props.holdDice(props.id)}
        >

            <h2 className="die-num">
                {props.value}
            </h2>
        </div >
    );
}

export default Die;
