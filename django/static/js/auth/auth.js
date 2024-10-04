import { loginUser } from './login.js';
import { logoutUser } from './logout.js';
import { registerUser } from './register.js';
import { userList } from '../userList.js';


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

export async function checkUserAuthentication() {
    console.log('Checking User Authentication..')
    const response = await fetch('/api/check_authentication/');
    if (response.ok) {
        const userData = await response.json();
        if (userData.isAuthenticated) {
            // User is logged in, update the UI
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('registration-form').style.display = 'none';
            document.getElementById('logout-button').style.display = 'block';
            document.getElementById('user-list').style.display = 'block';
            document.getElementById('ttt').style.display = 'block';
            userList();
        } else {
            // User is not logged in
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('registration-form').style.display = 'block';
            document.getElementById('logout-button').style.display = 'none';
            document.getElementById('user-list').style.display = 'none';
            document.getElementById('ttt').style.display = 'none';
        }
    } else {
        console.error('Error checking authentication status');
    }
}

export function getCookie(name) {
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

