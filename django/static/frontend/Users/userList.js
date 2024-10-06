export async function userList() {
    try {
        const response = await fetch('/api/users/');

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const users = await response.json();
        const userListElement = document.getElementById('user-list');

        // Construct the user list HTML
        userListElement.innerHTML = users.map(user => `
            <li class="list-group-item bg-secondary text-light d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center justify-content-center col-md-2">
                    <a href="/user_profile/${user.id}" class="btn btn-link">
                        <img src="${user.avatar_url || '/static/images/logo.png'}" alt="Avatar" class="img-fluid rounded-circle" style="width: 35px; height: 35px;">
                    </a>
                </div>
                <div class="d-flex align-items-center justify-content-center col-md-2 custom-text-color">
                    <strong>${user.nickname || 'No nickname'}</strong>
                </div>
                <div class="d-flex align-items-center justify-content-center col-md-3">
                    <a href="/add_friend/${user.id}" class="btn btn-primary">Add Friend</a>
                </div>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error fetching user list:', error);
    }
}

// Initialize the user list when the page loads
export function init() {
    userList();
}
