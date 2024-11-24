async function fetchmatchhistory() {
    try {
        const response = await fetch(`/api/match_history/`);
        const response2 = await fetch(`/api/user_profile/`);
        if (!response.ok | !response2.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const data2 = await response2.json();
        document.getElementById('wins').textContent = data2.current_user.wins;
        document.getElementById('losses').textContent = data2.current_user.losses;
        document.getElementById('tournamentWins').textContent = data2.current_user.tournament_wins;
        document.getElementById('tournamentLosses').textContent = data2.current_user.tournament_losses;
        document.getElementById('matches_won').innerHTML = data.matches_won.length > 0 
            ? data.matches_won.map(match => `You won against ${match.loser_nickname} at ${match.game} on ${match.match_date}`).join('<br>')
            : 'No matches won.';

        document.getElementById('matches_lost').innerHTML = data.matches_lost.length > 0 
            ? data.matches_lost.map(match => `You lost to ${match.winner_nickname} at ${match.game} on ${match.match_date}`).join('<br>')
            : 'No matches lost.';

    } catch (error) {
        console.error('Error fetching match history:', error);
    }
}
function init() {
     fetchmatchhistory();
}

window.onload = init;

export { init };