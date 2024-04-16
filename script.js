const startDiv = document.getElementById('start');
const startButton = document.getElementById('startGame');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
const resultDiv = document.getElementById('result');
const startButtonDiv = document.getElementById('start').querySelector('div');

startButton.addEventListener('click', () => {
    const name1 = player1NameInput.value || 'Player 1';
    const name2 = player2NameInput.value || 'Player 2';
    GameController.startGame(name1, name2);
    displayController.render();
    startButton.textContent = 'Play Again';
});

const Gameboard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const markSpot = (index, player) => {
        if (board[index] === '') {
            board[index] = player.getMark();
            return true;
        }
        return false;
    };

    const checkWinner = () => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let condition of winConditions) {
            if (board[condition[0]] !== '' &&
                board[condition[0]] === board[condition[1]] &&
                board[condition[1]] === board[condition[2]]) {
                return { winner: board[condition[0]], combo: condition };
            }
        }

        if (board.every(cell => cell !== '')) {
            return { winner: 'tie' };
        }

        return null;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };

    return { getBoard, markSpot, checkWinner, resetBoard };
})();

const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;

    return { getName, getMark };
};

const GameController = (() => {
    let currentPlayer = null;
    let player1 = null;
    let player2 = null;
    let isGameOver = false;

    const startGame = (name1, name2) => {
        player1 = Player(name1, 'X');
        player2 = Player(name2, 'O');
        currentPlayer = player1;
        isGameOver = false;
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playTurn = (index) => {
        if (!isGameOver && Gameboard.markSpot(index, currentPlayer)) {
            switchPlayer();
            checkGameStatus();
        }
    };

    const checkGameStatus = () => {
        const result = Gameboard.checkWinner();
        if (result) {
            isGameOver = true;
            if (result.winner === 'tie') {
                resultDiv.textContent = 'It\'s a tie!';
            } else {
                resultDiv.textContent = `${currentPlayer.getName()} wins!`;
                scores[currentPlayer.getName().toLowerCase().replace(' ', '')]++;
                updateScoreboard();
            }
            startButton.textContent = 'Start Game';
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        isGameOver = false;
        resultDiv.textContent = '';
    };

    const getPlayerName = (playerNumber) => {
        return playerNumber === 1 ? player1.getName() : player2.getName();
    };

    return { startGame, playTurn, resetGame, getPlayerName };
})();

const displayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const player1NameDisplay = document.getElementById('player1NameDisplay');
    const player2NameDisplay = document.getElementById('player2NameDisplay');
    const player1Display = document.getElementById('player1Score');
    const player2Display = document.getElementById('player2Score');

    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            GameController.playTurn(index);
            render();
        });
    });

    resetButton.addEventListener('click', () => {
        GameController.resetGame();
        render();
    });

    const render = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.style.color = 'black'; // Reset cell marker color
        });

        player1NameDisplay.textContent = `Player 1: ${GameController.getPlayerName(1)}`;
        player2NameDisplay.textContent = `Player 2: ${GameController.getPlayerName(2)}`;
        player1Display.textContent = scores.player1;
        player2Display.textContent = scores.player2;

        const result = Gameboard.checkWinner();
        if (result && result.winner !== 'tie') {
            result.combo.forEach(index => {
                cells[index].style.color = 'rgb(214, 40, 40)';
                flicker(cells[index]);
            });
        }
    };

    const flicker = (element, count = 0) => {
        if (count >= 3) return;

        setTimeout(() => {
            element.style.color = 'black';
            setTimeout(() => {
                element.style.color = 'rgb(214, 40, 40)';
                flicker(element, count + 1);
            }, 300);
        }, 300);
    };

    return { render };
})();

let scores = {
    player1: 0,
    player2: 0
};

const updateScoreboard = () => {
    document.getElementById('player1Score').textContent = scores.player1;
    document.getElementById('player2Score').textContent = scores.player2;
};

// Update the scoreboard initially
updateScoreboard();
