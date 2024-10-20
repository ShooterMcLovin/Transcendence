import { checkLoginStatus } from "/static/frontend/login/login.js"
import { loadSignUpPage } from "/static/frontend/sing-up/signup.js"
import { displayLoginOrMenu } from "/static/frontend/components/loader.js"

let debounceTimer;

function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

let menuLoaded = false;

export function router() {
    let { hash } = location;
    if (!hash) {
        displayLoginOrMenu();
    }
    else if (hash === '#/signup' && checkLoginStatus() === false) {
        loadSignUpPage();
    }
    else {
        displayLoginOrMenu();
    }
    if(!menuLoaded) {
        menuLoaded = true;
        document.getElementById('root').addEventListener('click', debounce(configureMenu, 300));
    }
    
}

function configureMenu(e) {
    if (e.target.matches('a')) {
        if (e.target.closest('#menu') !== null) {
            e.preventDefault();
            let href = e.target.getAttribute('href');
            history.pushState({ page: href }, "", href);
            router();
        }
    } else {
        if (e.target.matches('#menuContainer') === false &&
            e.target.matches('#menuLogo') === false) {
            return;
        }
        var menu = document.getElementById('menu');
        if (getComputedStyle(menu).display === 'none') {
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
        e.preventDefault();
    }
}

window.addEventListener("popstate", function(event) {
    if (event.state && event.state.page) {
        router();
    }
});


function updateTime() {
    let currTime = document.getElementById('current-time');
    if(!currTime)
        return;
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;

    var dateTimeString = formattedDate + '  |  ' + formattedTime;

    currTime.innerHTML = dateTimeString;
}

setInterval(updateTime, 1000);
