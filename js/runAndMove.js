import {DARK_BOX_COLOR, INITIAL_PIECE_OFFSET} from "./constants.js"
import {dieImages, snakesAndLadders} from "./gameConfig.js"
import {gamePageToWinningPage} from "./togglePages.js"
let turn = undefined;

let startCentreX = undefined;
let centreOffSet = undefined;


const getCenter = (id) => {
    const targetElement = document.getElementById(id);
    const centerX = targetElement.offsetLeft + targetElement.offsetWidth / 2;
    const centerY = targetElement.offsetTop + targetElement.offsetHeight / 2;
  
    return [centerX, centerY];
};

const initPositionGamePieces = () => {
  const [x, y] = getCenter("1");
  const piece1 = document.querySelector(".piece1");
  const piece2 = document.querySelector(".piece2");
  piece1.style.left = `${-x + 6*60}px`;
  piece1.style.top = `${y-INITIAL_PIECE_OFFSET - 9*60}px`;

  piece2.style.left = `${-x -INITIAL_PIECE_OFFSET + 6*60}px`;
  piece2.style.top = `${y -INITIAL_PIECE_OFFSET - 9*60}px`;

  [startCentreX, centreOffSet] =  [x, 2 * x];
};


const getCurrentPiceOffset = ()=>{
    if(turn == 0)
        return 0;
    
    return INITIAL_PIECE_OFFSET;
}

const getCurrentActivePiece = ()=>{
    let currPiece = undefined;
    if(turn === 0)
        currPiece = document.querySelector(".piece1");
    else 
        currPiece = document.querySelector(".piece2");
    return currPiece;
}


const getPositionCurrActivePiece = ()=>{
    const currPiece = getCurrentActivePiece()
    return [currPiece.style.left, currPiece.style.top];
}

const getBlockIDAtCurrActivePiece = ()=>{
    let [x, y] = getPositionCurrActivePiece();
    x = parseInt(x);
    y = parseInt(y);
    const currPieceOffSet = getCurrentPiceOffset()
    x += currPieceOffSet;
    y += INITIAL_PIECE_OFFSET;

    const rowNum = (y - startCentreX) / centreOffSet ;// 100 is at row 0
    const colNum = (x - startCentreX) / centreOffSet; // 100 is in col 0

    if(rowNum %2 == 0)
        return 100 - (rowNum)*10 - colNum;
    else 
        return 100 - (rowNum) * 10 - (10 - colNum - 1); 
}




const roll = (dieImg) => {
    return new Promise(async (resolve, reject)=>{
        dieImg.classList.add("shake");
        let dieValue = Math.floor(Math.random() * 6) + 1;
        new Audio('../assets/sounds/diceRoll.mp3').play();
        dieImg.setAttribute("src", `assets/images/dice/${dieImages[dieValue - 1]}`);
        
        await new Promise((resolve)=>
            setTimeout(() => {
                dieImg.classList.remove("shake");
                resolve()
            }, 1000)
        );
        resolve(dieValue);
    });
};



const getDirection = ()=>{
    let [x, y] = getPositionCurrActivePiece();
    x = parseInt(x);
    y = parseInt(y);
    const currPieceOffSet = getCurrentPiceOffset()
    x += currPieceOffSet;
    y += INITIAL_PIECE_OFFSET;

    const maxCoord = startCentreX + 9*centreOffSet;

    let direction = undefined;
    if((x === startCentreX || x === -startCentreX) && y === maxCoord) // ID  == '1'
        direction = 'right';
    else{
        let rowEvenOdd = undefined; // 0 for evenEnding and 1 for oddEnding
        if(((y - startCentreX)/ centreOffSet) % 2 != 0) // at evenEnding
            rowEvenOdd = 0;
        else 
            rowEvenOdd = 1; // at oddEnding
        
        if(rowEvenOdd === 0){
            if(x === maxCoord)
                direction = 'up';
            else 
            direction = 'right';
        }
        else{
            if(x === startCentreX)
            direction = 'up';
            else 
            direction = 'left';
        }
    }

    return direction;
}



