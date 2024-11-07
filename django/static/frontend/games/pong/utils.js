import { startMultiplayerHandler} from './pong.js';

//DO NOT REMOVE!!
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

//DO NOT REMOVE!!
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;

}

async function fetchUser() { // fetch logged in user 
    try {
        const responsee = await fetch('/api/get-username/');
        if (!responsee.ok) {
            throw new Error(`Network response was not ok: ${responsee.statusText}`);
        }
        const _user = await responsee.json();
        console.log('UserName:', _user);

        // Access the usernames array from the response
        const username = _user.username;

        // Check if the usernames array is not empty and return the first username
        if (username && username.length > 0) {
            return username; // Return the first username
        } else {
            return 'Guest'; // Fallback value if no usernames are returned
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return 'Guest'; // Return fallback value in case of an error
    }
}

async function populateUserDropdowns() {
    try {
        const response = await fetch('/api/get-usernames/');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const usernames = data.usernames;

        if (usernames && usernames.length > 0) {
            const player1Select = document.getElementById('player1Select');
            const player2Select = document.getElementById('player2Select');

            // Vider les anciennes options pour éviter les doublons
            player1Select.innerHTML = '';
            player2Select.innerHTML = '';

            // Fonction pour ajouter des options à un menu déroulant
            function populateSelect(selectElement, options) {
                options.forEach(username => {
                    const option = document.createElement('option');
                    option.value = username;
                    option.textContent = username;
                    selectElement.appendChild(option);
                });
            }

            // Populate player1Select
            populateSelect(player1Select, usernames);
            populateSelect(player2Select, usernames);

        } else {
            console.error('No usernames available.');
        }
    } catch (error) {
        console.error('Error fetching usernames:', error);
    }
}

function showNameForm() {
    const nameForm = document.getElementById('nameForm');
    nameForm.style.display = 'block';

    // Assurez-vous que les événements ne sont ajoutés qu'une seule fois
    const startMultiplayerButton = document.getElementById('startMultiplayer');
    startMultiplayerButton.removeEventListener('click', startMultiplayerHandler); // Supprimer les anciens gestionnaires
    startMultiplayerButton.addEventListener('click', startMultiplayerHandler);


}

export {sendWinnerMessage,fetchUser ,populateUserDropdowns,showNameForm};