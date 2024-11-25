import { loadLoginPage } from "../login/login.js";

let hashCleared = false;
export function loadMainPage() {

    let mainPage = document.getElementById("root");
    Promise.all([
        fetch('./index/index.html').then(response => response.text()),
        fetch('../styles.css').then(response => response.text()),
        fetch('./index/styleIndex.css').then(response => response.text())
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
        const token = sessionStorage.getItem('token')
        try {
            const response = await fetch('/api/pong_auth/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                console.log(error, error.message);
                throw new Error(JSON.stringify(error));
            }
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("refresh");
            loadLoginPage();
        } catch (error) {
            console.log("Serious error, bro");
        }
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
    if (uniqueId == 'myWindowProfile') {
        var htmlUrl = '/static/frontend/profile/profile.html';
        var cssUrl = '/static/frontend/profile/profileStyle.css';
        var scriptUrl = '/static/frontend/profile/profileScript.js';
    }
    else if (uniqueId == 'myWindowGame') {
        var htmlUrl = '/static/frontend/games/pong/pong.html';
        var cssUrl = '/static/frontend/games/pong/pongStyle.css';
        var scriptUrl = '/static/frontend/games/pong/pongScript.js';
    }
    else if (uniqueId == 'myWindowPool') {
        var htmlUrl = '/static/frontend/games/pool/pool.html';
        var cssUrl = '/static/frontend/games/pool/poolStyle.css';
        var scriptUrl = '/static/frontend/games/pool/poolScript.js';
    }
    else if (uniqueId == 'myWindowTTT') {
        var htmlUrl = '/static/frontend/games/TTT/pool.html';
        var cssUrl = '/static/frontend/games/pool/poolStyle.css';
        var scriptUrl = '/static/frontend/games/pool/poolScript.js';
    }

    else if (uniqueId == 'myWindowBrowser') {
        var htmlUrl = '/static/frontend/gadgets/browser/browser.html';
        var cssUrl = '/static/frontend/gadgets/browser/browser.css';
        var scriptUrl = '/static/frontend/gadgets/browser/browser.js';
    }
    else {
        return;
    }
    console.log(uniqueId);
    let window = document.getElementById(uniqueId + "-content");
    Promise.all([
        fetch(htmlUrl).then(response => response.text()),
        fetch(cssUrl).then(response => response.text()),
        import(scriptUrl).then(module => module)
    ]).then(([html, css, javascript]) => {
        css = css.replace(/(^|{|})\s*([^{}@#\d][^{}@]*?)\s*{/g, (match, before, selectors) => {
            const modifiedSelectors = selectors.split(',').map(selector => {
                const isClassIDOrElement = /^[.#]?[a-zA-Z][\w-]*$/;
                if (isClassIDOrElement.test(selector.trim())) {
                    return `#${uniqueId}-content ${selector.trim()}`;
                } else {
                    return selector.trim();
                }
            }).join(',');
            return `${before} ${modifiedSelectors} {`;
        });
        
        html += `<style>${css}</style>`;
        window.innerHTML = html;
        javascript.init(customData);
    }).catch(error => {
        console.error('Error loading form:', error);
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
