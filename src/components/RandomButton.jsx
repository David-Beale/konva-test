import React from "react";
import { viewState } from "../viewState";

export default function RandomButton() {
  const onClick = () => {
    const allCells = Object.keys(viewState.cellLookup);
    const randomCellIndex = Math.floor(Math.random() * allCells.length);
    const randomCell = allCells[randomCellIndex];

    viewState.cellLookup[randomCell].isClicked = true;
  };
  return (
    <div className="button-container">
      <div className="randomButton" onClick={onClick}>
        click me
      </div>
    </div>
  );
}
