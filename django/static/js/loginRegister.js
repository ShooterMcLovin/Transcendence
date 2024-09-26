document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form');
    const logoutButton = document.getElementById('logout-button');
    
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }
    if (registrationForm) {
        registrationForm.addEventListener('submit', registerUser);
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }


    await checkUserAuthentication(); 
});

async function checkUserAuthentication() {
    const response = await fetch('/api/check_authentication/');
    if (response.ok) {
        const userData = await response.json();
        if (userData.isAuthenticated) {
            // User is logged in, update the UI
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('registration-form').style.display = 'none';
            document.getElementById('user-list').style.display = 'block';
            fetchUserList();
        } else {
            // User is not logged in
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('registration-form').style.display = 'block';
            document.getElementById('user-list').style.display = 'none';
        }
    } else {
        console.error('Error checking authentication status');
    }
}

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
    return cookieValue;}

async function registerUser(event) {
    event.preventDefault();
    const csrfToken = getCookie('csrftoken');

    const username = document.getElementById('reg-username').value;
    const nickname = document.getElementById('reg-nickname').value;
    const password1 = document.getElementById('reg-password1').value; 
    const password2 = document.getElementById('reg-password2').value; 

    try {
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ username, nickname, password1, password2 }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Registration successful:', result);
            document.getElementById('registration-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('user-list').style.display = 'block';
            document.getElementById('registration-error').textContent = 'Registration successful!';
            fetchUserList();
        } else {
            const errorResult = await response.json();
            console.error('Registration failed:', errorResult);
            
            // Create an array to hold error messages
            let errorMessages = [];
            
            // Extract messages
            for (const [key, messages] of Object.entries(errorResult)) {
                errorMessages.push(...messages);
            }

            // Display the messages
            document.getElementById('registration-error').textContent = errorMessages.join(', ') || 'Registration failed';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('registration-error').textContent = 'An unexpected error occurred.';
    }}
    async function loginUser(event) {
        event.preventDefault();
        const csrfToken = getCookie('csrftoken');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ username, password }),
        });
    
        if (response.ok) {
            // Check for the elements before trying to access them
            const loginForm = document.getElementById('login-form');
            const registrationForm = document.getElementById('registration-form');
            const userList = document.getElementById('user-list');
            fetchUserList();
    
            if (loginForm) {
                loginForm.style.display = 'none';
            }
            if (registrationForm) {
                registrationForm.style.display = 'none';
            }
            if (userList) {
                userList.style.display = 'block';
            }
    
        } else {
            const result = await response.json();
            document.getElementById('login-error').textContent = result.error || 'Login failed';
        }
    }

async function logoutUser() {
    const csrfToken = getCookie('csrftoken');
    const response = await fetch('/api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    });

    if (response.ok) {
        document.getElementById('user-list').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('registration-form').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
        console.log('Logout successful');
    } else {
        console.error('Logout failed');
    }
}


async function fetchUserList() {
    const response = await fetch('/api/users/');
    const users = await response.json();
    const userListElement = document.getElementById('user-list');
    userListElement.innerHTML = '<h2>User List</h2><ul>' + users.map(user => `
        <li>
            ${user.username} (${user.nickname || 'No nickname'}) - Wins: ${user.wins} - Losses: ${user.losses}
            <img src="${user.avatar_url}" alt="Avatar" style="width: 50px; height: 50px;">
        </li>
    `).join('') + '</ul>';
} 

