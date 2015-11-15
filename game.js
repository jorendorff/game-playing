// game.js - Three examples of simple two-player games.
//
// These are games that the simplistic AI can play. The key criterion is:
// they're all short.

"use strict";


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

Pennies.prototype.describeMove = function (move) {
    var what;
    if (move === this.n) {  // game-winning move
        what = (move === 1 ? "one" :
                move === 2 ? "them both" :
                "all three");
    } else {
        what = (move === 1 ? "1 penny" : move + " pennies");
    }
    return "I'll take " + what + ".";
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
