import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
//DO NOT REMOVE!!
function sendWinnerMessage(win, lose, pgame) {
    console.log(`Winner: ${win}, Loser: ${lose}, Game: ${pgame}`);

    fetch('/api/update-winner/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ winner: win, loser: lose, game: pgame }),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    console.error('Server responded with error:', data);
                    throw new Error(data.message || 'An unknown error occurred');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                console.log('Game result updated successfully.');
            } else {
                console.error(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

//DO NOT REMOVE!!
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let isPaused = false;

//variable globale tournois
let isFirstMatchComplete = false;
let isTournament = false;
let match2Players;
let tournamentPlayers = [];
let currentMatch = 1;
let tournamentScores = { player1: 0, player2: 0, player3: 0, player4: 0 };

// Fonction pour afficher/masquer le menu de pause
function setPauseMenuVisibility(visible) {
    const pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.style.display = visible ? 'block' : 'none';
}
let player3;
let player4;
function startTournamentMatches() {
    // Assurez-vous que les joueurs sont bien sélectionnés
    if (tournamentPlayers.length !== 4) {
        console.error('Quatre joueurs doivent être sélectionnés pour commencer le tournoi.');
        return;
    }

    if(isfreeforall === false){
    // Mélanger les joueurs pour obtenir un tirage aléatoire
    const shuffledPlayers = [...tournamentPlayers].sort(() => 0.5 - Math.random());

    // Définir les matchs
    const match1Players = [shuffledPlayers[0], shuffledPlayers[1]];
    match2Players = [shuffledPlayers[2], shuffledPlayers[3]];

    console.log(`Match 1: ${match1Players[0]} vs ${match1Players[1]}`);
    console.log(`Match 2: ${match2Players[0]} vs ${match2Players[1]}`);
    // Commencer les matchs
    currentMatch = 1;

    startMatch(match1Players[0], match1Players[1], 'Match 1');
    }
    else{
        player1 = tournamentPlayers[0];
        player2 = tournamentPlayers[1];
        player3 = tournamentPlayers[2];
        player4 = tournamentPlayers[3];
    }
  
}

// Fonction pour démarrer un match
function startMatch(playerA, playerB, matchName) {
    console.log(`Démarrage du ${matchName}: ${playerA} vs ${playerB}`);

    // Réinitialiser les scores pour ce match
    tournamentScores[playerA] = 0;
    tournamentScores[playerB] = 0;

    // Configurer les joueurs pour ce match
    player1 = playerA;
    player2 = playerB;

    // Réinitialiser les scores
 
    score1 = 0;
    score2 = 0;
 
    // Mettre à jour le mode du jeu
    isSinglePlayer = false;
    isMultiplayer = false;
    isTournament = true;
    isfreeforall = false;

    // Démarrer le jeu pour le match en cours
    drawScores();
    setPauseMenuVisibility(true); // Afficher le menu de pause
    isPaused = true;

}

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
    const startTournamentButton = document.getElementById('startTournament');
    startTournamentButton.removeEventListener('click', populateTournamentDropdowns); // Supprimer les anciens gestionnaires
    startTournamentButton.addEventListener('click', populateTournamentDropdowns);

}

function startTournamentHandler() {

    const player1 = document.getElementById('player5Select').value || 'Joueur 1';
    const player2 = document.getElementById('player6Select').value || 'Joueur 2';
    const player3 = document.getElementById('player3Select').value || 'Joueur 3';
    const player4 = document.getElementById('player4Select').value || 'Joueur 4';

    // Vérifier la sélection unique des joueurs
    const selectedPlayers = [player1, player2, player3, player4];
    if (new Set(selectedPlayers).size !== selectedPlayers.length) {
        alert('Chaque joueur doit avoir un nom unique.');
        showTournamentForm();
        return;
    }
    //prendre le bon mode
    if(isfreeforall === true)
        startGame('freeforall');
    else
        startGame('tournament');
    // Save the selected players
    tournamentPlayers = selectedPlayers;
    // Close the form and start the tournament
    document.getElementById('tournamentForm').style.display = 'none';
    startTournamentMatches();

}

// Fonction pour ajuster la taille de la police en fonction de la hauteur du canvas
function getFontSize() {
    // Vous pouvez ajuster ce facteur en fonction de vos besoins
    const fontSizeFactor = 0.33;
    return scoreCanvas.height * fontSizeFactor;
}

// Fonction pour mettre à jour la taille du rendu et de la caméra
function onWindowResize() {
    // Mettre à jour la taille du rendu
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Mettre à jour le rapport d'aspect de la caméra
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Mettre à jour la matrice de projection de la caméra

    // Mettre à jour la taille du canvas de score
    scoreCanvas.width = window.innerWidth;
    scoreCanvas.height = 100;

    // Redessiner les scores après le redimensionnement
    drawScores();
}

// Ajouter un écouteur d'événements pour le redimensionnement de la fenêtre
window.addEventListener('resize', onWindowResize);

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     creation d'image                                                                      ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//creation de la scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 2, 100);
let renderer = new THREE.WebGLRenderer({ alpha: true });

// Lumière
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0, -12, 4).normalize();
scene.add(light);

// Lumière
const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
light2.position.set(0, 12, 4).normalize();
scene.add(light2);

// Inclinaison commune (45 degrés)
const commonRotation = -Math.PI / 2;

// Contour de la carte
const borderGeometry = new THREE.BoxGeometry(10.2, 0.2, 1);

// Créez un chargeur de textures
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('/static/wood.jpg');
const borderMaterial = new THREE.MeshPhysicalMaterial({
    map: woodTexture,
    roughness: 0.6,
    metalness: 0.3,
});

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
// const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 }); // Couleur verte pour le plancher
const floorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x008000, // Couleur de base du matériau
    roughness: 0.5, // Rugosité
    metalness: 0.2, // Métal
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1; // Positionnement légèrement en dessous des bordures pour éviter tout conflit visuel
floor.rotation.x = commonRotation; // Incliner pour être à plat
scene.add(floor);

// Création des palettes
const paddleGeometry = new THREE.BoxGeometry(0.3, 2, 1);
const paddleMaterial = new THREE.MeshPhysicalMaterial({
    map: woodTexture, // Texture du bois
    roughness: 0.5, // Rugosité
    metalness: 0.1, // Métal
    opacity: 1.0, // Opacité complète
    transparent: false // Le matériau ne sera pas transparent
});

const paddleMaterial3 = new THREE.MeshBasicMaterial({ color: 0xFFFF00}); 
const paddleMaterial4 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF }); 