const getCurrActiveInActiveTurn = ()=>{
    let currActiveTurn = undefined;
    let currInActiveTurn = undefined;
    if(turn === 0){
        currActiveTurn = document.querySelector(".turn1");
        currInActiveTurn = document.querySelector(".turn2");
    }
    else {
        currActiveTurn = document.querySelector(".turn2");
        currInActiveTurn = document.querySelector(".turn1");
    }

    return [currActiveTurn, currInActiveTurn];
}

const initialTurn = (mainTurn)=>{
    turn = mainTurn;
    const [currActiveTurn, currInActiveTurn] = getCurrActiveInActiveTurn();
    currActiveTurn.innerHTML = "Your turn";
    currActiveTurn.style.color = DARK_BOX_COLOR;
    currInActiveTurn.style.color = DARK_BOX_COLOR;
}

const changeTurn = ()=>{
    const [currActiveTurn, currInActiveTurn] = getCurrActiveInActiveTurn();
    currActiveTurn.innerHTML = "";
    currInActiveTurn.innerHTML = 'Your turn';
    turn = 1 - turn;

} 
const movePiece = (direction)=>{
    return new Promise(async(resolve, reject) => {
        const currPiece = getCurrentActivePiece()
        new Audio('../assets/sounds/move.mp3').play()
        if(direction === 'up')
            currPiece.style.top  = `${parseInt(currPiece.style.top)  - centreOffSet}px`;
        else if(direction === 'right')
            currPiece.style.left = `${parseInt(currPiece.style.left) + centreOffSet}px`;
        else if(direction === 'left')
            currPiece.style.left = `${parseInt(currPiece.style.left) - centreOffSet}px`;
        
        await new Promise(resolve => setTimeout(resolve, 400));
        resolve()
    });
}

const checkLaddersAndSnakes = ()=>{
    return new Promise(async(resolve, reject)=>{
        for(let i = 0; i< snakesAndLadders.length; i++){
            const snl = snakesAndLadders[i];
            if(Number(getBlockIDAtCurrActivePiece()) === snl[0]){
                new Audio('../assets/sounds/move.mp3').play()
                const currPiece = getCurrentActivePiece();
                let [newX, newY] = getCenter(snl[1]);
                newY -= INITIAL_PIECE_OFFSET;
                currPiece.style.top = `${newY}px`;
                currPiece.style.left = `${newX - getCurrentPiceOffset()}px`;
                await new Promise(resolve => setTimeout(resolve, 400));
                break;
            }
        }
        resolve();
    })
    
}

const rollAction = (dieValue)=>{
    return new Promise(async (resolve, reject)=>{
        if(getBlockIDAtCurrActivePiece() + dieValue > 100)
            resolve();
        else{
            for(let i = 1; i <= dieValue; i++){
                const direction = getDirection() // right, up, or down
                await movePiece(direction)
            }
            await checkLaddersAndSnakes();
        }
        if(getBlockIDAtCurrActivePiece() === 100){
            await new Audio('../assets/sounds/win.mp3').play()
            const winnerDeclarationText = document.querySelector('.winner-declaration-text');
            let winnerUserName = undefined;
            if(turn === 0)
                winnerUserName = document.querySelector('.first-player-name').innerHTML;
            else 
                winnerUserName = document.querySelector('.second-player-name').innerHTML;
            
            winnerDeclarationText.innerHTML = `${winnerUserName} won!`;
            gamePageToWinningPage(winnerUserName);
        }
        changeTurn();
        resolve();
    });
    
}

let stopRollCallback = false;
const addRollClickEventListener = (targetBtnClass, dieImg, mainTurn)=>{
    turn = mainTurn;
    const targetBtn = document.querySelector(targetBtnClass);
    targetBtn.addEventListener("click", async (e) => {
        if(!stopRollCallback){
            if((turn === 0 && targetBtnClass === ".roll-die-btn") || 
               (turn === 1 && targetBtnClass === ".roll-die-btn2")
            ){
                stopRollCallback = true;
                const dieValue = await roll(dieImg)
                await new Promise(resolve=> setTimeout(resolve, 400)) // before run
                await rollAction(dieValue)
                stopRollCallback = false;
            }
            
        }
    });
    return turn;
}



export {getCenter, initPositionGamePieces, addRollClickEventListener, initialTurn};


