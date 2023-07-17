var gameBoard = (() => {

    var board = ['X','O','X','O','O','O','X','X','X'];
    
    //cache DOM
    const $board = document.querySelector('.gameBoard');
    const $pieces = document.querySelectorAll('.boardPiece');

    
    //bind events
    

    // render();
    const render = function() {
        for (let i = 0; i < $pieces.length; i++) {
            $pieces[i].setAttribute("id",`${board[i]}`);
        }
    }

    render();
    return {render, board};
})();

var playerFactory = function(moniker) {
//Grab all of gameBoard into playerFactory


    return {moniker};
}

const X = playerFactory('X');
const Y = playerFactory('Y');

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