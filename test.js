"use strict";

// === UI helper functions
// The top three functions here are used in play(), the cute
// play-games-in-your-console function at the very bottom of this file.

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



// === The game of tic-tac-toe

function TicTacToe(board) {
    this.board = board;
}

TicTacToe.start = new TicTacToe("         ");

TicTacToe.triples = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
];

// returns 'X', 'O', or undefined
TicTacToe.prototype.computeWinner = function () {
    var board = this.board;
    for (var i = 0; i < TicTacToe.triples.length; i++) {
        var t = TicTacToe.triples[i];
        var p = board[t[0]];
        if (p !== ' ' && board[t[1]] === p && board[t[2]] === p)
            return p;
    }
    return undefined;
};

TicTacToe.prototype.moves = function () {
    var board = this.board;
    return this.computeWinner() === undefined
           ? [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(function (m) { return board[m] === ' '; })
           : [];
};

TicTacToe.prototype.scoreFinishedGame = function () {
    return this.computeWinner() === undefined ? 0 : 1;
};

TicTacToe.prototype.applyMove = function (move) {
    // Figure out if it's X's turn or not.
    var x = true;
    for (var i = 0; i < 9; i++) {
        if (this.board[i] !== ' ')
            x = !x;
    }

    var modifiedBoard =
        this.board.slice(0, move) +
        (x ? 'X' : 'O') +
        this.board.slice(move + 1, 9);
    return new TicTacToe(modifiedBoard);
};

TicTacToe.prototype.toString = function () {
    var s = "";
    var board = this.board;
    [0, 3, 6].forEach(function (y) {
        if (y !== 0)
            s += "-----------\n";
        [0, 1, 2].forEach(function (x) {
            if (x !== 0)
                s += "|";
            var c = board[y + x];
            s += " " + (c === " " ? String(y + x) : c);
            if (x !== 2)
                s += " ";
        });
        s += "\n";
    });
    return s;
};

// A few unit tests.
function assert(cond) { if (!cond) { debugger; throw new Error("unit test failed"); } }
assert(new TicTacToe("XOXOXOX  ").moves().length === 0);
assert(new TicTacToe("XOXOXOX  ").scoreFinishedGame() === 1);
assert(new TicTacToe("XO XO X  ").moves().length === 0);
assert(new TicTacToe("XO XO X  ").scoreFinishedGame() === 1);
assert(new TicTacToe("XOXOXXOXO").moves().length === 0);
assert(new TicTacToe("XOXOXXOXO").scoreFinishedGame() === 0);
assert(new TicTacToe("XOXOXO X ").moves().join(",") === "6,8");
assert(_annotateGame(new TicTacToe("OXXOOXX O"), "c", "h").isOver === true);
assert(_annotateGame(new TicTacToe("OXXOOXX O"), "c", "h").winner === "c");



// === A much simpler game: Pennies

function Pennies(n) {
    this.n = n;
}

Pennies.start = new Pennies(14);

Pennies.prototype.moves = function moves() {
    var self = this;
    return [1, 2, 3].filter(function (m) { return m <= self.n; });
};

Pennies.prototype.scoreFinishedGame = function() {
    return +1;
};

Pennies.prototype.applyMove = function (move) {
    return new Pennies(this.n - move);
};

Pennies.prototype.toString = function () {
    if (this.n == 1)
        return "There is just 1 penny left.";
    else
        return "There are " + this.n + " pennies left.";
};



// === Another simple game: Fifteen
// The game starts with the numbers 1 to 9 all sitting on the table.
// Players take turns taking a number. The goal is to pick the right numbers
// so that some set of exactly three of your numbers adds up to 15.

function Fifteen(p0, p1) {
    this.players = [p0, p1];

    function has(p, n) { return p.indexOf(n) !== -1; }

    this._winner = undefined;
    for (var a = 1; a <= 7; a++) {
        for (var b = a + 1; b <= 8; b++) {
            var c = 15 - (a + b);
            if (c > b && c <= 9) {
                if (has(p0, a) && has(p0, b) && has(p0, c)) {
                    this._winner = 0;
                    break;
                } else if (has(p1, a) && has(p1, b) && has(p1, c)) {
                    this._winner = 1;
                    break;
                }
            }
        }
    }

    if (this._winner === undefined) {
        this._moves = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (move) {
            return p0.indexOf(move) === -1 && p1.indexOf(move) === -1;
        });
    } else {
        this._moves = [];
    }
}

Fifteen.start = new Fifteen([], []);

Fifteen.prototype.moves = function () { return this._moves; };

Fifteen.prototype.scoreFinishedGame = function () {
    if (this._winner === undefined)
        return 0;
    else
        return +1;  // winner is always the player who moved last
};

Fifteen.prototype.applyMove = function (move) {
    var p0 = this.players[0];
    var p1 = this.players[1];

    if (p0.length === p1.length) {
        p0 = p0.concat(move);
    } else {
        p1 = p1.concat(move);
    }
    return new Fifteen(p0, p1);
};

Fifteen.prototype.toString = function () {
    return ("Your numbers: " + this.players[0].join(", ") + "\n" +
            "My numbers: " + this.players[1].join(", ") + "\n" +
            "Numbers still on the table: " + this._moves.join(", ") + "\n");
};




// === Some actual AI code

// All game objects have these methods:
//     GameClass.start - snapshot of the beginning of the game
//     game.moves() - returns an array of moves available to the current player.
//     game.scoreFinishedGame() - returns +1 if the last move won the game, 0 if it tied, -1 if it lost.
//     game.applyMove(move) - returns a new Game object, a snapshot of the game after taking the given move

// Returns an object {move: (the best move), score: (+1, -1, or 0)}.
function bestMoveAndScore(game) {
    var bestMove = undefined;
    var bestScore = -Infinity;
    game.moves().forEach(function (move) {
        var score = scoreMove(game, move);
        if (score > best.score) {
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

assert(bestMoveAndScore(new Fifteen([7, 5], [1])).move === 3);



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
            console.log("Your possible moves are: " + legalMoves.map(showMove).join(","));
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
                console.log("It's a tie!");
            play.__currentGame = undefined;
            return true;
        } else {
            return false;
        }
    }
}
