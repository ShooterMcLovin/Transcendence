import { getCookie } from '/static/frontend/auth/auth.js';

async function fetchUserProfile() {
    try {
        const response = await fetch(`/api/user_profile/`); // Include user ID in the URL

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Set user profile data
        document.getElementById('userAvatar').src = data.current_user.avatar_url || '/static/images/logo.png';
        document.getElementById('username').textContent = data.current_user.username;
        document.getElementById('nickname').textContent = data.current_user.nickname;
        document.getElementById('wins').textContent = data.current_user.wins;
        document.getElementById('losses').textContent = data.current_user.losses;
        // Fetch friends data
        fetchFriends(data.friends);
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

function fetchFriends(friends) {
    const friendsList = document.getElementById('friendsList');

    if (friends.length === 0) {
        friendsList.innerHTML = 'No friends found.';
        return;
    }

    // Clear the current friends list
    friendsList.innerHTML = '';

    // Populate friends list
    friends.forEach(friend => {
        const friendDiv = document.createElement('div');
        friendDiv.className = 'friend-item'; // Add a class for styling, if desired
        friendDiv.textContent = `${friend.username} (${friend.nickname})`;

        // Create a remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Friend';
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.dataset.username = friend.username; // Store the user ID in a data attribute
        removeButton.addEventListener('click', removeFriend); // Attach the event listener        

        friendDiv.appendChild(removeButton);
        friendsList.appendChild(friendDiv);
    });
}
async function removeFriend(event) {
    const username = event.target.dataset.username; // Get the username from the button's data attribute
    console.log(username);
    if (!username) {
        console.error('No username found for the friend removal action.');
        return;
    }

    console.log('Attempting to remove friend with username: ' + username);
    
    // Disable the button to prevent multiple clicks
    const button = event.target;
    button.disabled = true;

    try {
        const response = await fetch(`/api/remove_friend/${username}/`, {
            method: 'POST', // Use POST method
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
        });

        if (!response.ok) {
            throw new Error('Failed to remove friend');
        }

        const result = await response.json();
        alert(result.message); // Show success message
        fetchUserProfile(); // Refresh the user profile to update the friends list
    } catch (error) {
        console.error('Error removing friend:', error);
        alert('Error removing friend. Please try again.');
    } finally {
        button.disabled = false; // Re-enable the button
    }
}

function init() {
    fetchUserProfile();
}

// Set up the window.onload event to call init
window.onload = init;

// If you're using modules, you can export the init function
export { init };
