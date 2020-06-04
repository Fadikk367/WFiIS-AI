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

    markTile(row, column, playerMarker) {
        const tile = this.tiles[row*3 + column];
        tile.classList = 'board__tile board__tile-disable';
        tile.textContent = playerMarker;
    }

    toggleModal() {
        this.showModal = !this.showModal;
        this.modal.style.display = this.showModal ? 'flex' : 'none';
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

    reset() {
        this.resetBoard();
        this.resultsBoard.textContent = '';
    }

    resetBoard() {
        this.tiles.forEach(tile => {
            tile.className = 'board__tile board__tile-active';
            tile.textContent = '';
        });
        this.resultsBoard.className = 'results';
    }   

    finishGame(results) {
        this.displayResult(results.outcome);
        this.showWinningCombination(results);
    }

    displayResult(outcome) {
        let message =  outcome === 'win' ? 'VICTORY!!!' : (outcome === 'loose' ? 'DEFEAT...' : 'TIE');
        const resultStyles = outcome === 'win' ? 'victory' : (outcome === 'loose' ? 'defeat' : 'tie');
        this.resultsBoard.textContent = message;
        this.resultsBoard.classList.add(resultStyles);
    }

    showWinningCombination(results) {
        this.blockBoard();
        const resultStyles = results.outcome === 'win' ? 'victory' : (results.outcome === 'loose' ? 'defeat' : 'tie');
        this.tiles[results.combination[0]].classList.add(resultStyles);
        this.tiles[results.combination[1]].classList.add(resultStyles);
        this.tiles[results.combination[2]].classList.add(resultStyles);
    }

    blockBoard() {
        this.tiles.forEach(tile => tile.className = 'board__tile');
    }
}
