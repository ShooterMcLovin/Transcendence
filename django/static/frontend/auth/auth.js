import { loginUser } from './login.js';
import { registerUser } from './register.js';

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
            document.getElementById('login-form').style.pointerEvents = 'none';
            document.getElementById('registration-form').style.display = 'none';
            document.getElementById('registration-form').style.pointerEvents = 'none';
            document.getElementById('root').style.display = 'block';
            // document.getElementById('root').style.max-width = ';
        } else {
            // User is not logged in
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('registration-form').style.display = 'block';
            document.getElementById('root').style.display = 'none';
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