const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle3 = new THREE.Mesh(paddleGeometry, paddleMaterial3); // Palette 3 en jaune
const paddle4 = new THREE.Mesh(paddleGeometry, paddleMaterial4); // Palette 4 en blanc

paddle1.rotation.x = commonRotation;
paddle2.rotation.x = commonRotation;
paddle1.position.set(-4.5, 0, 0);
paddle2.position.set(4.5, 0, 0);
scene.add(paddle1);
scene.add(paddle2);
paddle3.rotation.x = commonRotation;
paddle4.rotation.x = commonRotation;
paddle3.rotation.z = commonRotation;
paddle4.rotation.z = commonRotation;
paddle3.position.set(100, 100, 0);
paddle4.position.set(100, 100, 0);

// Création de la balle
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
// Créer une lumière ponctuelle
const pointLight = new THREE.PointLight(0x00ff00, 1, 2); // Couleur, intensité , distance 
scene.add(pointLight);

const ballMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, // Couleur de base blanche
    roughness: 0.1, // Réduit la rugosité pour un meilleur reflet
    metalness: 0.1, // Comportement métallique
    emissive: 0x00ff00, // Couleur émissive verte
    emissiveIntensity: 5.0 // Intensité de l'émission ajustée
});

const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.rotation.x = commonRotation;
scene.add(ball);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let lastAi2UpdateTime = 0;  // Temps du dernier calcul d'anticipation pour IA2
const ai2UpdateInterval = 1000;  // Intervalle de mise à jour pour IA2 (1 seconde)
let ai2TargetZ = 0;  // Position cible de l'IA 2

