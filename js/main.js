import { addBoxes, numberAllBoxes} from "./populateGameBoard.js";
import {initialTurn, initPositionGamePieces, addRollClickEventListener} from './runAndMove.js'

let turn = Math.floor(Math.random()*2); // turn 0 is for player 1

addBoxes();
numberAllBoxes();
initPositionGamePieces();


const dieImg = document.querySelector(".die-image");
const dieImg2 = document.querySelector(".die-image2");

initialTurn(turn);
turn = addRollClickEventListener(".roll-die-btn", dieImg, turn);
turn = addRollClickEventListener(".roll-die-btn2", dieImg2, turn);


// Whenever window is resized, move the game pieces to new initial position 
window.addEventListener('resize', ()=>{
    initPositionGamePieces()
}, false)