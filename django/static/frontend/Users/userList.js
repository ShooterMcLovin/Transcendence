import { getCookie, checkUserAuthentication  } from "/static/frontend/auth/auth.js";

export async function userList() {
    try {
        const response = await fetch('/api/users/');

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const users = await response.json();
        console.log(users);
        const userListElement = document.getElementById('user-list');
        // Get the current user ID (you may need to adjust this based on your auth method)
        const currentUser = await fetch('/api/getUser/'); // Adjust this based on how you store/get the current user ID

        // Construct the user list HTML
        userListElement.innerHTML = users.map(user => `
            <li class="list-group-item bg-secondary text-light d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center justify-content-center col-md-2">
                    
                        <img src="${user.avatar_url || '/static/images/logo.png'}" alt="Avatar" class="img-fluid rounded-circle" style="width: 35px; height: 35px;">
              
                </div>
                <div class="d-flex align-items-center justify-content-center col-md-2 custom-text-color">
                    <strong>${user.nickname || 'No nickname'}</strong>
                </div>
                <div class="d-flex align-items-center justify-content-center col-md-2 custom-text-color">
                    <strong>${user.is_online === true ? 'Online' : 'Offline'}</strong>
                </div>
                <div class="d-flex align-items-center justify-content-center col-md-3">
                    ${user.username !== currentUser ? `
                        <button class="btn btn-primary btn-sm" onclick="window.addFriend(${user.id}, event)">Add Friend</button>
                    ` : ''}
                </div>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error fetching user list:', error);
        const userListElement = document.getElementById('user-list');
        userListElement.innerHTML = '<li class="list-group-item text-danger">Failed to load user list.</li>';
    }
}
// Function to handle adding a friend
export async function addFriend(userId, event) {
    event.preventDefault(); // Prevent the default anchor behavior
    try {
        const response = await fetch(`/api/add_friend/${userId}/`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to add friend');
        }

        const result = await response.json();
        alert(result.message); // Show success or error message
    } catch (error) {
        console.error('Error adding friend:', error);
        alert('An error occurred while trying to add a friend. Please try again.');
    }
}

// Attach addFriend to the window object to make it globally accessible
window.addFriend = addFriend;

// Initialize the user list when the page loads
export function init() {
    userList();
}
