class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.startBtn.addEventListener('click', this.handleStartGame);
        this.view.restartBtn.addEventListener('click', this.handleRestartGame);
        this.view.selectCrossBtn.addEventListener('click', this.handleMarkerSelection);
        this.view.selectCircleBtn.addEventListener('click', this.handleMarkerSelection);
    }

    handleStartGame = () => {
        this.view.reset();
        this.model.clearState();
        this.view.toggleModal();
        this.view.tiles.forEach(tile => tile.addEventListener('click', this.handlePlayerMove));
    }

    handleRestartGame = () => {
        this.view.reset();
        this.model.clearState();
        this.view.tiles.forEach(tile => tile.addEventListener('click', this.handlePlayerMove));
    }

    handleMarkerSelection = e => {
        const marker = e.target.textContent;
        this.model.setMarkers(marker);
        this.view.toggleModal();
    }

    handleAIMove() {
        const {row, column} = this.model.getBestMove();
        if (row === undefined || column === undefined) return;

        this.model.updateBoard(row, column, this.model.player2.marker);
        const newBoard = this.model.getFlatBoard();
        this.view.update(newBoard);
        this.endRound();
    }

    handlePlayerMove = e => {
        const row = Number(e.target.dataset.row);
        const column = Number(e.target.dataset.column);

        if (this.model.isActiveTile(row, column)) {
            const playerMarker = this.model.getCurrentPlayer().marker;
            this.model.updateBoard(row, column, playerMarker);
            const board = this.model.getFlatBoard();
            this.view.update(board);
            this.endRound();
            this.handleAIMove();
        }
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

    clearEventListeners() {
        this.view.tiles.forEach(tile => tile.removeEventListener('click', this.handlePlayerMove));
    }
}