function predictBallPositionForAI2() {
    // Cloner les positions et directions actuelles pour ne pas modifier l'original
    let predictedBallPosition = ball.position.clone();
    let predictedBallDirection = ballDirection.clone();
    let predictedBallSpeed = ballSpeed;
    const simulationDuration = 500; // 1 seconde en millisecondes
    let timeElapsed = 0;
    const deltaTime = 16; // Approximation de 60 FPS

    // Simuler le mouvement de la balle pendant une seconde ou jusqu'à ce qu'elle atteigne l'IA2
    while (predictedBallPosition.x < paddle2.position.x && timeElapsed < simulationDuration) {
        predictedBallPosition.add(predictedBallDirection.clone().multiplyScalar(predictedBallSpeed * 2));

        // Gérer les rebonds sur les murs (axe Z)
        if (predictedBallPosition.z + 0.1 > 5 || predictedBallPosition.z - 0.1 < -5) {
            predictedBallDirection.z *= -1; // Inverser la direction en Z en cas de rebond
        }

        timeElapsed += deltaTime;
    }

    // Si la balle n'atteint pas le bord dans une seconde, retourner sa position après 1 seconde
    if (timeElapsed >= simulationDuration) {
        return predictedBallPosition.z;
    }

    // Sinon, retourner la position Z où la balle frappera le bord de l'IA 2
    return predictedBallPosition.z;
}

function moveAI2() {
    const currentTime = Date.now();
    const aiSpeed = 0.1 + (0.005 * score1); // Vitesse de déplacement de l'IA 2

    // Anticipation une fois par seconde
    if (currentTime - lastAi2UpdateTime > ai2UpdateInterval) {
        lastAi2UpdateTime = currentTime;

        // Prédire la position en Z où la balle frappera le bord de l'IA 2 ou sera dans 1 seconde
        ai2TargetZ = predictBallPositionForAI2();
    }

    // Déplacement de l'IA 2 vers la position prédite
    if (ai2TargetZ > paddle2.position.z + aiSpeed) {
        paddle2.position.z += aiSpeed; // Se déplace vers le bas si la cible est plus basse
    } else if (ai2TargetZ < paddle2.position.z - aiSpeed) {
        paddle2.position.z -= aiSpeed; // Se déplace vers le haut si la cible est plus haute
    }

    // Limiter la position de la palette 2 pour ne pas sortir des bordures
    const paddleLimitY = 3.9;
    paddle2.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle2.position.z));
}


function predictBallPosition() {
    // Cloner les positions et directions actuelles pour ne pas modifier l'original
    let predictedBallPosition = ball.position.clone();
    let predictedBallDirection = ballDirection.clone();
    let predictedBallSpeed = ballSpeed;
    const simulationDuration = 250; // 1 seconde en millisecondes
    let timeElapsed = 0;
    const deltaTime = 16; // Approximation de 60 FPS

    // Simuler le mouvement de la balle pendant une seconde ou jusqu'à ce qu'elle atteigne l'IA
    while (predictedBallPosition.x > paddle1.position.x && timeElapsed < simulationDuration) {
        predictedBallPosition.add(predictedBallDirection.clone().multiplyScalar(predictedBallSpeed *4));

        // Gérer les rebonds sur les murs (axe Z)
        if (predictedBallPosition.z + 0.1 > 5 || predictedBallPosition.z - 0.1 < -5) {
            predictedBallDirection.z *= -1; // Inverser la direction en Z en cas de rebond
        }

        timeElapsed += deltaTime;
    }

    // Si la balle n'atteint pas le bord dans une seconde, retourner sa position après 1 seconde
    if (timeElapsed >= simulationDuration) {
        return predictedBallPosition.z;
    }

    // Sinon, retourner la position Z où la balle frappera le bord de l'IA
    return predictedBallPosition.z;
}

let aiTargetZ = 0;  // Position cible de l'IA (où elle pense que la balle arrivera)
let lastAiUpdateTime = 0;  // Temps du dernier calcul d'anticipation
const aiUpdateInterval = 1000;  // Intervalle de mise à jour (1 seconde)

