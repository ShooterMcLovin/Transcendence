import { asingNextPlayer,isfreeforall,startGame, player1, player2,startMatch,setMenuVisibility,asingPlayer} from './pong.js';

//variable globale tournois
let isFirstMatchComplete = false;
let match2Players;
let tournamentPlayers = [];

let tournamentScores = { player1: 0, player2: 0, player3: 0, player4: 0 };


function startTournamentMatches() {
    // Assurez-vous que les joueurs sont bien sélectionnés
    if (tournamentPlayers.length !== 4) {
        console.error('Four players must be selected to start the tournament.');
        return;
    }

    if(isfreeforall === false){
    // Mélanger les joueurs pour obtenir un tirage aléatoire
    const shuffledPlayers = [...tournamentPlayers].sort(() => 0.5 - Math.random());

    // Définir les matchs
    const match1Players = [shuffledPlayers[0], shuffledPlayers[1]];
    const match2Players = [shuffledPlayers[2], shuffledPlayers[3]];

    console.log(`Match 1: ${match1Players[0]} vs ${match1Players[1]}`);
    console.log(`Match 2: ${match2Players[0]} vs ${match2Players[1]}`);
    // Commencer les matchs
    asingNextPlayer(match2Players[0],match2Players[1]); 
    startMatch(match1Players[0], match1Players[1], 'Match 1');
    }
    else{
    asingPlayer();
    }
  
}

async function populateTournamentDropdowns() {
    try {
        const response = await fetch('/api/get-usernames/');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const usernames = data.usernames;

        if (usernames && usernames.length > 0) {
            const selects = ['player5Select', 'player6Select', 'player3Select', 'player4Select'];

            selects.forEach(selectId => {
                const selectElement = document.getElementById(selectId);
                selectElement.innerHTML = ''; // Clear previous options
                usernames.forEach(username => {
                    const option = document.createElement('option');
                    option.value = username;
                    option.textContent = username;
                    selectElement.appendChild(option);
                });
            });

            // Set up event listeners for player selection
            document.getElementById('startTournament').addEventListener('click', startTournamentHandler);
            document.getElementById('cancelTournament').addEventListener('click', () => {
                
                document.getElementById('tournamentForm').style.display = 'none';
                setMenuVisibility(true); // Show the main menu
        
            });

        } else {
            console.error('No usernames available.');
        }
    } catch (error) {
        console.error('Error fetching usernames:', error);
    }
}

function showTournamentForm() {
    document.getElementById('tournamentForm').style.display = 'block';
    const startTournamentButton = document.getElementById('startTournament');
    startTournamentButton.removeEventListener('click', populateTournamentDropdowns); // Supprimer les anciens gestionnaires
    startTournamentButton.addEventListener('click', populateTournamentDropdowns);

}

function startTournamentHandler() {
     tournamentPlayers = [];
    const player1 = document.getElementById('player5Select').value || 'Joueur 1';
    const player2 = document.getElementById('player6Select').value || 'Joueur 2';
    const player3 = document.getElementById('player3Select').value || 'Joueur 3';
    const player4 = document.getElementById('player4Select').value || 'Joueur 4';

    // Vérifier la sélection unique des joueurs
    const selectedPlayers = [player1, player2, player3, player4];
    if (new Set(selectedPlayers).size !== selectedPlayers.length) {
        alert('Each player must have a unique name.');
        showTournamentForm();
        return;
    }
    //prendre le bon mode
    if(isfreeforall === true)
        startGame('freeforall');
    else
        startGame('tournament');
    // Save the selected players
    tournamentPlayers = selectedPlayers;
    // Close the form and start the tournament
    document.getElementById('tournamentForm').style.display = 'none';
    startTournamentMatches();

}      
export { showTournamentForm,populateTournamentDropdowns,tournamentScores,startTournamentMatches,match2Players,tournamentPlayers};