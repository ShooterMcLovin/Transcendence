import { displayMessage } from "../components/loader.js"
import { loadMainPage } from "../index/index.js"

const TOKEN_KEY = 'token';
const REFRESH_KEY = 'refresh';

async function handleSubmitLogin (e) {
    if (!e.target.matches('#loginForm')) return;
    e.preventDefault()
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const loginData = {
        username: username,
        password: password,
    };
    try {
        const response = await fetch('api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },body: JSON.stringify(loginData),
    });
    if (!response.ok && response.status !== 308) {
        throw new Error("Incorrect Username or Password");
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Wrong response format. Need JSON.');
    }

    const data = await response.json();
    if (response.status === 308)
    {
        const verification_token = data.verification_token;
        sessionStorage.setItem('verification_token', verification_token)
    }
    else
    {  
        const token = data.token;
        const refresh = data.refresh
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refresh', refresh);
        saveTokens(data.token, data.refresh);
        loadMainPage();
    }
    } catch (error) {
        console.error('Error:', error.message);
        displayMessage(error.message, 'small', 'loginForm');
    }
}

export function login(e) {
    document.getElementById('root').addEventListener('submit', handleSubmitLogin);
}

export function checkLoginStatus() {
    return Boolean(sessionStorage.getItem(TOKEN_KEY) && sessionStorage.getItem(REFRESH_KEY));
}

function saveTokens(token, refresh) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(REFRESH_KEY, refresh);
}


export function loadLoginPage(){
    
    let loginPage = document.getElementById("root");
    Promise.all([
        fetch('./login/login.html').then(response => response.text()),
        fetch('./login/login.css').then(response => response.text())
    ]).then(([html, css]) => {
        window.location.hash = '#/login';
        html += `<style>${css}</style>`;
        loginPage.innerHTML = html;
    }).catch(error => {
        console.error('Error:', error);
    });
}