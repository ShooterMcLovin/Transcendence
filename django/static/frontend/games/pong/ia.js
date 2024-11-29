
import { ballDirection,ballSpeed,score1,score2,ball,paddle1,paddle2} from './pong.js';


let aiTargetZ = 0;  // Position cible de l'IA (où elle pense que la balle arrivera)
let lastAiUpdateTime = 0;  // Temps du dernier calcul d'anticipation
const aiUpdateInterval = 1000;  // Intervalle de mise à jour (1 seconde)

let lastAi2UpdateTime = 0;  // Temps du dernier calcul d'anticipation pour IA2
const ai2UpdateInterval = 1000 ;  // Intervalle de mise à jour pour IA2 (1 seconde)
let ai2TargetZ = 0;  // Position cible de l'IA 2

function predictBallPositionForAI2() {
    // Cloner les positions et directions actuelles pour ne pas modifier l'original
    let predictedBallPosition = ball.position.clone();
    let predictedBallDirection = ballDirection.clone();
    let predictedBallSpeed = ballSpeed;
    const simulationDuration = 1000; // 1 seconde en millisecondes
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
    const aiSpeed = 0.1 ; // Vitesse de déplacement de l'IA 2

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
    const simulationDuration = 250; // 1 seconde en millisecondes/4 parceque je fait allez ma balle 4 x plus vite en simulation
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

function moveAI(deltaTime) {
    const currentTime = Date.now();
    const aiSpeed = 0.1 ; 

    // Anticipation une fois par seconde
    if (currentTime - lastAiUpdateTime > aiUpdateInterval ) {
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

export { moveAI ,moveAI2};