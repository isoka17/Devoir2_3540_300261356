document.addEventListener('DOMContentLoaded', function() {
    const cells = document.querySelectorAll('.cell');
    const currentTurnElement = document.querySelector('.current-turn');
    const resetButton = document.querySelector('.reset button');
    const closeButton = document.getElementById('close');
    const overlay = document.getElementById('overlay');
    let turn = true; // true for player 1, false for player 2

    const player1 = {
        symbol: '<i class="fa fa-times"></i>',
        played: [],
        score: 0,
    };

    const player2 = {
        symbol: '<i class="fa fa-circle-o"></i>',
        played: [],
        score: 0,
    };

    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    cells.forEach((cell, i) => {
        cell.addEventListener('click', () => {
            if (cell.innerHTML.trim() === '') {
                const currentPlayer = turn ? player1 : player2;
                addSymbol(currentPlayer, i);
                currentPlayer.played.push(i);

                if (checkWin(currentPlayer)) {
                    showWinner(currentPlayer);
                } else if (isDraw()) {
                    showDraw();
                } else {
                    turn = !turn; // Change turn
                    updateTurnDisplay();
                }
            }
        });
    });

    function addSymbol(player, i) {
        cells[i].innerHTML = player.symbol;
    }

    function checkWin(player) {
        return winCombos.some(combo => combo.every(index => player.played.includes(index)));
    }

    function showWinner(player) {
        let winnerName = player === player1 ? 'Player 1' : 'Player 2';
        document.querySelector('#message .content').innerHTML = `${winnerName} is the <h2>Winner!</h2>`;
        overlay.style.display = 'flex';

        // Increment the winner's score
        player.score++;

        // Update the DOM with the new score
        if (player === player1) {
            document.querySelector('.score1').textContent = player1.score;
        } else {
            document.querySelector('.score2').textContent = player2.score;
        }
    }

    function updateTurnDisplay() {
        currentTurnElement.innerHTML = turn ? 'Player 1' : 'Player 2';
    }

    function isDraw() {
        return [...cells].every(cell => cell.innerHTML.trim() !== '') && !checkWin(player1) && !checkWin(player2);
    }

    function showDraw() {
        document.querySelector('#message .content').innerHTML = `<h2>It's a Draw!</h2>`;
        overlay.style.display = 'flex';

        // Increment the draw count
        let drawCountElement = document.querySelector('.draw');
        let drawCount = parseInt(drawCountElement.textContent);
        drawCountElement.textContent = (drawCount + 1).toString();
    }

    resetButton.addEventListener('click', resetGame);

    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        resetGame();
    });

    function resetGame() {
        cells.forEach(cell => cell.innerHTML = '');
        player1.played = [];
        player2.played = [];
        turn = true;
        updateTurnDisplay();
        overlay.style.display = 'none';
    }

    // Initialize the game state
    resetGame();
});
