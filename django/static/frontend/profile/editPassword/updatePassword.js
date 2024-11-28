import { getCookie } from '/static/frontend/auth/auth.js';

export async function updatePassword() {
    const form = document.getElementById('password-update-form');
    const errorMessages = document.getElementById('error-messages');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const csrfToken = getCookie('csrftoken');

    try {
        const response = await fetch('/api/update_password/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const result = await response.json();
            errorMessages.innerHTML = Object.values(result.errors).join('<br>');
            errorMessages.style.display = 'block';
        } else {
            const result = await response.json();
            if (result.message) {
                alert(result.message);
                // Optionally redirect the user or handle success
                // window.location.href = '/'; 
            }
        }
    } catch (error) {
        console.error('Error during password update:', error);
        errorMessages.innerHTML = 'An unexpected error occurred.';
        errorMessages.style.display = 'block';
    }
}

export async function init() {
    var button = document.getElementById('update-password-button');
    button.addEventListener('click', updatePassword);
}

// Call init when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
