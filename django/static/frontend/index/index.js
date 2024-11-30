// import { loadLoginPage } from "/static/frontend/login/login.js";
import { getCookie, checkUserAuthentication  } from "/static/frontend/auth/auth.js";

let hashCleared = false;

window.addEventListener('popstate', openWindow =>{
    if (history.state && history.state.uniqueId){

        document.getElementById("welcomeText").style.display = "none";
        createWindow(history.state.uniqueId.replace('myWindow', ''));
    }
    else
        history.replaceState(null,'');
})

window.addEventListener('load', () => {
    // Убираем hash из URL, если он есть
    if (window.location.hash) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
        console.log("Page reloaded. Hash cleared.");
    }
    // Сбрасываем состояние истории
    if (history.state) {
        console.log("Page reloaded. History cleared");
    }
    history.replaceState(null,'');
    console.log("Page reloaded. History cleared");
    loadMainPage();
});

export function loadMainPage() {
    console.log("state: " + history.state);
    if (!history.state || !history.state.uniqueId || history.length === 0) {

        console.log("loading main page");
        let mainPage = document.getElementById("root");
        Promise.all([
            fetch('/static/frontend/index/index.html').then(response => response.text()),
            fetch('/static/frontend/index/styleIndex.css').then(response => response.text()),
            fetch('/static/frontend/index/styles.css').then(response => response.text())
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
    else 
        createWindow(history.state.uniqueId.replace('myWindow', ''));
   
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
    window.addEventListener('resize', () => {
        document.querySelector('.container-fluid').style.transform = `scale(${window.innerWidth / 1920})`;
    });
    
    
    document.getElementById('root').addEventListener('click', selectProgram);
    document.getElementById('root').addEventListener('dblclick', openWindow);

    // document.getElementById('root').addEventListener('click', closeWindow);
    document.getElementById('root').addEventListener('click', logOut);
}

export function openWindow(e) {
    var parentIcon = e.target.closest('.icon');
    console.log(e);
    if (!parentIcon) {
        removeClassFromClass('selected_program', 'selected_program');
        return;
    }
        
    removeClassFromClass('selected_program', 'selected_program');
    parentIcon.classList.add('selected_program');
    e.preventDefault();
    const uniqueIds = "myWindow" + parentIcon.id;
        
    const windowExists = document.getElementById(uniqueIds);
    if (windowExists) return;
    
    parentIcon.id = normalizeAppName(parentIcon.id);
    if (parentIcon.id === 'Profile') {
        document.getElementById('welcomeText').style.display = 'none';
        createWindow('Profile');
    } else if (parentIcon.id === 'Game') {
        document.getElementById('welcomeText').style.display = 'none';
        createWindow('Game');
    } else if (parentIcon.id === 'Users') {
        document.getElementById('welcomeText').style.display = 'none';
        createWindow('Users');
    } else if (parentIcon.id === 'EditInfo') {
        document.getElementById('welcomeText').style.display = 'none';
        createWindow('EditInfo');
    } else if (parentIcon.id === 'EditProfile') {
        document.getElementById('welcomeText').style.display = 'none';
        createWindow('EditProfile');
    } else if (parentIcon.id === 'matchHistory') {
        document.getElementById('welcomeText').style.display = 'none';
        createWindow('matchHistory');
    } else if (parentIcon.id === 'Pool') {
        document.getElementById('welcomeText').style.display = 'none';
        createWindow('Pool');
    } else if (parentIcon.id === 'browser') {
        document.getElementById('welcomeText').style.display = 'none';
        createWindow('Browser');
    }
    var uniqueId = parentIcon.id;
    history.pushState({ uniqueId }, '', `#${uniqueId}`);
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


async function setWindowContent(uniqueId, customData = null) {
    console.log("setting window " + uniqueId);
    const windowElement = document.getElementById(`${uniqueId}-content`);
    
    if (!windowElement) {
        // console.log(`Window element #${uniqueId}-content not found.`);
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
        case 'myWindowEditInfo': // update info
            htmlUrl = '/static/frontend/profile/updateProfileInfo/updateInfo.html';
            cssUrl = '/static/frontend/profile/profileStyle.css';
            scriptUrl = '/static/frontend/profile/updateprofileInfo/updateInfo.js';
            break;
        case 'myWindowEditProfile': // update password
            htmlUrl = '/static/frontend/profile/editPassword/updatePassword.html';
            cssUrl = '/static/frontend/profile/profileStyle.css';
            scriptUrl = '/static/frontend/profile/editPassword/updatePassword.js';
            break;
        case 'myWindowmatchHistory': // matches history
            htmlUrl = '/static/frontend/profile/matchHistory/matchHistory.html';
            cssUrl = '/static/frontend/profile/profileStyle.css';
            scriptUrl = '/static/frontend/profile/matchHistory/matchHistory.js';
            break;
        case 'myWindowUsers':
            htmlUrl = '/static/frontend/Users/Users.html';
            cssUrl = '/static/frontend/auth/auth.css';
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
            console.warn('unknown Error.' + uniqueId + '.');
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

function normalizeAppName(appName) {
    const appNameMap = {
        'game': 'Game',
        'pool': 'Pool',
        'profile': 'Profile',
        'users': 'Users'
    };
    const normalized = appNameMap[appName.toLowerCase()] || appName;
    return normalized;
}

export function createWindow(appName, customData = null) {
    appName = normalizeAppName(appName);
    console.log("Creating Window: " + appName);
    
    const uniqueId = "myWindow" + appName;
    closeAllWindows(uniqueId);

    const windowExists = document.getElementById(uniqueId);
    if (windowExists) return;

    const windowContainer = document.createElement('div');
    windowContainer.id = uniqueId;
    windowContainer.classList.add('window');

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

// window.addEventListener('popstate', () => {
//     const hash = location.hash.slice(1); // Убираем символ `#`
//     if (hash) {
//         const uniqueId = hash.replace('myWindow', ''); // Преобразуем hash в appName
//         createWindow(uniqueId);
//     } else {
//         closeAllWindows(); // Закрываем все окна, если hash пуст
//     }
// });
