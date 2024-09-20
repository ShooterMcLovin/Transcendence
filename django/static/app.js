document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    function loadContent(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                renderContent(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function renderContent(data) {
        mainContent.innerHTML = ''; // Clear current content
        // Example rendering based on data
        if (data.user) {
            mainContent.innerHTML = `<h2>Welcome, ${data.user.nickname}</h2>`;
        } else {
            mainContent.innerHTML = `<p>No data available.</p>`;
        }
    }

    function handleRoute() {
        const hash = window.location.hash || '#home';
        switch (hash) {
            case '#profile':
                loadContent('/api/users/'); // Fetch user data
                break;
            case '#login':
                mainContent.innerHTML = `
                    <form id="login-form">
                        <input type="text" name="username" placeholder="Username" required>
                        <input type="password" name="password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                `;
                document.getElementById('login-form').addEventListener('submit', handleLogin);
                break;
            case '#home':
            default:
                mainContent.innerHTML = '<h2>Home Page</h2>';
                break;
        }
    }

    function handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch('/api/token/', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                if (data.access) {
                    // Save token and redirect or update UI
                    console.log('Login successful');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Initial load
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const formData = new FormData(loginForm);
            const data = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            fetch('/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    // Save the token (e.g., in localStorage)
                    localStorage.setItem('token', data.token);
                    // Redirect or update UI
                    window.location.hash = '#home'; // Example: redirect to home
                } else {
                    // Handle error
                    console.error('Login failed:', data.error);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});