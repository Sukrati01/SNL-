const INITIAL_PIECE_OFFSET = 8;
let turn = Math.floor(Math.random()*2); // turn 0 is for player 1

const snakesAndLadders = [ // [from, to]
    [80, 21],
    [62, 4],
    [97, 39],
    [87, 14],
    [10, 30],
    [16, 43],
    [58, 85],
    [71, 91],
];

const addBoxes = () => {
  const gameBoard = document.querySelector(".game-board");

  let direction = 0;// left to right
  for (let i = 0; i < 100; i++) {
    const box = document.createElement("div");
    if (i % 2 === 0 && direction === 0) box.style.backgroundColor = "#9788b3"; // make it as constants
    if (i % 2 !== 0 && direction === 1) box.style.backgroundColor = "#9788b3";

    box.classList.add("box");
    gameBoard.append(box);

    if ((i + 1) % 10 == 0) direction = 1 - direction;
  }
};

addBoxes();

const getCenter = (id) => {
    const targetElement = document.getElementById(id);
    const centerX = targetElement.offsetLeft + targetElement.offsetWidth / 2;
    const centerY = targetElement.offsetTop + targetElement.offsetHeight / 2;
  
    return [centerX, centerY];
};


const numberAllBoxes = () => {
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
    // box.innerHTML = box.innerHTML + ' ' + getCenter(box.innerHTML)[0] + ',' + getCenter(box.innerHTML)[1];
  });
};

numberAllBoxes();
for(let i = 100; i >=1; i--)
    console.log(getCenter(i));

let [startCentreX, centreOffSet] = [undefined, undefined];

const initPositionGamePieces = () => {
  const [x, y] = getCenter("1");
  const piece1 = document.querySelector(".piece1");
  const piece2 = document.querySelector(".piece2");
  piece1.style.left = -x + "px";
  piece1.style.top = y -INITIAL_PIECE_OFFSET + "px";

  piece2.style.left = -x  - INITIAL_PIECE_OFFSET +"px";
  piece2.style.top = y -INITIAL_PIECE_OFFSET + "px";

  [startCentreX, centreOffSet] = [x, 2 * x];
};
initPositionGamePieces();

const dieImages = [
  "dice-01.svg",
  "dice-02.svg",
  "dice-03.svg",
  "dice-04.svg",
  "dice-05.svg",
  "dice-06.svg",
];

const dieImg = document.querySelector(".die-image");
const dieImg2 = document.querySelector(".die-image2");


const getCurrentActivePiece = ()=>{
    let currPiece = undefined;
    if(turn === 0)
        currPiece = document.querySelector(".piece1");
    else 
        currPiece = document.querySelector(".piece2");
    return currPiece;
}
const getCurrentInActivePiece = ()=>{
    let currPiece = undefined;
    if(turn === 1)
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

const getCurrentPiceOffset = ()=>{
    if(turn == 0)
        return 0;
    
    return INITIAL_PIECE_OFFSET;
}


const roll = (dieImg) => {
    return new Promise(async (resolve, reject)=>{
        dieImg.classList.add("shake");
        let dieValue = Math.floor(Math.random() * 6) + 1;
        dieImg.setAttribute("src", dieImages[dieValue - 1]);
        
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
    console.log(x, y)

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

const initialTurn = ()=>{
    const [currActiveTurn, currInActiveTurn] = getCurrActiveInActiveTurn();
    currActiveTurn.innerHTML = "Your turn";
    currActiveTurn.style.color = 'red';
    currInActiveTurn.style.color = 'red';
}

initialTurn();
const changeTurn = ()=>{
    const [currActiveTurn, currInActiveTurn] = getCurrActiveInActiveTurn();
    currActiveTurn.innerHTML = "";
    currInActiveTurn.innerHTML = 'Your turn';
    turn = 1 - turn;

}
const movePiece = (direction)=>{
    return new Promise(async(resolve, reject) => {
        const currPiece = getCurrentActivePiece()
        
        if(direction === 'up')
            currPiece.style.top  = parseInt(currPiece.style.top)  - centreOffSet + 'px';
        else if(direction === 'right')
            currPiece.style.left = parseInt(currPiece.style.left) + centreOffSet + 'px';
        else if(direction === 'left')
            currPiece.style.left = parseInt(currPiece.style.left) - centreOffSet + 'px';
        
        await new Promise(resolve => setTimeout(resolve, 400));
        resolve()
    });
}

const checkLaddersAndSnakes = ()=>{
    return new Promise(async(resolve, reject)=>{
        for(let i = 0; i< snakesAndLadders.length; i++){
            const snl = snakesAndLadders[i];
            if(Number(getBlockIDAtCurrActivePiece()) === snl[0]){
                const currPiece = getCurrentActivePiece();
                let [newX, newY] = getCenter(snl[1]);
                newY -= INITIAL_PIECE_OFFSET;
                currPiece.style.top = newY + 'px';
                currPiece.style.left = newX - getCurrentPiceOffset() + 'px';
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
            if(turn === 0)
                alert('player-one has won the match')
            else 
                alert('player two has won the match');
        }
        changeTurn();
        resolve();
    });
    
}

let stopRollCallback = false;
const addRollClickEventListener = (targetBtnClass, dieImg)=>{
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
}

addRollClickEventListener(".roll-die-btn", dieImg);
addRollClickEventListener(".roll-die-btn2", dieImg2);



