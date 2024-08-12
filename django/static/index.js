// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight , 2, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajout des étoiles en arrière-plan 
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

// Génération aléatoire des positions des étoiles
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

// Contour de la carte
const borderGeometry = new THREE.BoxGeometry(10.2, 0.2, 0.2);
const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Couleur rouge pour le contour

const topBorder = new THREE.Mesh(borderGeometry, borderMaterial);
topBorder.position.set(0, 5, 0);
scene.add(topBorder);

const bottomBorder = new THREE.Mesh(borderGeometry, borderMaterial);
bottomBorder.position.set(0, -5, 0);
scene.add(bottomBorder);

const sideBorderGeometry = new THREE.BoxGeometry(0.2, 10, 0.2);

const leftBorder = new THREE.Mesh(sideBorderGeometry, borderMaterial);
leftBorder.position.set(-5, 0, 0);
scene.add(leftBorder);

const rightBorder = new THREE.Mesh(sideBorderGeometry, borderMaterial);
rightBorder.position.set(5, 0, 0);
scene.add(rightBorder);

// Création du plancher
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 }); // Couleur verte pour le plancher
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

// Positionnement et rotation du plancher
floor.position.y = -0.1; // Positionnement légèrement en dessous des bordures pour éviter tout conflit visuel
scene.add(floor);

// Création des palettes et de la balle
const paddleGeometry = new THREE.BoxGeometry(0.2, 2, 0.2);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
scene.add(paddle1);
scene.add(paddle2);

const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Variables pour le score
let score1 = 0;
let score2 = 0;
let gameOver = false;
let gameStarted = false; // Variable pour vérifier si le jeu a commencé

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
    scoreContext.fillText(`Joueur 1: ${score1}`, scoreCanvas.width / 4, scoreCanvas.height / 4 *2); // Score joueur 1 en haut à gauche
    scoreContext.fillStyle = 'red';
    scoreContext.textAlign = 'right';
    scoreContext.fillText(`Joueur 2: ${score2}`,  scoreCanvas.width / 4 * 3 , scoreCanvas.height / 4 * 2); // Score joueur 2 en haut à droite
}

// Fonction pour afficher le message de victoire
function showWinMessage(player) {
    scoreContext.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreContext.font = '50px Arial';
    scoreContext.fillStyle = 'green';
    scoreContext.textAlign = 'center';
    scoreContext.fillText(`${player} wins!`, scoreCanvas.width / 2, scoreCanvas.height / 2);
    scoreContext.font = '20px Arial';
    scoreContext.fillText('Press Spacebar to restart', scoreCanvas.width / 2, scoreCanvas.height / 2 + 50);
}

// Positionnement des éléments
paddle1.position.x = -4.5;
paddle2.position.x = 4.5;
paddle1.position.y = paddle2.position.y = 0;
camera.position.z = 10;
camera.position.y = 0;
camera.position.x = 0;

// Variables pour le mouvement de la balle
let ballSpeed = 0.05;
let ballDirection = new THREE.Vector3(1, 1, 0).normalize(); // Balle se déplace en diagonale
const speedIncrease = 0.005; // Augmenter la vitesse de la balle chaque fois qu'elle touche une palette

// Variables pour le mouvement des palettes
let paddle1Speed = 0;
let paddle2Speed = 0;
const paddleSpeed = 0.1;

// Fonction d'animation
function animate() {
    if (gameOver) return;

    requestAnimationFrame(animate);

    if (!gameStarted) {
        renderer.render(scene, camera);
        return;
    }

    // Déplacement des palettes
    paddle1.position.y += paddle1Speed;
    paddle2.position.y += paddle2Speed;

    // Limitation des mouvements des palettes (en tenant compte des contours)
    const paddleLimitY = 3.9;
    paddle1.position.y = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle1.position.y));
    paddle2.position.y = Math.max(-paddleLimitY, Math.min(paddleLimitY, paddle2.position.y));

    // Déplacement de la balle
    ball.position.add(ballDirection.clone().multiplyScalar(ballSpeed));

    // Collision avec les murs (axes Y)
    if (ball.position.y > 4.8 || ball.position.y < -4.8) {
        ballDirection.y *= -1;
    }

    // Collision avec les palettes (axes X)
    if (ball.position.x > paddle2.position.x - 0.1 && ball.position.x < paddle2.position.x + 0.1 &&
        ball.position.y > paddle2.position.y - 1 && ball.position.y < paddle2.position.y + 1) {
        ballDirection.x *= -1;
        ballSpeed += speedIncrease; // Augmenter la vitesse de la balle
    }
    if (ball.position.x < paddle1.position.x + 0.1 && ball.position.x > paddle1.position.x - 0.1 &&
        ball.position.y > paddle1.position.y - 1 && ball.position.y < paddle1.position.y + 1) {
        ballDirection.x *= -1;
        ballSpeed += speedIncrease; // Augmenter la vitesse de la balle
    }

    // Balle sort du terrain
    if (ball.position.x < -5) {
        score2 += 1;
        resetBall();
    }
    if (ball.position.x > 5) {
        score1 += 1;
        resetBall();
    }

    drawScores(); // Dessiner les scores

    // Vérifier si un joueur a gagné
    if (score1 >= 10) {
        gameOver = true;
        showWinMessage('Joueur 1');
    } else if (score2 >= 10) {
        gameOver = true;
        showWinMessage('Joueur 2');
    }

    renderer.render(scene, camera);
}

// Réinitialiser la balle
function resetBall() {
    ball.position.set(0, 0, 0);
    ballDirection = new THREE.Vector3((Math.random() > 0.5 ? 1 : -1), (Math.random() > 0.5 ? 1 : -1), 0).normalize();
    ballSpeed = 0.05; // Réinitialiser la vitesse de la balle
}

// Réinitialiser le jeu
function resetGame() {
    score1 = 0;
    score2 = 0;
    gameOver = false;
    gameStarted = false; // Le jeu n'a pas encore commencé
    resetBall();
    drawScores();
    renderer.render(scene, camera); // Assurez-vous que la scène est rendue correctement avant le début du jeu
}

// Déplacement des palettes avec les touches du clavier
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        paddle2Speed = paddleSpeed;
    } else if (event.key === 'ArrowDown') {
        paddle2Speed = -paddleSpeed;
    } else if (event.key === 'w') {
        paddle1Speed = paddleSpeed;
    } else if (event.key === 's') {
        paddle1Speed = -paddleSpeed;
    } else if (event.key === ' ') {
        if (gameOver) {
            resetGame();
        } else if (!gameStarted) {
            gameStarted = true; // Démarrer le jeu lorsque la barre d'espace est pressée
            animate(); // Relancer l'animation si elle est arrêtée
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        paddle2Speed = 0;
    } else if (event.key === 'w' || event.key === 's') {
        paddle1Speed = 0;
    }
});

// Démarrer l'animation
animate();
