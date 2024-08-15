
function updateTournamentPlayersDisplay() {
    // Sélectionner les éléments HTML pour afficher les noms des joueurs
    const player1NameElement = document.getElementById('player5Name');
    const player2NameElement = document.getElementById('player6Name');
    const player3NameElement = document.getElementById('player3Name');
    const player4NameElement = document.getElementById('player4Name');

    // Mettre à jour le texte des éléments avec les noms des joueurs sélectionnés
    player1NameElement.textContent = `Player 1: ${tournamentPlayers[0] || 'Not selected'}`;
    player2NameElement.textContent = `Player 2: ${tournamentPlayers[1] || 'Not selected'}`;
    player3NameElement.textContent = `Player 3: ${tournamentPlayers[2] || 'Not selected'}`;
    player4NameElement.textContent = `Player 4: ${tournamentPlayers[3] || 'Not selected'}`;
}

// Modifier la fonction startTournamentHandler pour appeler updateTournamentPlayersDisplay
function startTournamentHandler() {
    const player1 = document.getElementById('player5Select').value || 'Joueur 1';
    const player2 = document.getElementById('player6Select').value || 'Joueur 2';
    const player3 = document.getElementById('player3Select').value || 'Joueur 3';
    const player4 = document.getElementById('player4Select').value || 'Joueur 4';

    // Vérifier la sélection unique des joueurs
    const selectedPlayers = [player1, player2, player3, player4];
    if (new Set(selectedPlayers).size !== selectedPlayers.length) {
        alert('Chaque joueur doit avoir un nom unique.');
        return;
    }

    // Save the selected players
    tournamentPlayers = selectedPlayers;
    
    // Close the form and start the tournament
    document.getElementById('tournamentForm').style.display = 'none';
    startGame('tournament');

    // Update the display with the selected player names
    updateTournamentPlayersDisplay();
}

let tournamentPlayers = [];
let currentMatch = 1;
let tournamentScores = { player1: 0, player2: 0, player3: 0, player4: 0 };

async function populateTournamentDropdowns() {
    try {
        const response = await fetch('/api/get-usernames/');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const usernames = data.usernames;

        if (usernames && usernames.length > 0) {
            const selects = ['player5Select', 'player6Select', 'player3Select', 'player4Select'];

            selects.forEach(selectId => {
                const selectElement = document.getElementById(selectId);
                selectElement.innerHTML = ''; // Clear previous options
                usernames.forEach(username => {
                    const option = document.createElement('option');
                    option.value = username;
                    option.textContent = username;
                    selectElement.appendChild(option);
                });
            });

            // Set up event listeners for player selection
            document.getElementById('startTournament').addEventListener('click', startTournamentHandler);
            document.getElementById('cancelTournament').addEventListener('click', () => {
                document.getElementById('tournamentForm').style.display = 'none';
                setMenuVisibility(true); // Show the main menu
            });
            
        } else {
            console.error('No usernames available.');
        }
    } catch (error) {
        console.error('Error fetching usernames:', error);
    }
}

function showTournamentForm() {
    document.getElementById('tournamentForm').style.display = 'block';
    populateTournamentDropdowns();
}

// Call `showTournamentForm` when the tournament button is clicked
document.getElementById('tournament').addEventListener('click', showTournamentForm);


// Fonction pour mettre à jour la taille du rendu et de la caméra
function onWindowResize() {
    // Mettre à jour la taille du rendu
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Mettre à jour le rapport d'aspect de la caméra
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Mettre à jour la matrice de projection de la caméra
}
// Ajouter un écouteur d'événements pour le redimensionnement de la fenêtre
window.addEventListener('resize', onWindowResize);

///fonction pour fermer le menu de multijoueur
function closeNameForm() {
    const nameForm = document.getElementById('nameForm');
    nameForm.style.display = 'none'; // Masquer le formulaire
}

// Ajouter un écouteur d'événements pour le close du menu multijoueur
document.getElementById('closeNameForm').addEventListener('click', closeNameForm);

