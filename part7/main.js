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
    }

    checkWinner() {
        const flatBoard = this.getFlatBoard();
        this.winningCombinations.forEach(set => {
            if (
                flatBoard[set[0]] === flatBoard[set[1]] && 
                flatBoard[set[1]] === flatBoard[set[2]] &&
                flatBoard[set[0]] !== ''
            ) {
                const winnerMarker = flatBoard[set[0]];
                const winner = this.player1.marker === winnerMarker ? this.player1 : this.player2;
                this.results = {
                    winner,
                    combination: set 
                }
                return;
            }
        })

        if (flatBoard.every(tile => tile !== '')) {
            this.results = {
                winner: 'tie',
                combination: []
            }
        }
    }

    getResults() {
        return this.results;
    }

    getFlatBoard() {
        return [...this.board[0], ...this.board[1], ...this.board[2]];
    }

    clearState() {
        this.clearBoard();
        this.round = 0;
        this.results = null;
    }

    nextRound() {
        if (this.results !== null) {
            throw new Error('Game finished!');
        }
        this.round++;
    }

    clearBoard() {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.round = 0;
    }

    setMarkers(selectedMarker) {
        this.player1.marker = selectedMarker;
        this.player2.marker = selectedMarker === 'O' ? 'X' : 'O';
    }

    getCurrentPlayer() {
        return this.round % 2 === 0 ? this.player1 : this.player2;
    }

    updateBoard(row, column, playerMarker) {
        this.board[row][column] = playerMarker;
        this.checkWinner();
    }

    isActiveTile(row, column) {
        const tile = this.board[row][column];
        return tile === '';
    }
}


class View {
    constructor() {
        this.tiles = [...document.querySelectorAll('.board__tile')];
        this.resultsBoard = document.querySelector('.results');
        this.modal = document.querySelector('.modal');

        this.startBtn = document.querySelector('.start_btn');
        this.restartBtn = document.querySelector('.restart_btn');

        this.selectCrossBtn = document.querySelector('.select_cross_btn');
        this.selectCircleBtn = document.querySelector('.select_circle_btn');

        this.showModal = false;
    }

    reset() {
        this.resetBoard();
        this.resultsBoard.textContent = '';
    }

    update(board) {
        this.tiles.forEach((tile, i) => {
            console.log(board[i]);
            switch(board[i]) {
                case 'X':
                    tile.textContent = 'X';
                    tile.className = 'board__tile board__tile-disable';
                    break;
                case 'O':
                    tile.textContent = 'O';
                    tile.className = 'board__tile board__tile-disable';
                    break;
                default:
                    tile.textContent = '';
                    tile.className = 'board__tile board__tile-active';
                    break;
            }
        })
    }

    toggleModal() {
        this.showModal = !this.showModal;
        this.modal.style.display = this.showModal ? 'flex' : 'none';
    }

    resetBoard() {
        this.tiles.forEach(tile => {
            tile.className = 'board__tile board__tile-active';
            tile.textContent = '';
        });
        this.resultsBoard.className = 'results';
    }   

    markTile(row, column, playerMarker) {
        const tile = this.tiles[row*3 + column];
        tile.classList = 'board__tile board__tile-disable';
        tile.textContent = playerMarker;
    }

    displayResult(winner) {
        let message = winner.isHuman ? 'VICTORY!!!' : 'DEFEAT...';
        const resultStyles = winner.isHuman ? 'victory' : 'defeat';
        this.resultsBoard.textContent = message;
        this.resultsBoard.classList.add(resultStyles);
    }

    blockBoard() {
        this.tiles.forEach(tile => tile.className = 'board__tile');
    }

    showWinningCombination(results) {
        this.blockBoard();
        const resultStyles = results.winner.isHuman ? 'victory' : 'defeat';
        this.tiles[results.combination[0]].classList.add(resultStyles);
        this.tiles[results.combination[1]].classList.add(resultStyles);
        this.tiles[results.combination[2]].classList.add(resultStyles);
    }

    finishGame(results) {
        this.displayResult(results.winner);
        this.showWinningCombination(results);
    }
}


class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.startBtn.addEventListener('click', this.handleStartGame);
        this.view.restartBtn.addEventListener('click', this.handleRestartGame);
        this.view.selectCrossBtn.addEventListener('click', this.handleMarkerSelection);
        this.view.selectCircleBtn.addEventListener('click', this.handleMarkerSelection);

    }

    handleStartGame = e => {
        this.view.reset();
        this.model.clearState();
        this.view.toggleModal();
        this.view.tiles.forEach(tile => tile.addEventListener('click', this.handlePlayerMove));
    }

    handleRestartGame = e => {
        this.view.reset();
        this.model.clearState();
        this.view.tiles.forEach(tile => tile.addEventListener('click', this.handlePlayerMove));
    }

    handleMarkerSelection = e => {
        const marker = e.target.textContent;
        this.model.setMarkers(marker);
        this.view.toggleModal();
    }

    clearEventListeners() {
        this.view.tiles.forEach(tile => tile.removeEventListener('click', this.handlePlayerMove));
    }

    endRound() {
        try {
            this.model.nextRound();
        } catch (err) {
            console.log(err.message);
            const results = this.model.getResults();
            this.clearEventListeners();
            this.view.finishGame(results);
        }
    }

    handlePlayerMove = e => {
        const row = Number(e.target.dataset.row);
        const column = Number(e.target.dataset.column);

        if (this.model.isActiveTile(row, column)) {
            const playerMarker = this.model.getCurrentPlayer().marker;
            this.model.updateBoard(row, column, playerMarker);
            const board = this.model.getFlatBoard();
            this.view.update(board);
        }
        this.endRound();
    }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);