function moveAI(deltaTime) {
    const currentTime = Date.now();
    const aiSpeed = 0.1 + (0.005 * score2); // Vitesse de déplacement de l'IA, augmentée selon le score

    // Anticipation une fois par seconde
    if (currentTime - lastAiUpdateTime > aiUpdateInterval) {
        lastAiUpdateTime = currentTime;

        // Prédire la position en Z où la balle frappera le bord de l'IA ou sera dans 1 seconde
        aiTargetZ = predictBallPosition();
    }

    // Déplacement de l'IA vers la position prédite
    if (aiTargetZ > paddle1.position.z + aiSpeed) {
        paddle1.position.z += aiSpeed; // Se déplace vers le bas si la cible est plus basse
    } else if (aiTargetZ < paddle1.position.z - aiSpeed) {
        paddle1.position.z -= aiSpeed; // Se déplace vers le haut si la cible est plus haute
    }

    // Limiter la position de la palette 1 pour ne pas sortir des bordures
    const paddleLimitY = 3.9;
    paddle1.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle1.position.z));
}

// Création d'un canvas secondaire pour les scores
const scoreCanvas = document.createElement('canvas');
const scoreContext = scoreCanvas.getContext('2d');
scoreCanvas.width = window.window.innerWidth;
scoreCanvas.height = 100;
scoreCanvas.style.position = 'absolute';
scoreCanvas.style.top = '0';
scoreCanvas.style.left = '0';
scoreCanvas.style.background = 'transparent';
document.body.appendChild(scoreCanvas);

// Pour masquer les scores, définis scoresVisible à false
let scoresVisible = true; // Met à true par défaut

// Fonction pour dessiner les scores
function drawScores() {
    scoreContext.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    
    // Vérifie si tu veux afficher les scores
    if (scoresVisible) { // scoresVisible est une variable booléenne que tu peux définir
        const fontSize = getFontSize(); // Ajuster la taille de la police
        scoreContext.font = `${fontSize}px Arial`;

        const leftScoreX = scoreCanvas.width / 4;
        const rightScoreX = scoreCanvas.width / 4 * 3;
        const textY = scoreCanvas.height / 2;
        const textY2 = 100;

        scoreContext.fillStyle = 'blue';
        scoreContext.textAlign = 'center';
        scoreContext.fillText(`Joueur 1 (${player1}): ${score1} `, leftScoreX, textY);

        scoreContext.fillStyle = 'red';
        scoreContext.textAlign = 'center';
        scoreContext.fillText(`Joueur 2 (${player2}): ${score2} `, rightScoreX, textY);

        if (isModeFreeForAll) {
            scoreContext.fillStyle = 'yellow';
            scoreContext.textAlign = 'center';
            scoreContext.fillText(`Joueur 3 (${player3}): ${score3} `, leftScoreX, textY2);

            scoreContext.fillStyle = 'white';
            scoreContext.textAlign = 'center';
            scoreContext.fillText(`Joueur 4 (${player4}): ${score4} `, rightScoreX, textY2);
        }
    }
}




let winners1;
let winners2;

// Fonction pour afficher le message de victoire
function showWinMessage(winner, loser) {

    scoreContext.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreContext.font = '50px Arial';
    scoreContext.fillStyle = 'green';
    scoreContext.textAlign = 'center';
    if (!isTournament && (currentMatch === 1 || currentMatch === 2))
        scoreContext.fillText(`${winner} wins!`, scoreCanvas.width / 2, scoreCanvas.height / 2);
    else
        scoreContext.fillText(`${winner} wins tournament!`, scoreCanvas.width / 2, scoreCanvas.height / 2);
    scoreContext.font = '20px Arial';
    if(!isModeFreeForAll)
    sendWinnerMessage(winner, loser, 'pong'); //// DO NOT REMOVE!

    if (isTournament) {
        if (currentMatch === 1) {
            isFirstMatchComplete = true
            currentMatch = 2;
            startMatch(match2Players[0], match2Players[1], 'Match 2');
            isFirstMatchComplete = false;
            winners1 = winner;
        }
        else if (currentMatch === 2) {
            // Proceed to final match
            winners2 = winner;
            currentMatch = 3;
            startMatch(winners1, winners2, 'Finale');
        }
        else {
            // Tournament is complete
            console.log(`${winner} remporte le tournoi !`);
            tournamentPlayers = []; // Clear players
            isTournament = false;
        }
    }

    if (!isTournament)
        setMenuVisibility(true);
}

