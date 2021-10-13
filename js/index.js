import { addBoxes, numberAllBoxes} from "./populateGameBoard.js";
import {initialTurn, initPositionGamePieces, addRollClickEventListener} from './runAndMove.js'
import {startToGameListener, endToGamePageListener, endToHomePageListener, clearUserNamesFromStartPage, showUpdatedLeaderBoard} from './togglePages.js';

clearUserNamesFromStartPage();
showUpdatedLeaderBoard()
startToGameListener();
endToGamePageListener();
endToHomePageListener();




let turn = Math.floor(Math.random()*2); // turn 0 is for player 1

addBoxes();
numberAllBoxes();



const dieImg = document.querySelector(".die-image");
const dieImg2 = document.querySelector(".die-image2");

initialTurn(turn); // randomly initialize the turn

turn = addRollClickEventListener(".roll-die-btn", dieImg, turn);
turn = addRollClickEventListener(".roll-die-btn2", dieImg2, turn);


// Whenever window is resized, move the game pieces to new initial position 
window.addEventListener('resize', ()=>{
    initPositionGamePieces()
}, false)