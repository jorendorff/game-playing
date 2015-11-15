// ui.js - Play games against your computer in your browser's devtools console

"use strict";


// === UI helper functions
// The top three functions here are used in play(), the cute
// play-games-in-your-console function at the bottom of this file.
//
// These functions operate on the game classes in game.js.

// Return a game object that's a snapshot of a new game, right at the outset,
// before any turns are taken.
//
// Usage:
//     var game = setUpNewGame(TicTacToe);
//
function setUpNewGame(gameClass) {
    var game = gameClass.start;

    // Let's assume that at the outset of a game, it's not over yet...
    game.isOver = false;
    game.winner = undefined;

    return game;
}

// Compute the best possible move and returns a new game object that's a
// snapshot of the game after the computer takes its turn.
//
// Usage:
//     game = computerTakeYourTurn(game);
//
function computerTakeYourTurn(game) {
    var move = bestMoveAndScore(game).move;
    if (typeof game.describeMove === "function")
        console.log(game.describeMove(move));
    else
        console.log("My move is: " + move);
    return _annotateGame(game.applyMove(move), "computer", "human");
}

// Returns a new game object that's a snapshot of the game after the human
// player takes their turn.
//
// Usage:
//     game = humanTakeYourTurn(game, move);
//
function humanTakeYourTurn(game, move) {
    return _annotateGame(game.applyMove(move), "human", "computer");
}

function _annotateGame(game, lastPlayer, otherPlayer) {
    // Now let's just staple on a couple properties that tell if the game is
    // over or what. For the UI's convenience.
    game.isOver = game.moves().length === 0;
    if (game.isOver) {
        var score = game.scoreFinishedGame();
        if (score > 0)
            game.winner = lastPlayer;
        else if (score < 0)
            game.winner = otherPlayer;
        else
            game.winner = "tie";
    } else {
        game.winner = undefined;
    }

    return game;
}

assert(_annotateGame(new TicTacToe("OXXOOXX O"), "c", "h").isOver === true);
assert(_annotateGame(new TicTacToe("OXXOOXX O"), "c", "h").winner === "c");


// === Play in your very own JS console!

// To try it out, just open your browser's developer console and type:   play()
function play(arg) {
    if (arg === undefined)
        arg = TicTacToe;

    if (typeof arg === 'function') {
        // Start a new game.
        console.log("Welcome to " + arg.name + "!");
        play.__currentGame = setUpNewGame(arg);
        dumpGame();
        yourTurn();
    } else {
        // The user wants to make a move in the current game.

        // Is there a current game?
        var game = play.__currentGame;
        if (game === undefined) {
            console.log("To start a game, type:    play(TicTacToe)");
            console.log("Or:  play(Pennies)");
            return;
        }

        // Is the chosen move legal?
        var move = arg;
        var legalMoves = game.moves();
        if (!legalMoves.some(function (x) { return move === x; })) {
            console.log("That isn't a legal move!");
            console.log("Your possible moves are: " + legalMoves.map(showMove).join(", "));
            return;
        }

        // Go ahead and make the move.
        game = humanTakeYourTurn(game, move);
        play.__currentGame = game;
        dumpGame();
        if (checkGameOver())
            return;

        // Computer's reply.
        game = computerTakeYourTurn(game);
        play.__currentGame = game;
        console.log("OK, I took my turn.");
        dumpGame();
        if (checkGameOver())
            return;

        yourTurn();
    }

    function dumpGame() {
        play.__currentGame.toString().split("\n").forEach(function (line) {
            console.log(line);
        });
    }

    function showMove(move) {
        return window.uneval ? uneval(move) : String(move);
    }

    function yourTurn() {
        var moves = play.__currentGame.moves();
        var example = moves[0];
        console.log("It's your turn! Use the play() function to choose your next move. " +
                    "For example, you could enter:  play(" + showMove(moves[0]) + ")");
    }

    function checkGameOver() {
        var game = play.__currentGame;
        if (game.isOver) {
            console.log("*** GAME OVER ***");
            if (game.winner === "human")
                console.log("You win!");
            else if (game.winner === "computer")
                console.log("I win!");
            else
                console.log("It's a tie. Oh well.");
            play.__currentGame = undefined;
            return true;
        } else {
            return false;
        }
    }
}

console.log("Hi! Type play() to begin.");