// Fonction pour réinitialiser la balle
function resetBall() {
    ball.position.set(0, 0.1, 0);
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
let player1 = 'IA'; // added variable for name
let player2; // change to = 'whatever' 
let score1 = 0;
let score2 = 0;
let score3 = 0;
let score4 = 0;
let gameOver = false;
let gameStarted = false;
let isSinglePlayer = false;
let isMultiplayer = false;

// Variables pour le mouvement de la balle
let ballSpeed = 0.05;
let ballDirection = getRandomDirection();
const speedIncrease = 0.005;

// Variables pour le mouvement des palettes
let paddle1Speed = 0;
let paddle2Speed = 0;
let paddle3Speed = 0;
let paddle4Speed = 0;
const paddleSpeed = 0.1;

// Variables pour la rotation de la caméra
let initialCameraRotation = true;
let rotationAngle = 0;
let transitioningCamera = false;
const cameraTransitionSpeed = 0.05;
const cameraTargetPosition = new THREE.Vector3(0, 10, 0);
camera.lookAt(0, 0, 0);
const cameraStartPosition = new THREE.Vector3();

///variables mode
let modeSelected = false;

function detectCollisionPaddle(){
             // Raycast pour détecter les collisions avec les côtés des palettes
             const ballRay = new THREE.Raycaster(ball.position, ballDirection.clone().normalize());
             const intersections = ballRay.intersectObject(paddle3);
     
             if (intersections.length > 0) {
                 ballDirection.z *= -1; // Rebondir horizontalement
                 ballSpeed += speedIncrease; // Augmenter la vitesse après la collision
             }
}

function detectCollision() {
    const paddle1Box = new THREE.Box3().setFromObject(paddle1);
    const paddle2Box = new THREE.Box3().setFromObject(paddle2);
    const paddle3Box = new THREE.Box3().setFromObject(paddle3);
    const paddle4Box = new THREE.Box3().setFromObject(paddle4);
    // Créer une boîte autour de la balle pour la détection de collision
    const ballBox = new THREE.Box3().setFromCenterAndSize(ball.position, new THREE.Vector3(0.355, 0.355, 0.355));
     
        // Vérifier collision avec paddle3
               if (paddle3Box.intersectsBox(ballBox)) {
                // Raycast pour détecter les collisions avec les côtés des palettes
                const ballRay = new THREE.Raycaster(ball.position, ballDirection.clone().normalize());
                const intersections = ballRay.intersectObject(paddle3);
        
                if (intersections.length > 0) {
                    ballDirection.z *= -1; // Rebondir horizontalement
                    ballSpeed += speedIncrease; // Augmenter la vitesse après la collision
                }
            }
        
            // Vérifier collision avec paddle4
            if (paddle4Box.intersectsBox(ballBox)) {
                // Raycast pour détecter les collisions avec les côtés des palettes
                const ballRay = new THREE.Raycaster(ball.position, ballDirection.clone().normalize());
                const intersections = ballRay.intersectObject(paddle4);
        
                if (intersections.length > 0) {
                    ballDirection.z *= -1; // Rebondir horizontalement
                    ballSpeed += speedIncrease; // Augmenter la vitesse après la collision
                }
            }
  

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
        if (rotationAngle >= 0.5 * Math.PI) {
            rotationAngle = 0;
            initialCameraRotation = false;
            transitioningCamera = true;
            cameraStartPosition.copy(camera.position);
        }
        renderer.render(scene, camera);

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
    paddle3.position.x += paddle3Speed;
    paddle4.position.x += paddle4Speed;

    const paddleLimitY = 3.9;
    paddle1.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle1.position.z));
    paddle2.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle2.position.z));
    paddle3.position.x = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle3.position.x));
    paddle4.position.x = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle4.position.x));
}

