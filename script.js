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

    const turnAnnounce = (moniker) => {
        console.trace();
        //Get counter # from gameLogic. Need locally scoped "counter" to determine whos turn it is.
        let turn = gameLogic.count().counter;
        console.log(`${moniker} hello`);
        if (turn%2) {
            $turnAnnouncer.innerHTML = `${O.moniker}'s turn!`;
        } else if (moniker == X) {
            $turnAnnouncer.innerHTML = `${X.moniker} won!`;
            return;
        }    else {
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
    var counter = '1';

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
        //Create arrays of each possible "win line"
        //Rows
        row1 = boardArray.slice(0,3);
        row2 = boardArray.slice(3,6);
        row3 = boardArray.slice(6,9);

        //Columns
         column1 = boardArray.filter((element,index)=> {
            if (index===0||index===3||index===6) {
                return true;
            }
            
        });

        column2 = boardArray.filter((element,index)=> {
            if (index===1||index===4||index===7) {
                return true;
            }
            
        });

        column3 = boardArray.filter((element,index)=> {
            if (index===2||index===5||index===8) {
                return true;
            }
            
        });

        //Diagonals
        diagonal1 = boardArray.filter((element,index)=> {
            if (index===0||index===4||index===8) {
                return true;
            }
            
        });

        diagonal2 = boardArray.filter((element,index)=> {
            if (index===2||index===4||index===6) {
                return true;
            }
            
        });


        //Check that every element is equal to the first element, but NOT default ''
        const isEqual = (element,index,array) => (element == array[0] && element !== '');

        //Declare method to check for tie, AKA is every box possible either an X or an O
        const sTie = boardArray.every(element => (element =="X"||element=="O"));

        //Iterate over each solution. Once a value of true is returned, stop the game.
        const solutions = [diagonal1,diagonal2,column1,column2,column3,row1,row2,row3];
        solutions.forEach((solution)=> {
            
            if (solution.every(isEqual)) {
                var winner = solution[0];
                endGame(winner);
            };
        });

        //Check for tie
        if (sTie) {(console.log('tie'))};

    };


    const endGame = (moniker) => {
        boardArray = ['','','','','','','','',''];
        boardPieces.forEach(piece => {
            piece.setAttribute('class','boardPiece empty');
        });
        gameBoard.turnAnnounce(moniker);
    }

return{count, startGame,boardArray};
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