async function fetchUser() { // fetch logged in user 
    try {
        const responsee = await fetch('/api/get-username/');
        if (!responsee.ok) {
            throw new Error(`Network response was not ok: ${responsee.statusText}`);
        }
        const _user = await responsee.json();
        console.log('UserName:', _user);

        // Access the usernames array from the response
        const username = _user.username;

        // Check if the usernames array is not empty and return the first username
        if (username && username.length > 0) {
            return username; // Return the first username
        } else {
            return 'Guest'; // Fallback value if no usernames are returned
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return 'Guest'; // Return fallback value in case of an error
    }
}

// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 2, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajout des étoiles en arrière-plan
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const starCount = 1000;
const starVertices = [];
for (let i = 0; i < starCount; i++) {
    const x = THREE.MathUtils.randFloatSpread(200);
    const y = THREE.MathUtils.randFloatSpread(200);
    const z = THREE.MathUtils.randFloatSpread(200);
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Arrière-plan (couleur)
scene.background = new THREE.Color(0x000000); // Arrière-plan noir

// Lumière
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10).normalize();
scene.add(light);

// Inclinaison commune (45 degrés)
const commonRotation = -Math.PI / 2;

// Contour de la carte
const borderGeometry = new THREE.BoxGeometry(10.2, 0.2, 1);
const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Couleur rouge pour le contour

// Bord supérieur
const topBorder = new THREE.Mesh(borderGeometry, borderMaterial);
topBorder.position.set(0, 0, 5);
topBorder.rotation.x = commonRotation;
scene.add(topBorder);

// Bord inférieur
const bottomBorder = new THREE.Mesh(borderGeometry, borderMaterial);
bottomBorder.position.set(0, 0, -5);
bottomBorder.rotation.x = commonRotation;
scene.add(bottomBorder);

// Bord gauche
const sideBorderGeometry = new THREE.BoxGeometry(0.2, 10, 1);
const leftBorder = new THREE.Mesh(sideBorderGeometry, borderMaterial);
leftBorder.position.set(-5, 0, 0);
leftBorder.rotation.x = commonRotation;
scene.add(leftBorder);

// Bord droit
const rightBorder = new THREE.Mesh(sideBorderGeometry, borderMaterial);
rightBorder.position.set(5, 0, 0);
rightBorder.rotation.x = commonRotation;
scene.add(rightBorder);

// Création du plancher
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 }); // Couleur verte pour le plancher
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1; // Positionnement légèrement en dessous des bordures pour éviter tout conflit visuel
floor.rotation.x = commonRotation; // Incliner pour être à plat
scene.add(floor);

// Création des palettes
const paddleGeometry = new THREE.BoxGeometry(0.3, 2, 1);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddle1.rotation.x = commonRotation;
paddle2.rotation.x = commonRotation;
paddle1.position.set(-4.5, 0, 0);
paddle2.position.set(4.5, 0, 0);
scene.add(paddle1);
scene.add(paddle2);

// Création de la balle
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.rotation.x = commonRotation;
scene.add(ball);

// Ajoutez cette fonction pour contrôler le mouvement de la deuxième IA
function moveAI2() {
    const aiSpeed = 0.05 + (0.005 * score1); // Vitesse de déplacement de l'IA 2

    if (ball.position.z > paddle2.position.z + aiSpeed) {
        paddle2.position.z += aiSpeed;
    } else if (ball.position.z < paddle2.position.z - aiSpeed) {
        paddle2.position.z -= aiSpeed;
    }

    // Limiter la position de la palette 2 pour ne pas sortir des bordures
    const paddleLimitY = 3.9;
    paddle2.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle2.position.z));
}

// Ajoutez cette fonction pour contrôler le mouvement de l'IA
function moveAI() {
    const aiSpeed = 0.05 + (0.005 * score2); // Vitesse de déplacement de l'IA

    if (ball.position.z > paddle1.position.z + aiSpeed) {
        paddle1.position.z += aiSpeed;
    } else if (ball.position.z < paddle1.position.z - aiSpeed) {
        paddle1.position.z -= aiSpeed;
    }

    // Limiter la position de la palette 1 pour ne pas sortir des bordures
    const paddleLimitY = 3.9;
    paddle1.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle1.position.z));
}



// Création d'un canvas secondaire pour les scores
const scoreCanvas = document.createElement('canvas');
const scoreContext = scoreCanvas.getContext('2d');
scoreCanvas.width = window.innerWidth;
scoreCanvas.height = 100;
scoreCanvas.style.position = 'absolute';
scoreCanvas.style.top = '0';
scoreCanvas.style.left = '0';
scoreCanvas.style.background = 'transparent';
document.body.appendChild(scoreCanvas);

