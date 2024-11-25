import { checkUserAuthentication, getCookie } from './auth.js';

export async function logoutUser() {
    const csrfToken = getCookie('csrftoken');
    const response = await fetch('/api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    });

    if (response.ok) {
        await checkUserAuthentication();
        console.log('Logout successful');
        window.location.href = '/'; 
    } else {
        console.error('Logout failed');
    }
}
