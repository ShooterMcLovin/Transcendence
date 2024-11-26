import { getCookie, checkUserAuthentication } from './auth.js';

export async function loginUser(event) {
    event.preventDefault();
    
    const csrfToken = getCookie('csrftoken');
    const username = document.getElementById('log-username').value;
    const password = document.getElementById('log-password').value;

    console.log('Username:', username);
    console.log('Password:', '********');

    try {
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        await checkUserAuthentication();
        console.log('Login successful');
        // Redirect to the main page
        
        // Handle successful login
    } else {
        const result = await response.json();
        console.error('Login failed:', result.error || 'Login failed');
        document.getElementById('login-error').textContent = result.error || 'Login failed';
    }
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('login-error').textContent = 'An unexpected error occurred.';
}}

