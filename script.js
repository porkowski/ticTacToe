const gameModeSelector = (() => {
    const $board = document.querySelector('.gameBoard');
    const $player2name = document.querySelector('.player2name');
    let $radioBtn = ''
    const $gameSelector =document.querySelector('.gameSelect');
    let gameMode = '';
    const gameModeSelected = () =>  gameMode;

    window.addEventListener("click", (event)=> {
        if (event.target.getAttribute('type') == 'radio') {
            $radioBtn = event.target.id;
            if ($radioBtn == 'humans') {
                $gameSelector.setAttribute('class','hidden');
                $board.setAttribute('class','gameBoard');
                gameMode ='humans';
            } else if ($radioBtn == 'AI') {
                $gameSelector.setAttribute('class','hidden');
                $board.setAttribute('class','gameBoard'); 
                $player2name.setAttribute('class','hidden');
                gameMode='AI';
            }
        };
    });
    return {$board,gameModeSelected};
})();


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
    //allow other factory function/module to inherit board
    const getBoard = () => board;

    
    //cache DOM
    $board = gameModeSelector.$board;
    const $pieces = document.querySelectorAll('.boardPiece');
    const $turnAnnouncer = document.querySelector('.turnAnnouncer');
    const $startButton = document.querySelector('.start1person');
    const $form = document.querySelector('.form');
    const $player1 = document.querySelector('#player1');
    const $player2 = document.querySelector('#player2');


        //If every piece in boardArray is empty (i.e new game or ended game)
        //restart the board. Also take usernames from forms and use as player
        //names
        $startButton.addEventListener("click", ()=> {
        //IF GAMEMODE IS HUMAN VS HUMAN (THIS WAS THE ORIGINAL CODE)
        if (gameModeSelector.gameModeSelected() == 'humans') {
            if ((board.every(element => element == '') && $player1.value != '' && $player2.value != '')) {
                $form.setAttribute('class','hidden');
                const player1name = $player1.value;
                const player2name = $player2.value;
                X.name=player1name;
                O.name=player2name;
            
                $pieces.forEach(piece => {
                    piece.setAttribute('class','boardPiece empty');
                });
                gameLogic.startGame();
                $turnAnnouncer.innerHTML = `${X.name}'s turn! (${X.moniker})`
                $startButton.innerHTML= '';
            } else if ($player1.value == '' && $player2.value =='') {
                $player1.setAttribute('id','redOutline');
                $player2.setAttribute('id','redOutline');
            }
            else if ($player1.value =='' ) {
                $player1.setAttribute('id','redOutline');
            } else if ($player2.value =='') {
                $player2.setAttribute('id','redOutline');
            };
        //IF GAMEMODE IS HUMAN VS AI (NEW CODE)
        } else if (gameModeSelector.gameModeSelected() == 'AI') {
            if ((board.every(element => element == '') && $player1.value != '')) {
                $form.setAttribute('class','hidden');
                const player1name = $player1.value;
                const player2name = 'AI';
                X.name=player1name;
                O.name=player2name;
            
                $pieces.forEach(piece => {
                    piece.setAttribute('class','boardPiece empty');
                });
                gameLogic.startGameAIhard();
                $turnAnnouncer.innerHTML = `${X.name}'s turn! (${X.moniker})`
                $startButton.innerHTML= '';
            } else if ($player1.value == '' ) {
                $player1.setAttribute('id','redOutline');
            };
        }});
  
        function turnAnnounce (moniker,name) {
            //Get counter # from gameLogic. Need locally scoped "counter" to determine whos turn it is.
            let turn = gameLogic.count().counter;
            //Initially, check if turnAnnounce is called with "moniker",
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

        function turnAnnounceAI (moniker,name) {

            //Initially, check if turnAnnounce is called with "moniker",
            //Which comes from endGame()
            if (moniker == 'X'|| moniker == "O") {
                $turnAnnouncer.innerHTML = `${name} (${moniker}) won!`;
            } else if (moniker == 'tie') {
                $turnAnnouncer.innerHTML = 'Its a tie!';
            } else {
                $turnAnnouncer.innerHTML = `${X.name}'s turn! (${X.moniker})`;

            };
        };




    return {getBoard, board, $pieces, turnAnnounce, turnAnnounceAI,$startButton, $turnAnnouncer};
})();;



