import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

import {initialCameraRotation, stopcamerarotation ,player1,player2,player3,player4,score1,score2,score3,score4,isModeFreeForAll,gameStarted,setgameStarted,ia1Active,ia2Active} from './pong.js';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     creation d'image                                                                      ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let rotationAngle = 0;
let transitioningCamera = false;
const cameraTransitionSpeed = 0.05;
const cameraTargetPosition = new THREE.Vector3(0, 10, 0);
const cameraStartPosition = new THREE.Vector3();
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
const woodTexture = textureLoader.load('/static/frontend/games/pong/wood.jpg');
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

// Variables pour la rotation de la caméra

camera.lookAt(0, 0, 0);

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
          stopcamerarotation();
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
function getFontSize() {
    // Vous pouvez ajuster ce facteur en fonction de vos besoins
    const fontSizeFactor = 0.33;
    return scoreCanvas.height * fontSizeFactor;
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
function closeScoreVisible( yesorno){
    scoresVisible = yesorno;
}
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export { ball,paddle1,paddle2,paddle3,paddle4,renderer,scene,handleCameraTransition,handleInitialCameraRotation,pointLight,camera,drawScores,closeScoreVisible,woodTexture,scoreContext,scoreCanvas};