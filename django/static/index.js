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

// Ajoutez cette fonction pour contrôler le mouvement de l'IA
function moveAI() {
    const aiSpeed = 0.05; // Vitesse de déplacement de l'IA

    if (ball.position.z > paddle1.position.z + aiSpeed) {
        paddle1.position.z += aiSpeed;
    } else if (ball.position.z < paddle1.position.z - aiSpeed) {
        paddle1.position.z -= aiSpeed;
    }

    // Limiter la position de la palette 1 pour ne pas sortir des bordures
    const paddleLimitY = 3.9;
    paddle1.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle1.position.z));
}

// Variables pour le score
let score1 = 0;
let score2 = 0;
let gameOver = false;
let gameStarted = false;
let isSinglePlayer = false;
let isMultiplayer = false;
let isTournament = false;
let currentMatch = 1;
const maxMatches = 5;
let tournamentScores = { player1: 0, player2: 0 };

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
    scoreContext.fillText(`Joueur 1: ${score1}`, scoreCanvas.width / 4, scoreCanvas.height / 4 * 2);
    scoreContext.fillStyle = 'red';
    scoreContext.textAlign = 'right';
    scoreContext.fillText(`Joueur 2: ${score2}`, scoreCanvas.width / 4 * 3, scoreCanvas.height / 4 * 2);
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


// Fonction pour afficher le message de fin de tournoi
function endTournament(winner) {
    setMenuVisibility(true);
    const menu = document.getElementById('menu');
    menu.innerHTML = `
        <h1>${winner} a gagné le tournoi!</h1>
        <p>Scores finaux :</p>
        <p>Joueur 1 : ${tournamentScores.player1}</p>
        <p>Joueur 2 : ${tournamentScores.player2}</p>
        <button id="restart">Recommencer le Tournoi</button>
    `;
    document.getElementById('restart').addEventListener('click', () => startGame('tournament'));
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

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);

    if (gameOver) return;

    if (!modeSelected ) {
        if (initialCameraRotation) {
            rotationAngle += 0.01;
            const radius = 9;
            camera.position.x = Math.cos(rotationAngle) * radius;
            camera.position.z = Math.sin(rotationAngle) * radius;
            camera.position.y = 6;
            camera.lookAt(0, 0, 0);
            if (rotationAngle >= 2.5 * Math.PI ) {
                rotationAngle = 0;
                initialCameraRotation = false;
                transitioningCamera = true;
                cameraStartPosition.copy(camera.position);
            }
            renderer.render(scene, camera);
            // return;
        }
    }

    // if (transitioningCamera) {
        camera.position.lerp(cameraTargetPosition, cameraTransitionSpeed);
        if (camera.position.distanceTo(cameraTargetPosition) < 0.1) {
            camera.position.copy(cameraTargetPosition);
            cameraStartPosition.copy(camera.position);
            transitioningCamera = false;
        }
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        // return;
    // }
    
    if (isSinglePlayer) {
        moveAI(); // Lancer l'IA si le mode solo est activé
    }
    paddle1.position.z += paddle1Speed;
    paddle2.position.z += paddle2Speed;

    const paddleLimitY = 3.9;
    paddle1.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle1.position.z));
    paddle2.position.z = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle2.position.z));

    ball.position.add(ballDirection.clone().multiplyScalar(ballSpeed));

    if (ball.position.z + 0.1 > 5 || ball.position.z - 0.1 < -5) {
        ballDirection.z *= -1;
    }

    if (ball.position.x + 0.2 > 5) {
        score1 += 1;
        if (isTournament) {
            tournamentScores.player1 += 1;
            if (currentMatch >= maxMatches) {
                endTournament('Joueur 1');
                return;
            }
        }
        resetBall();
    } else if (ball.position.x - 0.2 < -5) {
        score2 += 1;
        if (isTournament) {
            tournamentScores.player2 += 1;
            if (currentMatch >= maxMatches) {
                endTournament('Joueur 2');
                return;
            }
        }
        resetBall();
    }

    if (ball.position.x + 0.1 > paddle2.position.x - 0.2 &&
        ball.position.x - 0.1 < paddle2.position.x + 0.2 &&
        ball.position.z + 0.1 > paddle2.position.z - 1 &&
        ball.position.z - 0.1 < paddle2.position.z + 1) {
        ballDirection.x *= -1;
        ballSpeed += speedIncrease;
    }
    if (ball.position.x + 0.1 > paddle1.position.x - 0.2 &&
        ball.position.x - 0.1 < paddle1.position.x + 0.2 &&
        ball.position.z + 0.1 > paddle1.position.z - 1 &&
        ball.position.z - 0.1 < paddle1.position.z + 1) {
        ballDirection.x *= -1;
        ballSpeed += speedIncrease;
    }

    drawScores();

    if (score1 >= 7) {     
        paddle1.position.set(-4.5, 0, 0);
        paddle2.position.set(4.5, 0, 0);
        showWinMessage('Joueur 1');
        gameOver = true;
   
    } else if (score2 >= 7) {       
        paddle1.position.set(-4.5, 0, 0);
        paddle2.position.set(4.5, 0, 0);
        showWinMessage('Joueur 2');
        gameOver = true;

    }

    renderer.render(scene, camera);
}

// Fonction pour gérer les contrôles du clavier
function onDocumentKeyDown(event) {
    if (event.key === ' ') {
        if (gameOver) {
            if (isTournament) {
                startGame('tournament');
            } else {
                score1 = 0;
                score2 = 0;
                gameOver = false;
                resetBall();
                setMenuVisibility(false); // Cacher le menu
            }
        } else if (!gameStarted) {
            gameStarted = true;
        }
    }
    // if (event.key === 'Escape') {
    //     if (gameOver) {
    //         // Retourner au menu principal
    //         setMenuVisibility(true);
    //         score1 = 0;
    //         score2 = 0;
    //         gameOver = false;
    //         setMenuVisibility(true); // Afficher le menu principal
    //     }
    // }
    if (event.key === 'ArrowUp') {
        paddle2Speed = -paddleSpeed;
    } else if (event.key === 'ArrowDown') {
        paddle2Speed = paddleSpeed;
    } else if (event.key === 'w') {
        paddle1Speed = -paddleSpeed;
    } else if (event.key === 's') {
        paddle1Speed = paddleSpeed;
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

// Fonction pour démarrer le jeu
function startGame(mode) {
    if (mode === 'singlePlayer') {
        isSinglePlayer = true;
        isMultiplayer = false;
        isTournament = false;
    } else if (mode === 'multiPlayer') {
        isSinglePlayer = false;
        isMultiplayer = true;
        isTournament = false;
    } else if (mode === 'tournament') {
        isSinglePlayer = false;
        isMultiplayer = false;
        isTournament = true;
        currentMatch = 1;
        tournamentScores = { player1: 0, player2: 0 };
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
document.getElementById('multiPlayer').addEventListener('click', () => startGame('multiPlayer'));
document.getElementById('tournament').addEventListener('click', () => startGame('tournament'));

// Ajuster la taille du rendu en cas de redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    scoreCanvas.width = window.innerWidth;
    scoreCanvas.height = 100;
    drawScores();
});

// Lancer l'animation
animate();