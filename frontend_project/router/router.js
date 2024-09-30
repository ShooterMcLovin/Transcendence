import { checkLoginStatus } from "../login/login.js"
import { loadSignUpPage } from "../sing-up/signup.js"
import { displayLoginOrMenu } from "../components/loader.js"

let debounceTimer;

function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
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
        let menu = document.getElementById('menu');
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
    const currTime = document.getElementById('current-time');
    if (!currTime) return;

    const now = new Date();
    
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

    const formattedTime = now.toLocaleTimeString('en-CA', timeOptions);
    const formattedDate = now.toLocaleDateString('en-CA', dateOptions);

    currTime.innerHTML = `${formattedDate}  |  ${formattedTime}`;
}


document.addEventListener('DOMContentLoaded', () => {
    router();  // Запуск роутера после загрузки страницы
    setInterval(updateTime, 1000);  // Запуск обновления времени
});

