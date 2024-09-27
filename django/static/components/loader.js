import { checkLoginStatus, loadLoginPage } from "../login/login.js"
import { loadMainPage } from "../index/index.js"

export function displayMessage(msg, type, id, color='red') {
    const errorElement = document.createElement(type);
    (type === "ul") ? errorElement.innerHTML = msg : errorElement.textContent = msg;
    errorElement.style.color = color;
    const errorContainer = document.getElementById(id);
    const existingErrors = errorContainer.querySelectorAll(type);
    existingErrors.forEach((existingError) => {
        errorContainer.removeChild(existingError);
    });

    errorContainer.appendChild(errorElement);
}

export function displayErrorList(errorData, id) {
    if (!errorData || typeof errorData !== 'object') {
        console.error("Invalid error data");
        return;
    }

    const errorMessages = [];

    const extractErrors = (errors) => {
        Object.keys(errors).forEach(key => {
            const messages = errors[key];
            if (Array.isArray(messages)) {
                errorMessages.push(...messages.map(message => `<li>${message}</li>`));
            } else if (typeof messages === 'object' && messages !== null) {
                extractErrors(messages);
            }
        });
    };

    extractErrors(errorData.error);

    if (errorMessages.length > 0) {
        const errorListHtml = errorMessages.join('');
        displayMessage(errorListHtml, 'ul', id);
    }
}

export async function displayLoginOrMenu() {
    checkLoginStatus() ? loadMainPage() : loadLoginPage();
}

export async function showNotification(data) {
    const notification = document.getElementById("myPopup");

    if (!notification) {
        console.error("Notification element not found.");
        return;
    }

    notification.innerHTML = `${data.username} ${data.message}`;
    notification.classList.toggle("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 10000);
}  