const gameLogic = (() => {

    //GRAB DOM ELEMENTS FROM gameBoard()
     let boardArray = gameBoard.board;
     const boardPieces= gameBoard.$pieces;
     const boardDom = gameModeSelector.$board;
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

        const startGameAI = () => {
            
            //CONVERT NODELIST TO ARRAY TO USE ARRAY METHODS SUCH AS .indexOf
            const bPiecesArray = Array.from(boardPieces);

            //Create named function for event listener below
            function clicked(event) {

                //change HTML to who's turn it is
                gameBoard.turnAnnounceAI();
                const boxClickedIndex = bPiecesArray.indexOf(event.target);
                const clicked = event.target;
                clicked.setAttribute("class",`boardPiece X`);
                boardArray.splice(boxClickedIndex,1,'X');

                //AI's turn
                //Grab index values of boardArray that are empty & choose a random one.
                const usedIndeces = [];
                boardArray.forEach((element,index) => {if (element == '') usedIndeces.push(index) });
                if (usedIndeces.length >1) {
                const randomIndex = usedIndeces[Math.floor(Math.random()*usedIndeces.length)];
                boardArray.splice(randomIndex,1,'O');
                bPiecesArray[randomIndex].setAttribute("class",'boardPiece O');
                };
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

        const startGameAIhard = () => {
            
            //CONVERT NODELIST TO ARRAY TO USE ARRAY METHODS SUCH AS .indexOf
            const bPiecesArray = Array.from(boardPieces);

            //Create named function for event listener below
            function clicked(event) {
                
                //change HTML to who's turn it is
                gameBoard.turnAnnounceAI();
                const boxClickedIndex = bPiecesArray.indexOf(event.target);
                const clicked = event.target;
                clicked.setAttribute("class",`boardPiece X`);
                boardArray.splice(boxClickedIndex,1,'X');

                //AI's turn

                const AIhardmove = (index) => {
                    boardArray.splice(index,1,'O');
                    bPiecesArray[index].setAttribute("class",'boardPiece O');
                    winLoseTracker(boardArray);
                };

                //Find first empty index in a winnin line for O
                const findEmptyWinIndex = (mainindex) => {
                    console.trace();
                    if (mainindex == 0) {
                        boardArray.find((element,index)=> {
                            if (element == '' && (index == 0 || index == 4 || index == 8)) {
                                console.log('found');
                                AIhardmove(index); 
                                return true;
                            }}
                        )
                    } else if (mainindex == 1) {
                        boardArray.find((element,index)=> {
                            if (element == '' && (index == 2 || index == 4 || index == 6)) {
                                AIhardmove(index); 
                                return true;
                            }}
                        )
                    } else if (mainindex == 2) {
                        boardArray.find((element,index)=> {
                            if (element == '' && (index == 0 || index == 3 || index == 6)) {
                                AIhardmove(index); 
                                return true;
                            }}
                        )
                    } 
                    else if (mainindex == 3) {
                        boardArray.find((element,index)=> {
                            if (element == '' && (index == 1 || index == 4 || index == 7)) {
                                AIhardmove(index); 
                                return true;
                            }}
                        )
                    }
                    else if (mainindex == 4) {
                        boardArray.find((element,index)=> {
                            if (element == '' && (index == 2 || index == 5 || index == 8)) {
                                AIhardmove(index); 
                                return true;
                            }}
                        )
                    }
                    else if (mainindex == 5) {
                        boardArray.find((element,index)=> {
                            if (element == '' && (index == 0 || index == 1 || index == 2)) {
                                AIhardmove(index); 
                                return true;
                            }}
                        )
                    }else if (mainindex == 6) {
                        boardArray.find((element,index)=> {
                            if (element == '' && (index == 3 || index == 4 || index == 5)) {
                                AIhardmove(index); 
                                return true;
                            }}
                        )
                    }
                    else if (mainindex == 7) {
                        boardArray.find((element,index)=> {
                            if (element == '' && (index == 6 || index == 7 || index == 8)) {
                                AIhardmove(index); 
                                return true;
                            }}
                        )
                    }

                }; 

                
                //grab solutions from below
                const solutions = winLoseTracker(boardArray).solutions;

                if (boardArray[4] =='') {
                    AIhardmove(4);
                } else {
                //Find first possible solution
                solutions.findIndex((solution,index)=> {
                    if (solution.toString() == "O,,O" || solution.toString() == "O,O," || solution.toString()== ",,O,O") {
                        findEmptyWinIndex(index);
                        return true;
                    }   else if (!solution.includes('X') && solution.includes('O')) {
                        findEmptyWinIndex(index);
                        return true;
                    }
                }
                )
            }
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

        const count = ()=>{
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
            return {solutions};
        };


        const endGame = (moniker, name) => {
            gameBoard.turnAnnounce(moniker,name );
            resetBoard();
            gameBoard.$startButton.innerHTML = '<button>Restart Game</button>';
        };


        const resetBoard = () => {
        boardArray.splice(0,9,'','','','','','','','','');
        }
    

return{count, startGame, startGameAI, startGameAIhard, boardArray, resetBoard};
})();

