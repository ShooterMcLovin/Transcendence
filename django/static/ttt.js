let flag = 1; // 1 for X, 0 for O

async function sendWinnerMessage(win, lose, pgame) {
    console.log(`Winner: ${win}, Loser: ${lose}, Game: ${pgame}`);
    try {
        const response = await fetch('/api/update-winner/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ winner: win, loser: lose, game: pgame }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'An unknown error occurred');
        }
        console.log('Game result updated successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}

function getCookie(name) {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
    return cookieValue ? decodeURIComponent(cookieValue) : null;
}

async function populatePlayerDropdowns() {
    const response = await fetch('/api/users/');
    const users = await response.json();
    const playerSelects = document.querySelectorAll('.player-select');

    playerSelects.forEach(select => {
        select.innerHTML = '';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.nickname || user.username;
            option.textContent = `${user.username} (${user.nickname || 'No nickname'})`;
            select.appendChild(option);
        });
    });
}

function updateTurnMessage() {
    const playerSelects = document.querySelectorAll('.player-select');
    const player1 = playerSelects[0].value;
    const player2 = playerSelects[1].value;
    const message = player1 !== player2 ? 
        `${flag === 1 ? player1 : player2}'s Turn` : 
        `${flag === 1 ? "X's" : "O's"} Turn`;

    document.getElementById('print').innerHTML = message;
}

function myfunc() {
    const board = Array.from({ length: 9 }, (_, i) => document.getElementById(`b${i + 1}`).value);
    const buttons = board.map((_, i) => document.getElementById(`b${i + 1}`));

    const winningCombinations = [
        [0, 1, 2], [0, 3, 6], [6, 7, 8], 
        [2, 5, 8], [0, 4, 8], [2, 4, 6], 
        [3, 4, 5], [1, 4, 7]
    ];

    const checkWin = (player) => winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );

    const playerSelects = document.querySelectorAll('.player-select');
    const player1 = playerSelects[0].value;
    const player2 = playerSelects[1].value;

    if (checkWin('X')) {
        document.getElementById('print').innerHTML = `${player1 !== player2 ? player1 : "X's"} has won`;
        sendWinnerMessage(player1, player2, 'Tic-Tac-Toe');
        buttons.forEach(btn => btn.disabled = true);
        buttons.forEach((btn, index) => { if (board[index] === 'X') btn.style.color = "red"; });
    } else if (checkWin('O')) {
        document.getElementById('print').innerHTML = `${player1 !== player2 ? player2 : "O's"} has won`;
        sendWinnerMessage(player2, player1, 'Tic-Tac-Toe');
        buttons.forEach(btn => btn.disabled = true);
        buttons.forEach((btn, index) => { if (board[index] === 'O') btn.style.color = "red"; });
    } else if (board.every(cell => cell === 'X' || cell === 'O')) {
        document.getElementById('print').innerHTML = "Match Tie";
    } else {
        flag = 1 - flag;
        updateTurnMessage();
    }
}

function myfunc_2() {
    // Reset the board
    Array.from({ length: 9 }, (_, i) => document.getElementById(`b${i + 1}`)).forEach(cell => {
        cell.value = '';  // Clear cell value
        cell.disabled = false;   // Enable the button
    });
    
    // Reset player selections
    document.querySelectorAll('.player-select').forEach(select => {
        select.selectedIndex = 0; // Reset selection
        select.disabled = false;   // Enable selection again on reset
    });
    
    updateTurnMessage();
}

// Lock player selection when the button is clicked
function lockPlayers() {
    document.querySelectorAll('.player-select').forEach(select => {
        select.disabled = true; // Disable player selection
    });
    updateTurnMessage(); // Reload the turn message after locking players
}

// Bind click handler for the reset button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('but').addEventListener('click', myfunc_2);
    document.getElementById('lockPlayers').addEventListener('click', lockPlayers); // Bind lock button
    populatePlayerDropdowns(); // Call to populate dropdowns
    myfunc_2(); // Reset the game state on load
});

// Handle cell clicks
const handleClick = (id) => {
    const cell = document.getElementById(id);
    if (cell.disabled) return;

    cell.value = flag === 1 ? "X" : "O";
    cell.disabled = true;
    myfunc();
};

// Bind click handlers to cells
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => handleClick(cell.id));
});

document.addEventListener('DOMContentLoaded', async () => {
    await populatePlayerDropdowns();
    myfunc_2();
});
