const gameBoard = (() => {

    //board array to be 9 items (3x3 grid)
    var board =['','','','','','','','',''];
  
    //cache DOM
    const $board = document.querySelector('.gameBoard');
    const $pieces = document.querySelectorAll('.boardPiece');
    const $turnAnnouncer = document.querySelector('.turnAnnouncer');
    const $startButton = document.querySelector('.start1person');

    //allow other factory function/module to inherit board
    const getBoard = () => board;


    //Also, start game upon button click
    $startButton.addEventListener("click", ()=> {
        gameLogic.startGame();
        $turnAnnouncer.innerHTML = `${X.moniker}'s turn!`
    },{once:true});

    const turnAnnounce = () => {
        //Get counter # from gameLogic. Need locally scoped "counter" to determine whos turn it is.
        let turn = gameLogic.count().counter;
        if (turn%2) {
            $turnAnnouncer.innerHTML = `${O.moniker}'s turn!`;
        } else {
            $turnAnnouncer.innerHTML = `${X.moniker}'s turn!`;
        }
    };


    return {getBoard, $board, $pieces, turnAnnounce};
})();;




function playerFactory(moniker)  {
return {moniker}
};
const X = playerFactory('X');
const O = playerFactory('O');




const gameLogic = (() => {

    //GRAB DOM ELEMENTS FROM gameBoard()
    let boardArray = gameBoard.getBoard();
     const boardPieces= gameBoard.$pieces;
     const boardDom = gameBoard.$board;


    const startGame = () => {
        
        //CONVERT NODELIST TO ARRAY TO USE ARRAY METHODS SUCH AS .indexOf
        const bPiecesArray = Array.from(boardPieces);

        //Create named function for event listener below
        function clicked(event) {
            count().counter;
            //change HTML to who's turn it is
            gameBoard.turnAnnounce();
            count();
            const boxClickedIndex = bPiecesArray.indexOf(event.target);
            const clicked = event.target;
            clicked.setAttribute("class",`boardPiece ${mon}`);
            boardArray.splice(boxClickedIndex,1,mon);
            winLoseTracker(boardArray);
        };

        
         boardDom.addEventListener("click", (event) => {
             const target = event.target;
             while(target.getAttribute("class")=="boardPiece empty") {
             clicked(event);
             };
             });
           
    };

    //declare variables for counter function in clicked
    let counter = '1';

    const count = () => {
        if (counter%2) {
            mon = X.moniker;
            counter++;
        } else {
            mon = O.moniker;
            counter ++;
        }
        return{counter};
    };

    const winLoseTracker = (boardArray) => {
        console.log(boardArray);
    };

    winLoseTracker();
return{count, startGame};
})();





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