function updateBallPosition() {
    ball.position.add(ballDirection.clone().multiplyScalar(ballSpeed));
    pointLight.position.set(ball.position.x, 0.2, ball.position.z);
    
    if(isModeFreeForAll)
    {   
        if (ball.position.z + 0.2 > 5 && score4 > 0) {
            score4 -= 1;
            resetBall();
        }
        else if(ball.position.z + 0.2 > 5 )
        {
            ballDirection.z *= -1;
        }
        if (ball.position.z - 0.2 < -5 && score3 > 0) {
            score3 -= 1;
            resetBall();
        }
        else if(ball.position.z - 0.2 < -5 )
            ballDirection.z *= -1;
        if (ball.position.x + 0.2 > 5  && score2 > 0) {
            score2 -= 1;
            resetBall();
        } 
        else if(ball.position.x + 0.2 > 5)
            ballDirection.x *= -1;
         if (ball.position.x - 0.2 < -5 && score1 > 0) {
            score1 -= 1;
            resetBall();
        }
        else if(ball.position.x - 0.2 < -5)
            ballDirection.x *= -1;
    }
    else{
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
   
}
// Afficher le menu principal
function checkGameOver() {
    
    
    if(isModeFreeForAll)
    {   
        if(!modeSelected)
        {
            if(score1 === 7 || score2 ===7)
            {
                score1 = 0;
                score2 = 0;
            }
        }
        if(score1 === 0)
        {  paddle1.position.set(100, 100, 0);
            scene.remove(paddle1);
        }
       
        else if(score2 === 0)
        { 
            paddle2.position.set(100, 100, 0);
           scene.remove(paddle2); 
        }
            
        else if(score3 === 0)
        {
            paddle3.position.set(100, 100, 0);
            scene.remove(paddle3); 
        }
           
        else if(score4 === 0)
        {
            paddle4.position.set(100, 100, 0);
           scene.remove(paddle4); 
        }
        if(score1 === 0 && score2 === 0 && score3 === 0)
        {
             showWinMessage(player4,player1);
             gameOver = true;
        }
           
        else if(score4 === 0 && score2 === 0 && score3 === 0)
        {
             showWinMessage(player1,player2);
             gameOver = true;
        }
           
        else if(score1 === 0 && score4 === 0 && score3 === 0)
        {
           showWinMessage(player2,player3); 
           gameOver = true;
        }
            
        else if(score1 === 0 && score2 === 0 && score4 === 0)
        {
            showWinMessage(player3,player4);
            gameOver = true;
        }
            
    }
    else if (score1 >= 7 || score2 >= 7) { 
        if(!modeSelected)
        {
            score1 = 0;
            score2 = 0;
        }
        else{
            
        }
        const winner = score1 >= 7 ? player1 : player2;
        const loser = score1 >= 7 ? player2 : player1;

        paddle1.position.set(-4.5, 0, 0);
        paddle2.position.set(4.5, 0, 0);
        showWinMessage(winner, loser);


        if (!isTournament)
        {
            gameOver = true;
            // modeSelected = false;
        }
       
       
    }
}

// Fonction d'animation
function animate() { 
    if(!isGameOpen())
    
    animationId = requestAnimationFrame(animate);
    else
{
        // closeGame();
      
    }
    
//    isGameOpen();

    if((!isMenuOpen() && !isMenuTournamentFormOpen() )&& isPaused && isModeFreeForAll)
        setMenuFreeForAllVisibility(true);

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
            if (isPaused === true && !isMenuFormOpen() && !isMenuTournamentFormOpen()) {
                setMenuVisibility(false); // Cacher le menu si déjà visible
                isPaused = false; // Reprendre le jeu
            } else if(isPaused ===false && !isMenuFormOpen() && !isMenuTournamentFormOpen()){
                setMenuVisibility(true) ; // Afficher le menu sinon
                isPaused = true; // Mettre le jeu en pause
            }
            if(isMenuTournamentFormOpen())
            {    document.getElementById('tournamentForm').style.display = 'none';
                setMenuVisibility(true);

            }
            if(isMenuFormOpen()){
                 document.getElementById('nameForm').style.display = 'none';  
                 setMenuVisibility(true);
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
        case 'z':
            if (isModeFreeForAll) {
                    paddle3Speed = -paddleSpeed;
                }
                break;
    
            case 'x':
                if (isModeFreeForAll) {
                    paddle3Speed = paddleSpeed;
                }
                break;
            case 'o':
                    if (isModeFreeForAll) {
                            paddle4Speed = -paddleSpeed;
                        }
                        break;
            
                    case 'p':
                        if (isModeFreeForAll) {
                            paddle4Speed = paddleSpeed;
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
    }else if (event.key === 'z' || event.key === 'x') {
        paddle3Speed = 0;
    }else if (event.key === 'o' || event.key === 'p') {
        paddle3Speed = 0;
    }
}

document.addEventListener('keydown', onDocumentKeyDown);
document.addEventListener('keyup', onDocumentKeyUp);


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
            populateSelect(player2Select, usernames);

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
    const selectedPlayers = [player1, player2];
    if (new Set(selectedPlayers).size !== selectedPlayers.length) {
        alert('Chaque joueur doit avoir un nom unique.');
        showNameForm();
        return;
    }

    startGame('multiPlayer');
}

let isModeFreeForAll = false;
let ia1Active;
let ia2Active;
// Fonction pour démarrer le jeu
function initializeGameData(){

    paddle1.material =  new THREE.MeshPhysicalMaterial({
        map: woodTexture, // Texture du bois
        roughness: 0.5, // Rugosité
        metalness: 0.1, // Métal
        opacity: 1.0, // Opacité complète
        transparent: false // Le matériau ne sera pas transparent
    });  
    paddle2.material =  new THREE.MeshPhysicalMaterial({
        map: woodTexture, // Texture du bois
        roughness: 0.5, // Rugosité
        metalness: 0.1, // Métal
        opacity: 1.0, // Opacité complète
        transparent: false // Le matériau ne sera pas transparent
    });
    paddle1.position.set(-4.5, 0, 0);
    paddle2.position.set(4.5, 0, 0);
    paddle3.position.set(100, 100, 0);
    paddle4.position.set(100, 100, 0);
    scene.add(paddle1);
    scene.add(paddle2);
    scene.remove(paddle3);
    scene.remove(paddle4);
}

function startGame(mode) {
        
    if (mode === 'singlePlayer') {
        initializeGameData();
        isSinglePlayer = true;
        isMultiplayer = false;
        isTournament = false;
        isModeFreeForAll = false;
        ia1Active = true;
        ia2Active = false;
        isPaused = false; 
        player1 = "IA";
        player2 = username; // Assign the fetched username to player2

    } else if (mode === 'multiPlayer') {
        initializeGameData();
        isSinglePlayer = false;
        isMultiplayer = true;
        isTournament = false;
        isModeFreeForAll = false;
        ia1Active = false;
        ia2Active = false;
        isPaused = false; 
    } else if (mode === 'tournament') {
        initializeGameData();
        isSinglePlayer = false;
        isMultiplayer = false;
        isModeFreeForAll = false;
        ia1Active = false;
        ia2Active = false;
        tournamentScores = { player1: 0, player2: 0 };
        if (!isTournament)
            startTournamentMatches();
        isPaused = true;
        isTournament = true;
    } else if (mode === 'freeforall') {
        isSinglePlayer = false;
        isMultiplayer = false;
        ia1Active = false;
        ia2Active = false; 
        isTournament = false;
        isModeFreeForAll = true;
        paddle1.position.set(-4.5, 0, 0);
        paddle2.position.set(4.5, 0, 0);
        paddle3.position.set(0, 0, -4.5);
        paddle4.position.set(0, 0, 4.5);
        
        score1 = 7;
        score2 = 7;
        score3 = 7;
        score4 = 7;
         paddle1.material = new THREE.MeshBasicMaterial({ color: 0x0000FF });
         paddle2.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); 
        
        scene.add(paddle3);
        scene.add(paddle4);
        scene.add(paddle1);
        scene.add(paddle2);
            // startTournamentMatches();
        isPaused = true;
        
    }

    scene.add(paddle1);
    scene.add(paddle2);
    modeSelected = true; // Marquer le mode comme sélectionné
    setMenuVisibility(false);
    if(!isModeFreeForAll)
    {
    score1 = 0;
    score2 = 0; 
    }
   
    gameOver = false;
    resetBall();
}

