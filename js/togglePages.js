import {initPositionGamePieces} from './runAndMove.js'
import { MAX_ENTRIES_IN_LEADER_BOARD, LOCAL_STORAGE_LEADER_BOARD_DATA} from './constants.js';

const clearUserNamesFromStartPage = ()=>{
    const userNames = document.querySelectorAll('.user-name-input');
    userNames[0].value = "";
    userNames[1].value = "";
}

const updateLeaderBoard = (winnerUserName)=>{
    winnerUserName =  winnerUserName.toLowerCase();
    
    const leaderBoardData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LEADER_BOARD_DATA));
    
    const players = leaderBoardData.players;

    let userNameFound = false;
    for(let player of players){
        if(player.userName === winnerUserName){
            player.score = player.score + 1;
            userNameFound = true;
            break;
        }
    }

    if(!userNameFound){
        players.push({
            userName: winnerUserName,
            score: 1,
        })
    }

    localStorage.setItem(LOCAL_STORAGE_LEADER_BOARD_DATA, JSON.stringify(
        {
            players: players
        }
    ))
}

const showUpdatedLeaderBoard = () => {
    const leaderBoardData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LEADER_BOARD_DATA));
    const players = leaderBoardData.players;

    players.sort((a, b)=> b.score - a.score)
    const rankTableBody = document.querySelector('.rank-table-body');
    const newRankTableBodyChildren = []
    for(let i = 1; i<= Math.min(players.length, MAX_ENTRIES_IN_LEADER_BOARD); i++){
        const rankTableRow = document.createElement('tr');
        rankTableRow.classList.add('rank-table-row');

        const rankTD = document.createElement('td');
        rankTD.classList.add('rank');
        rankTD.classList.add('funky');
        rankTD.innerHTML = i;

        const userNameTD = document.createElement('td');
        userNameTD.classList.add('username');
        userNameTD.innerHTML = players[i-1].userName;

        const scoreTD = document.createElement('td');
        scoreTD.classList.add("score");
        scoreTD.innerHTML = players[i-1].score;

        rankTableRow.append(rankTD);
        rankTableRow.append(userNameTD);
        rankTableRow.append(scoreTD);

        newRankTableBodyChildren.push(rankTableRow);
    }

    rankTableBody.replaceChildren(...newRankTableBodyChildren)
}

// From Landing page to game page 
const startToGameListener = ()=>{
    const startBtn = document.querySelector('.start-btn');
    startBtn.addEventListener('click', (e)=>{
        const userNames = document.querySelectorAll('.user-name-input');
        document.querySelector('.first-player-name').innerHTML = userNames[0].value;
        document.querySelector('.second-player-name').innerHTML = userNames[1].value;

        const startPage = document.querySelector('.start-page'); 
        startPage.style.display = "none";
        
        const gamePage = document.querySelector('.game-page')
        gamePage.style.display = "block";
        initPositionGamePieces();
    })
}



// From Winning page to Game Page
const endToGamePageListener = ()=>{
    const playAgainBtn = document.querySelectorAll('.action-btn')[0];
    playAgainBtn.addEventListener('click', (e)=>{
        const endPage = document.querySelector('.end-page')
        endPage.style.display = "none";

        const gamePage = document.querySelector('.game-page')
        gamePage.style.display = "block";
        initPositionGamePieces();
    })
}



// From Winning page to Game Home page
const endToHomePageListener = ()=>{
    const homeBtn = document.querySelectorAll('.action-btn')[1];
    homeBtn.addEventListener('click', (e)=>{
        const endPage = document.querySelector('.end-page')
        endPage.style.display = "none";

        clearUserNamesFromStartPage()
        showUpdatedLeaderBoard()

        const startPage = document.querySelector('.start-page'); 
        startPage.style.display = "block";
    })
}

// From Game page to Winning Page
const gamePageToWinningPage = (winnerUserName)=>{
    const gamePage = document.querySelector('.game-page')
    gamePage.style.display = "none";

    updateLeaderBoard(winnerUserName)

    const endPage = document.querySelector('.end-page')
    endPage.style.display = "flex";
}

export {startToGameListener, endToGamePageListener, endToHomePageListener, clearUserNamesFromStartPage, gamePageToWinningPage, showUpdatedLeaderBoard};