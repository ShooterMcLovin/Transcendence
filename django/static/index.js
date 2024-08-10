// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
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
    scoreContext.fillStyle = 'white';
    scoreContext.textAlign = 'left';
    scoreContext.fillText(`Joueur 1: ${score1}`, 20, 40); // Score joueur 1 en haut à gauche
    scoreContext.textAlign = 'right';
    scoreContext.fillText(`Joueur 2: ${score2}`, scoreCanvas.width - 20, 40); // Score joueur 2 en haut à droite
}
// Positionnement des éléments
paddle1.position.x = -4.5;
paddle2.position.x = 4.5;
paddle1.position.y = paddle2.position.y = 0;
camera.position.z = 10;
camera.position.y = 0;
camera.position.x = 0;
// Variables pour le mouvement de la balle
let ballSpeed = 0.1;
let ballDirection = new THREE.Vector3(1, 1, 0).normalize(); // Balle se déplace en diagonale
// Variables pour le mouvement des palettes
let paddle1Speed = 0;
let paddle2Speed = 0;
const paddleSpeed = 0.3;
// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    // Déplacement des palettes
    paddle1.position.y += paddle1Speed;
    paddle2.position.y += paddle2Speed;
    // Limitation des mouvements des palettes
    paddle1.position.y = Math.max(-4.5, Math.min(4.5, paddle1.position.y));
    paddle2.position.y = Math.max(-4.5, Math.min(4.5, paddle2.position.y));
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
    }
    if (ball.position.x < paddle1.position.x + 0.1 && ball.position.x > paddle1.position.x - 0.1 &&
        ball.position.y > paddle1.position.y - 1 && ball.position.y < paddle1.position.y + 1) {
        ballDirection.x *= -1;
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
    renderer.render(scene, camera);
}
// Réinitialiser la balle
function resetBall() {
    ball.position.set(0, 0, 0);
    ballDirection = new THREE.Vector3((Math.random() > 0.5 ? 1 : -1), (Math.random() > 0.5 ? 1 : -1), 0).normalize();
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