// Afficher le menu au début
async function setMenuVisibility(visible) {
    const menu = document.getElementById('menuP');
    menu.style.display = visible ? 'block' : 'none';
}

 async function setMenuFreeForAllVisibility(visible) {
        const menufreeforall = document.getElementById('pauseMenufreeforall');
        menufreeforall.style.display = visible ? 'block' : 'none';
        if(visible === false)
            isPaused = false;
}

let mode;
let username;
let isfreeforall = false;
// Lancer l'animation
async function initializeGame() {
    username = await fetchUser();
    console.log('Fetched Username:', username);
    player2 = "IA2"; 
    animate();
    // Initialize and start the game
    if (mode)
        startGame(mode); 
}

///fonction pour fermer le menu de multijoueur
function closeNameForm() {
    const nameForm = document.getElementById('nameForm');
    nameForm.style.display = 'none'; // Masquer le formulaire
}

function isMenuOpen() {
    const menu = document.getElementById('menuP'); // Sélectionner le menu
    if(menu)
    return menu.style.display === 'block'; // Retourne true si le menu est visible
}
let animationId; // Stocker l'ID de l'animation

function stopGame() {
    // Vérifier si l'animation est en cours et l'annuler   
    document.getElementById('welcomeText').style.display = 'block'; // ou 'inline', 'flex', selon le besoin

 if (animationId) {
        cancelAnimationFrame(animationId); 
        console.log("Animation cancelled");
    }
}