// Fonction pour dessiner les scores
function drawScores() {
    scoreContext.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreContext.font = '30px Arial';
    scoreContext.fillStyle = 'blue';
    scoreContext.textAlign = 'left';
    scoreContext.fillText(`Joueur 1 (${player1}): ${score1}`, scoreCanvas.width / 4, scoreCanvas.height / 4 * 2);
    scoreContext.fillStyle = 'red';
    scoreContext.textAlign = 'right';
    scoreContext.fillText(`Joueur 2 (${player2}): ${score2}`, scoreCanvas.width / 4 * 3, scoreCanvas.height / 4 * 2);
}

// Fonction pour afficher le message de victoire
function showWinMessage(player) {

    scoreContext.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreContext.font = '50px Arial';
    scoreContext.fillStyle = 'green';
    scoreContext.textAlign = 'center';
    scoreContext.fillText(`${player} wins!`, scoreCanvas.width / 2, scoreCanvas.height / 2);
    scoreContext.font = '20px Arial';
    // Afficher le menu principal
    setMenuVisibility(true);
}


// Fonction pour réinitialiser la balle
function resetBall() {
    ball.position.set(0, 0, 0);
    ballDirection = getRandomDirection();
    ballSpeed = 0.05;
    gameStarted = false;
}

// Fonction pour générer une direction aléatoire vers les coins
function getRandomDirection() {
    const directions = [
        new THREE.Vector3(1, 0, 1).normalize(),
        new THREE.Vector3(-1, 0, 1).normalize(),
        new THREE.Vector3(-1, 0, -1).normalize(),
        new THREE.Vector3(1, 0, -1).normalize()
    ];
    const index = Math.floor(Math.random() * directions.length);
    return directions[index];
}


// Variables pour le score
let player1 = 'AI'; // added variable for name
let player2; // change to = 'whatever' 
let score1 = 0;
let score2 = 0;
let gameOver = false;
let gameStarted = false;
let isSinglePlayer = false;
let isMultiplayer = false;

let isPaused = false; // Variable pour suivre l'état de pause
// Variables pour le mouvement de la balle
let ballSpeed = 0.05;
let ballDirection = getRandomDirection();
const speedIncrease = 0.005;

// Variables pour le mouvement des palettes
let paddle1Speed = 0;
let paddle2Speed = 0;
const paddleSpeed = 0.1;

// Variables pour la rotation de la caméra
let initialCameraRotation = true;
let rotationAngle = 0;
let transitioningCamera = false;
const cameraTransitionSpeed = 0.05;
const cameraTargetPosition = new THREE.Vector3(0, 10, 0);
camera.lookAt(0, 0, 0);
const cameraStartPosition = new THREE.Vector3();
let modeSelected = false; // Nouvelle variable pour suivre si un mode a été sélectionné


function detectCollision() {
    const paddle1Box = new THREE.Box3().setFromObject(paddle1);
    const paddle2Box = new THREE.Box3().setFromObject(paddle2);

    // Créer une boîte autour de la balle pour la détection de collision
    const ballBox = new THREE.Box3().setFromCenterAndSize(ball.position, new THREE.Vector3(0.25, 0.25, 0.25));

    // Vérifier collision avec paddle1
    if (paddle1Box.intersectsBox(ballBox)) {
        // Raycast pour détecter les collisions avec les côtés des palettes
        const ballRay = new THREE.Raycaster(ball.position, ballDirection.clone().normalize());
        const intersections = ballRay.intersectObject(paddle1);

        if (intersections.length > 0) {
            ballDirection.x *= -1; // Rebondir horizontalement
            ballSpeed += speedIncrease; // Augmenter la vitesse après la collision
        }
    }

    // Vérifier collision avec paddle2
    if (paddle2Box.intersectsBox(ballBox)) {
        // Raycast pour détecter les collisions avec les côtés des palettes
        const ballRay = new THREE.Raycaster(ball.position, ballDirection.clone().normalize());
        const intersections = ballRay.intersectObject(paddle2);

        if (intersections.length > 0) {
            ballDirection.x *= -1; // Rebondir horizontalement
            ballSpeed += speedIncrease; // Augmenter la vitesse après la collision
        }
    }
}

