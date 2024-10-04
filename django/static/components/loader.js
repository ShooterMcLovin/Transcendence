import { checkLoginStatus, loadLoginPage } from "/static/frontend/login/login.js"

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
    const errorMessagesList = [];

    const processErrors = (errorObject) => {
        for (const key in errorObject) {
            const errorMessages = errorObject[key];
            if (Array.isArray(errorMessages)) {
                errorMessagesList.push(...errorMessages.map(message => `<li>${message}</li>`));
            } else if (typeof errorMessages === 'object') {
                processErrors(errorMessages);
            }
        }
    };

    processErrors(errorData.error);
    if (errorMessagesList.length > 0) {
        const errorMessage = errorMessagesList.join('');
        displayMessage(errorMessage, 'ul', id);
    }
}

export function displayLoginOrMenu() {
    if (checkLoginStatus() === true)
        loadMainPage();
    else
        loadLoginPage();
}

export async function showNotification(data) {
    let notification = document.getElementById("myPopup");
    notification.innerHTML = data.username + " " + data.message;
    notification.classList.toggle("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 10000);
}  