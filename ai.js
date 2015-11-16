// ai.js - The algorithm.
//
// This code is not commented line-by-line. There is a cool but
// long-winded explanation at:
// https://github.com/jorendorff/game-playing/blob/master/talk.md
//
// All game objects have these methods:
//     game.moves() returns an array of moves available to the current player.
//     game.scoreFinishedGame() is +1 if the last move won the game, 0 tied, -1 lost.
//     game.applyMove(move) returns a new Game object, how things look after taking that move

"use strict";


// Returns an object {move: (the best move), score: (+1, -1, or 0)}.
function bestMoveAndScore(game) {
    var bestMove = undefined;
    var bestScore = -Infinity;
    game.moves().forEach(function (move) {
        var score = scoreMove(game, move);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    });
    return {move: bestMove, score: bestScore};
}

// Returns a number indicating how good the proposed move is.
function scoreMove(game, move) {
    var after = game.applyMove(move);
    if (after.moves().length === 0)
        return after.scoreFinishedGame();

    // `after` is the snapshot that the opponent will see. What is their best reply?
    var reply = bestMoveAndScore(after);
    return -reply.score;
}


// === Tests

// These assertions depend on the game classes defined in game.js.
assert(scoreMove(new Pennies(1), 1) === 1);
assert(bestMoveAndScore(new Pennies(1)).move === 1);
assert(bestMoveAndScore(new Pennies(1)).score === 1);
assert(scoreMove(new Pennies(2), 1) === -1);
assert(scoreMove(new Pennies(2), 2) === 1);
assert(bestMoveAndScore(new Pennies(2)).move === 2);
assert(bestMoveAndScore(new Pennies(1)).score === 1);
assert(scoreMove(new Pennies(3), 1) === -1);
assert(bestMoveAndScore(new Pennies(3)).move === 3);
assert(bestMoveAndScore(new Pennies(1)).score === 1);
assert(bestMoveAndScore(new Pennies(4)).score === -1);

assert(bestMoveAndScore(new Fifteen([7, 5], [6])).move === 3);