function handleInitialCameraRotation() {

    if (initialCameraRotation) {
        rotationAngle += 0.01;
        const radius = 9;
        camera.position.x = Math.cos(rotationAngle) * radius;
        camera.position.z = Math.sin(rotationAngle) * radius;
        camera.position.y = 6;
        camera.lookAt(0, 0, 0);
        if (rotationAngle >= 1.5 * Math.PI) {
            rotationAngle = 0;
            initialCameraRotation = false;
            transitioningCamera = true;
            cameraStartPosition.copy(camera.position);
        }
        renderer.render(scene, camera);
        // return;
    }


}

function handleCameraTransition() {
    camera.position.lerp(cameraTargetPosition, cameraTransitionSpeed);
    if (camera.position.distanceTo(cameraTargetPosition) < 0.1) {
        camera.position.copy(cameraTargetPosition);
        cameraStartPosition.copy(camera.position);
        transitioningCamera = false;
    }
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

function updatePaddlesPosition() {
    paddle1.position.z += paddle1Speed;
    paddle2.position.z += paddle2Speed;

    const paddleLimitY = 3.9;
    paddle1.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle1.position.z));
    paddle2.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle2.position.z));
}

function updateBallPosition() {
    ball.position.add(ballDirection.clone().multiplyScalar(ballSpeed));

    if (ball.position.z + 0.1 > 5 || ball.position.z - 0.1 < -5) {
        ballDirection.z *= -1;
    }

    if (ball.position.x + 0.2 > 5) {
        score1 += 1;
        resetBall();
    } else if (ball.position.x - 0.2 < -5) {
        score2 += 1;
        resetBall();
    }
}

function checkGameOver() {
    if (score1 >= 7) {
        paddle1.position.set(-4.5, 0, 0);
        paddle2.position.set(4.5, 0, 0);
        showWinMessage(player1);
        gameOver = true;
    } else if (score2 >= 7) {
        paddle1.position.set(-4.5, 0, 0);
        paddle2.position.set(4.5, 0, 0);
        showWinMessage(player2);
        gameOver = true;
    }
}

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);

    if (isPaused || gameOver) return;

    if (!modeSelected) {
        handleInitialCameraRotation();
        moveAI();
        moveAI2();
    }

    handleCameraTransition();

    if (isSinglePlayer) {
        moveAI(); // Lancer l'IA si le mode solo est activé
    }

    updatePaddlesPosition();
    updateBallPosition();
    detectCollision();
    drawScores();
    checkGameOver();

    renderer.render(scene, camera);
}

// Fonction pour gérer les contrôles du clavier
function onDocumentKeyDown(event) {

    if (!gameStarted) {
        gameStarted = true;
    }

    switch (event.key) {
        case 'Escape':
            if (menu.style.display === 'block') {
                setMenuVisibility(false); // Cacher le menu si déjà visible
                isPaused = false; // Reprendre le jeu
            } else {
                setMenuVisibility(true); // Afficher le menu sinon
                isPaused = true; // Mettre le jeu en pause
            }
            return; // Sortir après avoir géré l'échappement

        case 'ArrowUp':
            if (!ia2Active) {
                paddle2Speed = -paddleSpeed;
            }
            break;

        case 'ArrowDown':
            if (!ia2Active) {
                paddle2Speed = paddleSpeed;
            }
            break;

        case 'w':
            if (!ia1Active) {
                paddle1Speed = -paddleSpeed;
            }
            break;

        case 's':
            if (!ia1Active) {
                paddle1Speed = paddleSpeed;
            }
            break;

        default:
            // Aucun traitement pour les autres touches
            break;
    }
}


function onDocumentKeyUp(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        paddle2Speed = 0;
    } else if (event.key === 'w' || event.key === 's') {
        paddle1Speed = 0;
    }
}

document.addEventListener('keydown', onDocumentKeyDown);
document.addEventListener('keyup', onDocumentKeyUp);

// Fonction pour afficher/masquer le menu
function setMenuVisibility(visible) {
    const menu = document.getElementById('menu');
    menu.style.display = visible ? 'block' : 'none';
}
let isEventListenerAdded = false;