// Exemple : fonction qui s'exécute quand on ferme le jeu
function closeGame() {
    scoresVisible = false; 

    stopGame(); // Arrêter l'animation et nettoyer la scène
      closeGameWindow();
    console.log("Game has been stopped and window closed");
}

function closeGameWindow() {
    var gameWindow = document.getElementById('myWindowGame');
    if (gameWindow) {
        gameWindow.remove(); // Supprime la fenêtre du jeu
    }

    // Supprimer également le canvas si nécessaire
    if (renderer && renderer.domElement) {
        renderer.dispose(); // Dispose les ressources WebGL
        document.body.removeChild(renderer.domElement); // Retire le canvas du DOM
    }
}

function isGameOpen() {
    var windowExist = document.getElementById('myWindowGame');

    if (windowExist)
        return(0);
    else
    {
        closeGame();  
         return(1);
    }
       
}
function isMenuTournamentFormOpen() {
    const menutournament = document.getElementById('tournamentForm'); // Sélectionner le menu
    if(menutournament)
    return menutournament.style.display === 'block'; // Retourne true si le menu est visible
}
function isMenuFormOpen() {
    const menumultiplayer = document.getElementById('nameForm'); // Sélectionner le menu
    if(menumultiplayer)
    return menumultiplayer.style.display === 'block'; // Retourne true si le menu est visible
}

export function init() {
    scoresVisible = true;
    
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);
   scene.background = null; 
        
       document.getElementById('resumeButton').addEventListener('click', () => {
           setPauseMenuVisibility(false);
           isPaused = false;
       });
       document.getElementById('quit game').addEventListener('click', () => {
          closeGame();
       });
       document.getElementById('resumeButtonfree').addEventListener('click', () => {
           setMenuFreeForAllVisibility(false);
           isPaused = false;
       });
       document.getElementById('closeNameForm').addEventListener('click', () => {
        closeNameForm();
        setMenuVisibility(true); 
       });
       document.getElementById('closeNameForm').addEventListener('click', closeNameForm);
       document.getElementById('multiPlayer').addEventListener('click', () => {
           populateUserDropdowns().then(() => {
               showNameForm();
               setMenuVisibility(false);
           });
       });
       // // Fonction pour afficher/masquer le menu
       async function setMenuVisibility(visible) {
           const menu = document.getElementById('menuP');
           menu.style.display = visible ? 'block' : 'none';
           if(visible === false)
               isPaused = false;
       }
       document.getElementById('freeforall').addEventListener('click', () => {
           populateTournamentDropdowns().then(() => {
               showTournamentForm();
               isfreeforall= true;
               setMenuVisibility(false);
           });
       });
       document.getElementById('tournament').addEventListener('click', () => {
           populateTournamentDropdowns().then(() => {
               showTournamentForm();
               isfreeforall= false;
               setMenuVisibility(false);
           });
       });
   
       setMenuVisibility(true);
       document.getElementById('singlePlayer').addEventListener('click', () => startGame('singlePlayer'));
       document.getElementById('multiPlayer').addEventListener('click', showNameForm); 
       document.getElementById('resume').addEventListener('click', () => setMenuVisibility(false));
       document.getElementById('freeforall').addEventListener('click', showTournamentForm);
       document.getElementById('tournament').addEventListener('click', showTournamentForm);
       initializeGame();
   
   }