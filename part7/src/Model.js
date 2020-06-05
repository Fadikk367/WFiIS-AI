class Player  {
    constructor(marker, isHuman = true) {
        this.marker = marker;
        this.isHuman = isHuman;
    }
}


class Model {
    constructor() {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        this.winningCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8], //horizonal
            [0,3,6],
            [1,4,7],
            [2,5,8], // vertical
            [0,4,8],
            [2,4,6] // diagonals
        ];

        this.round = 0;
        this.results = null;
        this.player1 = new Player('');
        this.player2 = new Player('', false);

        this.outcomes = {
            win: 1,
            loose: -1,
            tie: 0
        }
    }

    updateBoard(row, column, playerMarker) {
        this.board[row][column] = playerMarker;
        this.checkWinner();
    }

    getBestMove() {
        const board = this.getBoardCopy();
        let bestScore = -Infinity;
        let bestMove = {};
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                if (board[i][j] === '') {
                    board[i][j] = this.player2.marker;
                    let score = this.minimax(board, 0, false);
                    board[i][j] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {row: i, column: j};
                    }
                }
            }
        }
        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        let result = this.checkWinner(board, true);
        if (result !== null) 
            return  this.outcomes[result];
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    if (board[i][j] === '') {
                        board[i][j] = this.player2.marker;
                        let score = this.minimax(board, depth + 1, false);
                        board[i][j] = '';
                        if (score > bestScore)
                            bestScore = score;
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    if (board[i][j] === '') {
                        board[i][j] = this.player1.marker;
                        let score = this.minimax(board, depth + 1, true);
                        board[i][j] = '';
                        if (score < bestScore)
                            bestScore = score;
                    }
                }
            }
            return bestScore;
        }
    }

    checkWinner(tmpBoard = null, forAI = false) {
        const board = forAI ? [...tmpBoard[0], ...tmpBoard[1], ...tmpBoard[2]] : this.getFlatBoard();
        let outcome = null;
        for (let i = 0; i < this.winningCombinations.length; ++i) {
            const set = this.winningCombinations[i];

            if (
                board[set[0]] === board[set[1]] && 
                board[set[1]] === board[set[2]] &&
                board[set[0]] !== ''
            ) {
                const winnerMarker = board[set[0]];
                if (!forAI) {
                    this.results = {
                        outcome: this.player1.marker === winnerMarker ? 'win' : 'loose',
                        combination: set 
                    }
                }

                outcome = this.player1.marker === winnerMarker ? 'loose' : 'win';
                break;
            }
        }

        if (board.every(tile => tile !== '')) {
            if (!forAI) {
                this.results = {
                    outcome: 'tie',
                    combination: []
                }
            }
            outcome = 'tie';
        }
        return outcome;
    }

    isActiveTile(row, column) {
        const tile = this.board[row][column];
        return tile === '';
    }

    nextRound() {
        if (this.results !== null) {
            throw new Error('Game finished!');
        }
        this.round++;
    }

    setMarkers(selectedMarker) {
        this.player1.marker = selectedMarker;
        this.player2.marker = selectedMarker === 'O' ? 'X' : 'O';
    }

    clearState() {
        this.clearBoard();
        this.round = 0;
        this.results = null;
    }

    clearBoard() {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.round = 0;
    }

    getBoardCopy() {
        return [
            [...this.board[0]],
            [...this.board[1]],
            [...this.board[2]]
        ];
    }

    getResults() {
        return this.results;
    }

    getFlatBoard() {
        return [...this.board[0], ...this.board[1], ...this.board[2]];
    }

    getCurrentPlayer() {
        return this.round % 2 === 0 ? this.player1 : this.player2;
    }
}