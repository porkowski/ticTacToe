function playerFactory(moniker,name)  {

    return {moniker,name}
    };

//Create X and O with monikers to start the game. 
//Names for each player added later.
const X = playerFactory('X');
const O = playerFactory('O');

const gameBoard = (() => {

    //board array to be 9 items (3x3 grid)
    let board =['','','','','','','','',''];
  
    //cache DOM
    const $board = document.querySelector('.gameBoard');
    const $pieces = document.querySelectorAll('.boardPiece');
    const $turnAnnouncer = document.querySelector('.turnAnnouncer');
    const $startButton = document.querySelector('.start1person');
    const $form = document.querySelector('.form');
    const $player1 = document.querySelector('#player1');
    const $player2 = document.querySelector('#player2');

    //allow other factory function/module to inherit board
    const getBoard = () => board;


    //Also, start game upon button click
        //Only once, take form elements, create players, and hide form
        $startButton.addEventListener("click", ()=> {
            $form.setAttribute('class','hidden');
            const player1name = $player1.value;
            const player2name = $player2.value;
            X.name=player1name;
            O.name=player2name;
        },{once:true});



    //If every piece in boardArray is empty (i.e new game or ended game)
    //restart the board
    $startButton.addEventListener("click", ()=> {
        if (board.every(element => element == '')) {
            $pieces.forEach(piece => {
                piece.setAttribute('class','boardPiece empty');
            });
            gameLogic.startGame();
            $turnAnnouncer.innerHTML = `${X.name}'s turn! (${X.moniker})`
            $startButton.innerHTML= '';
        };
    });

    const turnAnnounce = (moniker,name) => {
        //Get counter # from gameLogic. Need locally scoped "counter" to determine whos turn it is.
        let turn = gameLogic.count().counter;
        //Initially, check if turnAnnounce is call with "moniker",
        //Which comes from endGame()
        if (moniker == 'X'|| moniker == "O") {
            $turnAnnouncer.innerHTML = `${name} (${moniker}) won!`;
         } else if (moniker == 'tie') {
             $turnAnnouncer.innerHTML = 'Its a tie!';
         } else if (turn%2) {
            $turnAnnouncer.innerHTML = `${O.name}'s turn! (${O.moniker})`;
            return;
        }    else {
            $turnAnnouncer.innerHTML = `${X.name}'s turn! (${X.moniker})`;
        }
    };


    return {getBoard, board, $board, $pieces, turnAnnounce, $startButton, $turnAnnouncer};
})();;










const gameLogic = (() => {

    //GRAB DOM ELEMENTS FROM gameBoard()
    let boardArray = gameBoard.board;
     const boardPieces= gameBoard.$pieces;
     const boardDom = gameBoard.$board;
     const turnAnnouncer = gameBoard.$turnAnnouncer;

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
             //While piece is empty && the word "turn" is displayed, i.e nobody won
             //nor is there a tied game
             while(target.getAttribute("class")=="boardPiece empty" && turnAnnouncer.innerHTML.includes('turn')) {
             clicked(event);
             };
             });
           
    };

    //declare for counter function in clicked
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
                let moniker = solution[0];
                if (moniker == 'X') {
                    endGame(moniker,X.name);
                } else if (moniker == 'O') {
                    endGame(moniker,O.name);
                }
        //Check if there is a tie. If there is, need to include an && 
        //operator to only fire off the endGame function ONCE.
        //This is because this if/else conditional is within an array loop
            } else if (sTie && solution == solutions[0]) {
                    let moniker = 'tie';
                    endGame(moniker);
            };
        });

    };


    const endGame = (moniker, name) => {
        gameBoard.turnAnnounce(moniker,name );
        resetBoard();
        gameBoard.$startButton.innerHTML = '<button>Restart Game</button>';
        gameBoard.$startButton.setAttribute('class','start1person restart');

    };


    const resetBoard = () => {
       boardArray.splice(0,9,'','','','','','','','','');

    }
return{count, startGame,boardArray, resetBoard};
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

