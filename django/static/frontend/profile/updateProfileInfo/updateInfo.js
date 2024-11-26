import { getCookie } from '/static/frontend/auth/auth.js';

// Function to update the avatar
async function updateAvatar() {
    const avatarUrl = document.getElementById('avatar_url').value.trim();
    const errorMessages = document.getElementById('error-messages');

    // Clear previous error messages
    errorMessages.style.display = 'none';
    errorMessages.innerHTML = '';

    if (!avatarUrl) {
        alert('Please provide a valid avatar URL.');
        return;
    }

    const csrfToken = getCookie('csrftoken');

    try {
        const response = await fetch('/api/update_avatar/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ avatar_url: avatarUrl }),
        });

        const result = await response.json();

        if (!response.ok) {
            errorMessages.style.display = 'block';
            errorMessages.innerHTML = result.errors ? Object.values(result.errors).join('<br>') : result.message;
        } else {
            alert(result.message);

            // Update avatar image if avatar_url is returned
            if (result.avatar_url) {
                const avatarImage = document.getElementById('userAvatar');
                if (avatarImage) 
                    avatarImage.src = result.avatar_url;

            }
        }
    } catch (error) {
        console.error('Error updating avatar:', error);
        errorMessages.style.display = 'block';
        errorMessages.innerHTML = 'An unexpected error occurred while updating your avatar.';
    }
}

// Function to update the nickname
async function updateNickname() {
    const nickname = document.getElementById('nickname').value.trim();
    const errorMessages = document.getElementById('error-messages');

    // Clear previous error messages
    errorMessages.style.display = 'none';
    errorMessages.innerHTML = '';

    if (!nickname) {
        alert('Please provide a valid nickname.');
        return;
    }

    const csrfToken = getCookie('csrftoken');

    try {
        const response = await fetch('/api/update_nickname/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname: nickname }),
        });

        const result = await response.json();

        if (!response.ok) {
            errorMessages.style.display = 'block';
            errorMessages.innerHTML = result.errors ? Object.values(result.errors).join('<br>') : result.message;
        } else {
            alert(result.message);

            // Update nickname if result.nickname is returned
            if (result.nickname) {
                document.getElementById('nickname').value = result.nickname;
            }
        }
    } catch (error) {
        console.error('Error updating nickname:', error);
        errorMessages.style.display = 'block';
        errorMessages.innerHTML = 'An unexpected error occurred while updating your nickname.';
    }
}

// Define the init function which adds event listeners to DOM elements
export function init() {
    const avatarButton = document.getElementById('update-avatar-button');
    if (avatarButton) {
        avatarButton.addEventListener('click', updateAvatar);
    } else {
        console.error("Button with ID 'update-avatar-button' not found.");
    }

    const nicknameButton = document.getElementById('update-nickname-button');
    if (nicknameButton) {
        nicknameButton.addEventListener('click', updateNickname);
    } else {
        console.error("Button with ID 'update-nickname-button' not found.");
    }
}

// Call init() when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
