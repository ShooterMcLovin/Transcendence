// Function to send winner data to the server
function sendWinnerMessage(win, lose, pgame) {
    console.log(`Winner: ${win}, Loser: ${lose}, Game: ${pgame}`);

    fetch('/api/update-winner/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ winner: win, loser: lose, game: pgame }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                console.error('Server responded with error:', data);
                throw new Error(data.message || 'An unknown error occurred');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            console.log('Game result updated successfully.');
        } else {
            console.error(`Error: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to get a cookie value
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// Initialize turn flag
let flag = 1; // 1 for X, 0 for O
const player1Select = document.getElementById('Challenger'); 
const player2Select = document.getElementById('Challenged');
const player1 = player1Select ? player1Select.value : '';
const player2 = player2Select ? player2Select.value : '';
if (player1 != player2)
	document.getElementById('print').innerHTML = flag === 1 ? player1 + "'s Turn" : player2 + "'s Turn";
else
	document.getElementById('print').innerHTML = flag === 1 ? "X's Turn" : "O's Turn";
// Function to handle the game logic and display results
function myfunc() {
    // Get current values of the board
    const board = Array.from({ length: 9 }, (_, i) => document.getElementById(`b${i + 1}`).value);

    // Get button elements for disabling and styling
    const buttons = board.map((_, i) => document.getElementById(`b${i + 1}`));

    // Winning combinations
    const winningCombinations = [
        [0, 1, 2], [0, 3, 6], [6, 7, 8], [2, 5, 8], [0, 4, 8], [2, 4, 6], [3, 4, 5], [1, 4, 7]
    ];

    // Function to check win condition
    const checkWin = (player) => winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );

    // Check for win conditions
    if (checkWin('X')) {
		let msg = player1 != player2 ? player1 + " has won" : "X's have won"
        document.getElementById('print').innerHTML = msg;
        sendWinnerMessage(player1, player2, 'Tic-Tac-Toe');
        buttons.forEach(btn => btn.disabled = true);
        buttons.forEach((btn, index) => {
            if (board[index] === 'X') btn.style.color = "red";
        });

    } else if (checkWin('O')) {
		let msg = player1 != player2 ? player2 + " has won" : "O's have won"
        document.getElementById('print').innerHTML = msg;
        sendWinnerMessage(player2, player1, 'Tic-Tac-Toe');
        buttons.forEach(btn => btn.disabled = true);
        buttons.forEach((btn, index) => {
            if (board[index] === 'O') btn.style.color = "red";
        });

    } else if (board.every(cell => cell === 'X' || cell === 'O')) {
        document.getElementById('print').innerHTML = "Match Tie";
    } else {
        // Toggle player turn
        flag = 1 - flag;
        if (player1 != player2)
			document.getElementById('print').innerHTML = flag === 1 ? player1 +"'s Turn" : player2 + "'s Turn";
		else
			document.getElementById('print').innerHTML = flag === 1 ? "X's Turn" : "O's Turn";
    }
}

// Function to reset the game
function myfunc_2() {
    // Reset the board
    Array.from({ length: 9 }, (_, i) => document.getElementById(`b${i + 1}`)).forEach(cell => {
        cell.value = '';
        cell.disabled = false;
        cell.style.color = "#FFA500";
    });
	
    // Randomize the turn
    flag = Math.random() < 0.5 ? 1 : 0; // 1 for X, 0 for O
	if (player1 != player2)
    	document.getElementById('print').innerHTML = flag === 1 ? player1 +"'s Turn" : player2 + "'s Turn";
	else
		document.getElementById('print').innerHTML = flag === 1 ? "X's Turn" : "O's Turn";
}


// Function to handle cell clicks and toggle player turns
const handleClick = (id) => {
    const cell = document.getElementById(id);
    if (cell.disabled) return;

    cell.value = flag === 1 ? "X" : "O";
    cell.disabled = true;
    myfunc();
};

// Bind click handlers to cells using a common function
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => handleClick(cell.id));
});