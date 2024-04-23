// IIFE to encapsulate the game logic
const gameController = (() => {
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer;
    let player1;
    let player2;
    let winner;
    let gameActive = false;

    const playersFactory = (name, marker) => {
        return { name, marker };
    };

    const checkWin = () => {
        const winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let combo of winCombos) {
            if (gameBoard[combo[0]] !== '' &&
                gameBoard[combo[0]] === gameBoard[combo[1]] &&
                gameBoard[combo[1]] === gameBoard[combo[2]]) {
                winner = currentPlayer;
                highlightWin(combo);
                return true;
            }
        }

        if (!gameBoard.includes('')) {
            winner = 'Tie';
            return true;
        }

        return false;
    };

    const highlightWin = (combo) => {
        combo.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.style.color = 'rgb(214, 40, 40)';
            flicker(cell);
        });
    };

    const flicker = (cell) => {
        let color = 'rgb(0, 48, 73)';
        const flickerInterval = setInterval(() => {
            cell.style.color = color;
            color = (color === 'rgb(0, 48, 73)') ? 'rgb(214, 40, 40)' : 'rgb(0, 48, 73)';
        }, 500);

        setTimeout(() => {
            clearInterval(flickerInterval);
            cell.style.color = 'rgb(214, 40, 40)';
        }, 3000);
    };

    const startGame = () => {
        player1 = playersFactory(document.getElementById('player1Name').value, 'X');
        player2 = playersFactory(document.getElementById('player2Name').value, 'O');
        currentPlayer = player1;
        gameActive = true;
    };

    const resetGame = () => {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
        document.getElementById('result').textContent = '';
        document.getElementById('start').style.display = 'block';
        document.getElementById('game').style.display = 'none';
    };

    const resetMarkers = () => {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.style.color = 'rgb(0, 48, 73)';
        });
    };
    
    const playAgain = () => {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
        });
        document.getElementById('result').textContent = '';
        resetMarkers();
        gameActive = true;
    };
    
    const handleClick = (e) => {
        const index = e.target.getAttribute('data-index');
        if (gameBoard[index] === '' && gameActive) {
            gameBoard[index] = currentPlayer.marker;
            e.target.textContent = currentPlayer.marker;

            if (checkWin()) {
                if (winner !== 'Tie') {
                    document.getElementById('result').textContent = `The winner is: ${winner.name}`;
                } else {
                    document.getElementById('result').textContent = 'It\'s a Tie!';
                }
                gameActive = false;
            } else {
                currentPlayer = (currentPlayer === player1) ? player2 : player1;
            }
        }
    };

    return {
        startGame,
        resetGame,
        playAgain,
        handleClick
    };
})();

// Event Listeners
document.getElementById('startGame').addEventListener('click', () => {
    gameController.startGame();
    document.getElementById('start').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
});

document.getElementById('reset').addEventListener('click', gameController.resetGame);

document.getElementById('restart').addEventListener('click', () => {
    gameController.playAgain();
    document.getElementById('game').style.display = 'flex';
});

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', gameController.handleClick);
});
