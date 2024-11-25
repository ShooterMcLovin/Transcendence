import { checkUserAuthentication, getCookie } from './auth.js';

export async function registerUser(event) {
    event.preventDefault();

    const csrfToken = getCookie('csrftoken');
    const username = document.getElementById('reg-username').value;
    const nickname = document.getElementById('reg-nickname').value;
    const password1 = document.getElementById('reg-password1').value; 
    const password2 = document.getElementById('reg-password2').value; 
    // const email = document.getElementById('reg-email').value; 

    try {
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ username, nickname, password1, password2 }), // add email?
        });

        if (response.ok) {
            const result = await response.json();
            await checkUserAuthentication();
            console.log('Registration successful:', result);
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