async function populateUserDropdowns() {
    try {
        const response = await fetch('/api/get-usernames/');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const usernames = data.usernames;

        if (usernames && usernames.length > 0) {
            const player1Select = document.getElementById('player1Select');
            const player2Select = document.getElementById('player2Select');

            // Vider les anciennes options pour éviter les doublons
            player1Select.innerHTML = '';
            player2Select.innerHTML = '';

            // Fonction pour ajouter des options à un menu déroulant
            function populateSelect(selectElement, options) {
                options.forEach(username => {
                    const option = document.createElement('option');
                    option.value = username;
                    option.textContent = username;
                    selectElement.appendChild(option);
                });
            }

            // Populate player1Select
            populateSelect(player1Select, usernames);

            // Populate player2Select with options excluding selected player1 options
            player1Select.addEventListener('change', () => {
                const selectedPlayer1 = player1Select.value;
                const availableForPlayer2 = usernames.filter(username => username !== selectedPlayer1);
                player2Select.innerHTML = ''; // Clear previous options
                populateSelect(player2Select, availableForPlayer2);
            });

            // Trigger change event to initialize player2 options
            player1Select.dispatchEvent(new Event('change'));
        } else {
            console.error('No usernames available.');
        }
    } catch (error) {
        console.error('Error fetching usernames:', error);
    }
}


function showNameForm() {
    const nameForm = document.getElementById('nameForm');
    nameForm.style.display = 'block';

    // Assurez-vous que les événements ne sont ajoutés qu'une seule fois
    const startMultiplayerButton = document.getElementById('startMultiplayer');
    startMultiplayerButton.removeEventListener('click', startMultiplayerHandler); // Supprimer les anciens gestionnaires
    startMultiplayerButton.addEventListener('click', startMultiplayerHandler);
}

function startMultiplayerHandler() {
    const player1Select = document.getElementById('player1Select');
    const player2Select = document.getElementById('player2Select');
    player1 = player1Select.value || 'Joueur 1';
    player2 = player2Select.value || 'Joueur 2';
    const nameForm = document.getElementById('nameForm');
    nameForm.style.display = 'none';
    startGame('multiPlayer');
}

// Modifier l'événement pour `multiPlayer` en appelant `populateUserDropdowns` et `showNameForm`
document.getElementById('multiPlayer').addEventListener('click', () => {
    populateUserDropdowns().then(() => {
        showNameForm();
    });
});

// Fonction pour démarrer le jeu
function startGame(mode) {
    if (mode === 'singlePlayer') {
        isSinglePlayer = true;
        isMultiplayer = false;
        isTournament = false;
        ia1Active = true;
        ia2Active = false;
        paddle1.position.set(-4.5, 0, 0);
        paddle2.position.set(4.5, 0, 0);
        isPaused = false; // Reprendre le jeu
        player1 = "IA";
    } else if (mode === 'multiPlayer') {
        isSinglePlayer = false;
        isMultiplayer = true;
        isTournament = false;
        ia1Active = false;
        ia2Active = false;
        paddle1.position.set(-4.5, 0, 0);
        paddle2.position.set(4.5, 0, 0);
        isPaused = false; // Reprendre le jeu
        // showNameForm();
    } else if (mode === 'tournament') {
        isSinglePlayer = false;
        isMultiplayer = false;
        isTournament = true;
        ia1Active = false;
        ia2Active = false;
        paddle1.position.set(-4.5, 0, 0);
        paddle2.position.set(4.5, 0, 0);
        currentMatch = 1;
        tournamentScores = { player1: 0, player2: 0 };
        isPaused = false; // Reprendre le jeu
    }

    modeSelected = true; // Marquer le mode comme sélectionné
    setMenuVisibility(false);
    score1 = 0;
    score2 = 0;
    gameOver = false;
    resetBall();
}

// Afficher le menu au début

setMenuVisibility(true);
document.getElementById('singlePlayer').addEventListener('click', () => startGame('singlePlayer'));
document.getElementById('multiPlayer').addEventListener('click', showNameForm); // Afficher le formulaire pour les noms
document.getElementById('tournament').addEventListener('click', () => startGame('tournament'));

// Lancer l'animation
async function initializeGame() {
    const username = await fetchUser();
    console.log('Fetched Username:', username);
    player2 = username; // Assign the fetched username to player2
    animate();

    // Initialize and start the game
    startGame(mode); // or another mode if needed
}


initializeGame();
