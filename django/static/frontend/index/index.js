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
        const csrfToken = getCookie('csrftoken');
        const token = sessionStorage.getItem('token');
        try {
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
            } else {
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

export function setClickEvents() {
    
    document.getElementById('root').addEventListener('click', selectProgram);
    document.getElementById('root').addEventListener('dblclick', openWindow);
    
    // document.getElementById('root').addEventListener('click', closeWindow);
    document.getElementById('root').addEventListener('click', logOut);
}

export function openWindow(e) {
   
    var parentIcon = e.target.closest('.icon');
    if (!parentIcon) {
        removeClassFromClass('selected_program', 'selected_program');
        return;
    }
   
    removeClassFromClass('selected_program', 'selected_program');
    parentIcon.classList.add('selected_program');
    e.preventDefault();

    if (parentIcon.id === 'profile') {
        createWindow('Profile');
    } else if (parentIcon.id === 'game') {
        document.getElementById('welcomeText').style.display = 'none';
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
    
    if (!parentIcon) {
        removeClassFromClass('selected_program', 'selected_program');
        return;
    }

    removeClassFromClass('selected_program', 'selected_program');
    parentIcon.classList.add('selected_program');
    e.preventDefault();
}


function setWindowContent(uniqueId, customData = null) {
    const windowElement = document.getElementById(`${uniqueId}-content`);

    if (!windowElement) {
        console.error(`Window element #${uniqueId}-content not found.`);
        return;
    }

    if (windowElement.dataset.loaded === 'true') {
        console.log(`Window ${uniqueId} is already open.`);
        return;
    }

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
   
    Promise.all([
        fetch(htmlUrl).then(response => response.text()),
        fetch(cssUrl).then(response => response.text()),
        import(scriptUrl).then(module => module).catch(err => {
            console.error(`Error importing module from ${scriptUrl}:`, err);
            throw err;
        })
    ]).then(([html, css, javascript]) => {
        css = css.replace(/(^|{|})\s*([^{}@#\d][^{}@]*?)\s*{/g, (match, before, selectors) => {
            const modifiedSelectors = selectors.split(',').map(selector => {
                const isClassIDOrElement = /^[.#]?[a-zA-Z][\w-]*$/;
                return isClassIDOrElement.test(selector.trim()) 
                    ? `#${uniqueId}-content ${selector.trim()}` 
                    : selector.trim();
            }).join(',');
            return `${before} ${modifiedSelectors} {`;
        });

        windowElement.innerHTML = `${html}<style>${css}</style>`;
        
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
    const uniqueId = "myWindow" + appName;
    closeAllWindows(uniqueId);

    const windowExists = document.getElementById(uniqueId);
    if (windowExists) return;

    const windowContainer = document.createElement('div');
    windowContainer.id = uniqueId;
    windowContainer.classList.add('window');

    if (uniqueId !== 'myWindowGame') {
        const windowTop = document.createElement('div');
        windowTop.classList.add('window-top');

        const redButton = document.createElement('button');
        redButton.classList.add('round', 'red');
        redButton.id = 'red-' + uniqueId;

        windowTop.appendChild(redButton);
        windowContainer.appendChild(windowTop);

        redButton.addEventListener('click', function () {
            closeWindowById(uniqueId);
        });
    }

    const windowContent = document.createElement('div');
    windowContent.classList.add('window-content');
    windowContent.id = uniqueId + '-content';
    windowContainer.appendChild(windowContent);

    const divRow = document.querySelector('.row');
    if (divRow) {
        divRow.appendChild(windowContainer);
    }

    setWindowContent(uniqueId, customData);
}

function closeWindowById(uniqueId) {
    const windowToClose = document.getElementById(uniqueId);
    if (windowToClose) {
        windowToClose.remove();
    }
}

function closeWindow(e) {
    const closeButton = e.target.closest('.round.red');
    
    if (!closeButton) {
        console.warn("Aucun bouton de fermeture trouvé !");
        return;
    }

    const windowElement = closeButton.closest('.window');
    if (windowElement) {
        windowElement.remove();
    } else {
        console.warn("Aucune fenêtre associée trouvée !");
    }
}


// Fonction pour fermer toutes les fenêtres ouvertes
function closeAllWindows(exceptWindowId = null) {
    var openWindows = document.querySelectorAll('.window');
    openWindows.forEach(function (window) {
        // Si l'ID de la fenêtre est celui qu'on veut garder, ne pas la supprimer
        if (window.id !== exceptWindowId) {
            window.remove();
        }
    });
}







