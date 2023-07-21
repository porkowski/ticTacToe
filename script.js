const gameBoard = (() => {

    //board array to be 9 items (3x3 grid)
    var board =['','','','','','','','',''];
  
    //cache DOM
    const $board = document.querySelector('.gameBoard');
    const $pieces = document.querySelectorAll('.boardPiece');

    //allow other factory function/module to inherit board
    const getBoard = () => board;

    return {getBoard, $board, $pieces,};
})();;





var playerFactory = function(moniker) {

    //function to indicate that ones' turn is completed
     const finishedTurn = () => {
         gameLogic.nextPlayer();
     }

    const playRound = (moniker) => {
        let boardArray = gameBoard.getBoard();
        //GRAB DOM ELEMENTS FROM gameBoard()
        const boardPieces= gameBoard.$pieces;
        const boardDom = gameBoard.$board;

        //ONLY LISTEN TO BOXES WITHOUT AN ID
   console.log(boardDom);

        //CONVERT NODELIST TO ARRAY TO USE ARRAY METHODS SUCH AS .indexOf
        const bPiecesArray = Array.from(boardPieces);


        //Create named function for event listener below
        function clicked(event) {
            console.log("clicked");
            const boxClickedIndex = bPiecesArray.indexOf(event.target);
            const clicked = event.target;
             //ONLY ADD 'X' OR 'O' IF THERE IS CURRENTLY NOBODY ON A BOX
            if ((boardArray[boxClickedIndex]=='')) {
               clicked.setAttribute("id",moniker);
               boardArray.splice(boxClickedIndex,1,moniker);
               finishedTurn();
            } 
        }

        boardDom.addEventListener("click", () => {
            clicked(event);
            },{once:true});
           
 }
    return {playRound, moniker};

}

const X = playerFactory('X');
const O = playerFactory('O');



const gameLogic = (() => {

const startGame = () => {
    X.playRound('X');
};

//Define counter for alternation function below
let counter = 2;

const nextPlayer = () => {
//Counter alternates players
     if (counter%2) {
         X.playRound('X');
         counter++;
     } else {
         O.playRound('O');
         counter ++;
     }

}
startGame();

return {nextPlayer};

})();




//Create instances of X and O



//BELOW FROM tobyPlaysTheUke

// @wmfsdev ⭐ gives some great insights, but it is also about starting to think about how we think. When we develop solutions or develop code, we are taking our own abstract thought patterns and formally expressing them in a synthetic language.

// But if we stop before we start coding, and think about playing the actual game, how might it go? What are the parts of a game?

// the players,
// the paper board they play on,
// the pencil the current player uses to make a mark,
// ... and one more thing. What do you think that final bit might be?


// There you go! @Porkowski ⭐ The mental model that both players share: an understanding of the rules, a mental map that changes as each play happens, a way to check that mental model to see if someone has won.

// That's exactly right!

// And that is the way the lesson suggests splitting things up. The Gameboard represents that "mental model" (or the state, in fancy talk), the DisplayController represents the paper (or the view), the Player factory instances represents each player, and the Game ties them all together.

// The Game might tell the DisplayController "hey, let me know the index of a clicked cell, 'kay?" And when it does, the Game might look at itself to see who the current player is, and then turn around and ask the Gameboard (the state) "Hey, can you place this person at this index?"

// The whole project becomes a conversation between parts, orchestrated by an overseeing Game.

