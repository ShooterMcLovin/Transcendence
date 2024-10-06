import { loadLoginPage } from "/static/frontend/login/login.js";
import { getCookie, checkUserAuthentication  } from "/static/js/auth/auth.js";

let hashCleared = false;
export function loadMainPage() {

    let mainPage = document.getElementById("root");
    Promise.all([
        fetch('/static/frontend/index/index.html').then(response => response.text()),
        fetch('/static/frontend/styles.css').then(response => response.text()),
        fetch('/static/frontend/index/styleIndex.css').then(response => response.text())
    ]).then(([html, css, css2]) => {
        html += `<style>${css}</style>`;
        html += `<style>${css2}</style>`;
        mainPage.innerHTML = html;
        if (!hashCleared) {
            hashCleared = true;
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
        setClickEvents();
    }).catch(error => {
        console.error('Error loading form:', error);
    });
}

function removeClassFromClass(classNameToRemove, classNameToFind) {
    var elements = document.querySelectorAll('.' + classNameToFind);
    elements.forEach(function (element) {
        element.classList.remove(classNameToRemove);
    });
}

export async function logOut(e) {
    if (e.target.closest('.logOut')) {
        const csrfToken = getCookie('csrftoken')
        const token = sessionStorage.getItem('token')
        try {
            const csrfToken = getCookie('csrftoken');
            const response = await fetch('/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
            });
            if (response.ok) {
                console.log('Logout successful');
                await checkUserAuthentication();
                window.location.href = '/'; 
            }
            else if (!response.ok) {
                const error = await response.json();
                console.log(error, error.message);
                throw new Error(JSON.stringify(error));
            }
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("refresh");

        } catch (error) {
            console.log("Serious error, bro");
        }
    }
}
// function below for reference
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
    } else {
        console.error('Logout failed');
    }
}

export function setClickEvents() {
    document.getElementById('root').addEventListener('click', selectProgram);
    document.getElementById('root').addEventListener('dblclick', openWindow);
    document.getElementById('root').addEventListener('click', closeWindow);
    document.getElementById('root').addEventListener('click', logOut);
}

function openWindow(e) {
    var parentIcon = e.target.closest('.icon');
    if (parentIcon === false || !parentIcon) {
        removeClassFromClass('selected_program', 'selected_program')
        return;
    }

    removeClassFromClass('selected_program', 'selected_program')
    var parentIcon = e.target.closest('.icon');
    parentIcon.classList.add('selected_program');
    e.preventDefault()

    if (parentIcon.id === 'profile') {
        createWindow('Profile');
    } else if (parentIcon.id === 'game') {
        createWindow('Game');
    } else if (parentIcon.id === 'users') {
        createWindow('Users');
    } else if (parentIcon.id === 'pool') {
        createWindow('Pool');
    } else if (parentIcon.id === 'browser') {
        createWindow('Browser');
    }
}

function selectProgram(e) {
    var parentIcon = e.target.closest('.icon');
    if (parentIcon === false || !parentIcon) {
        removeClassFromClass('selected_program', 'selected_program')
        return;
    }

    removeClassFromClass('selected_program', 'selected_program')
    var parentIcon = e.target.closest('.icon');
    parentIcon.classList.add('selected_program');
    e.preventDefault()

}

function setWindowContent(uniqueId, customData = null) {
    let htmlUrl, cssUrl, scriptUrl;

    switch (uniqueId) {
        case 'myWindowProfile':
            htmlUrl = '/static/frontend/profile/profile.html';
            cssUrl = '/static/frontend/profile/profileStyle.css';
            scriptUrl = '/static/frontend/profile/profileScript.js';
            break;
        case 'myWindowUsers':
            htmlUrl = '/static/frontend/Users/Users.html';
            cssUrl = '/static/css/auth/auth.css';
            scriptUrl = '/static/frontend/Users/userList.js';
            break;
        case 'myWindowGame':
            htmlUrl = '/static/frontend/games/pong/pong.html';
            cssUrl = '/static/frontend/games/pong/pong.css';
            scriptUrl = '/static/frontend/games/pong/pong.js';
            break;
        case 'myWindowPool':
            htmlUrl = '/static/frontend/games/pool/pool.html';
            cssUrl = '/static/frontend/games/pool/pool.css';
            scriptUrl = '/static/frontend/games/pool/pool.js';
            break;
        case 'myWindowBrowser':
            htmlUrl = '/static/frontend/gadgets/browser/browser.html';
            cssUrl = '/static/frontend/gadgets/browser/browser.css';
            scriptUrl = '/static/frontend/gadgets/browser/browser.js';
            break;
        default:
            return;
    }

    console.log(`Loading content for: ${uniqueId}`);
    const windowElement = document.getElementById(`${uniqueId}-content`);
    
    Promise.all([
        fetch(htmlUrl).then(response => response.text()),
        fetch(cssUrl).then(response => response.text()),
        import(scriptUrl).then(module => module).catch(err => {
            console.error(`Error importing module from ${scriptUrl}:`, err);
            throw err; // Rethrow to handle later
        })
    ]).then(([html, css, javascript]) => {
        // Process CSS selectors
        css = css.replace(/(^|{|})\s*([^{}@#\d][^{}@]*?)\s*{/g, (match, before, selectors) => {
            const modifiedSelectors = selectors.split(',').map(selector => {
                const isClassIDOrElement = /^[.#]?[a-zA-Z][\w-]*$/;
                return isClassIDOrElement.test(selector.trim()) 
                    ? `#${uniqueId}-content ${selector.trim()}` 
                    : selector.trim();
            }).join(',');
            return `${before} ${modifiedSelectors} {`;
        });

        // Combine HTML and CSS
        windowElement.innerHTML = `${html}<style>${css}</style>`;
        
        // Check if init is a function and call it
        if (typeof javascript.init === 'function') {
            javascript.init(customData);
        } else {
            console.warn(`No init function found in ${scriptUrl}`);
        }
    }).catch(error => {
        console.error('Error loading content:', error);
    });
}


export function createWindow(appName, customData = null) {
    var uniqueId = "myWindow" + appName;
    var windowExist = document.getElementById(uniqueId);
    if (windowExist)
        return;

    var windowContainer = document.createElement('div');
    windowContainer.id = uniqueId;
    windowContainer.classList.add('window');

    var windowTop = document.createElement('div');
    windowTop.classList.add('window-top');

    // var greenButton = document.createElement('button');
    // greenButton.classList.add('round', 'green');
    // windowTop.appendChild(greenButton);

    // var yellowButton = document.createElement('button');
    // yellowButton.classList.add('round', 'yellow');
    // windowTop.appendChild(yellowButton);

    var redButton = document.createElement('button');
    redButton.classList.add('round', 'red');
    redButton.id = 'red-' + uniqueId;
    windowTop.appendChild(redButton);

    var windowContent = document.createElement('div');
    windowContent.classList.add('window-content');
    windowContent.id = uniqueId + '-content';

    windowContainer.appendChild(windowTop);
    windowContainer.appendChild(windowContent);

    var divRow = document.querySelector('.row');
    divRow.appendChild(windowContainer);


    setWindowContent(uniqueId, customData);
}

function closeWindow(e) {
    if (e.target.closest('.round.red')) {
        e.target.closest('.window').remove();
    }
}


