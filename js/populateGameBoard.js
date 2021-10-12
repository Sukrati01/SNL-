import {LIGHT_BOX_COLOR, DARK_BOX_COLOR} from './constants.js'
import { getCenter } from './runAndMove.js';

export const addBoxes = () => {
    const gameBoard = document.querySelector(".game-board");

    let direction = 0; // left to right
    for (let i = 0; i < 100; i++) {
        const box = document.createElement("div");
        box.style.backgroundColor = LIGHT_BOX_COLOR;
        if (i % 2 === 0 && direction === 0)
            box.style.backgroundColor = DARK_BOX_COLOR; // make it as constants
        if (i % 2 !== 0 && direction === 1)
            box.style.backgroundColor = DARK_BOX_COLOR;

        box.classList.add("box");
        gameBoard.append(box);

        if ((i + 1) % 10 == 0)

            direction = 1 - direction;
    }
};

export const numberAllBoxes = () => {
    let boxes = document.querySelectorAll(".box");
    boxes.forEach((box, i) => {
      if (
        String(i).length == 1 ||
        (String(i).length == 2 && Number(String(i)[0]) % 2 == 0)
      )
        box.innerHTML = 100 - i;
      else
        box.innerHTML = Number(`${9 - Number(String(i)[0])}${String(i)[1]}`) + 1;
  
      box.setAttribute("id", box.innerHTML);

      // Uncomment to show centres of all boxes
      // box.innerHTML = box.innerHTML + ' ' + getCenter(box.innerHTML)[0] + ',' + getCenter(box.innerHTML)[1];
    });
  };
