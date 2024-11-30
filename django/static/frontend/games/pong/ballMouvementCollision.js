import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

import {isMenuOpen,isMenuTournamentFormOpen,modeSelected,setMenuVisibility,isMenuFormOpen,isPaused,gameStarted,setgameStarted,ia1Active,ia2Active,ballDirection,resetBall,ballSpeed,score1,score2,score3,score4,ball,paddle1,paddle2,paddle3,paddle4,pointLight,isModeFreeForAll,agScore,decscore, upgradeBallSpeed, setIsPaused} from './pong.js';
// Variables pour le mouvement des palettes
let paddle1Speed = 0;
let paddle2Speed = 0;
let paddle3Speed = 0;
let paddle4Speed = 0;
const paddleSpeed = 0.1;
const speedIncrease = 0.005;

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
                    upgradeBallSpeed(speedIncrease); // Augmenter la vitesse après la collision
                }
            }
        
            // Vérifier collision avec paddle4
            if (paddle4Box.intersectsBox(ballBox)) {
                // Raycast pour détecter les collisions avec les côtés des palettes
                const ballRay = new THREE.Raycaster(ball.position, ballDirection.clone().normalize());
                const intersections = ballRay.intersectObject(paddle4);
        
                if (intersections.length > 0) {
                    ballDirection.z *= -1; // Rebondir horizontalement
                   upgradeBallSpeed(speedIncrease);
                }
            }
  

    // Vérifier collision avec paddle1
    if (paddle1Box.intersectsBox(ballBox)) {
        // Raycast pour détecter les collisions avec les côtés des palettes
        const ballRay = new THREE.Raycaster(ball.position, ballDirection.clone().normalize());
        const intersections = ballRay.intersectObject(paddle1);

        if (intersections.length > 0) {
            ballDirection.x *= -1; // Rebondir horizontalement
            upgradeBallSpeed(speedIncrease); // Augmenter la vitesse après la collision
        }
    }

    // Vérifier collision avec paddle2
    if (paddle2Box.intersectsBox(ballBox)) {
        // Raycast pour détecter les collisions avec les côtés des palettes
        const ballRay = new THREE.Raycaster(ball.position, ballDirection.clone().normalize());
        const intersections = ballRay.intersectObject(paddle2);

        if (intersections.length > 0) {
            ballDirection.x *= -1; // Rebondir horizontalement
           upgradeBallSpeed(speedIncrease); // Augmenter la vitesse après la collision
        }
    }
 
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
            decscore(4);
            resetBall();
        }
        else if(ball.position.z + 0.2 > 5 )
        {
            ballDirection.z *= -1;
        }
        if (ball.position.z - 0.2 < -5 && score3 > 0) {
            decscore(3);
            resetBall();
        }
        else if(ball.position.z - 0.2 < -5 )
            ballDirection.z *= -1;
        if (ball.position.x + 0.2 > 5  && score2 > 0) {
            decscore(2);
            resetBall();
        } 
        else if(ball.position.x + 0.2 > 5)
            ballDirection.x *= -1;
         if (ball.position.x - 0.2 < -5 && score1 > 0) {
            decscore(1);
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
        agScore(1);
        resetBall();
    } else if (ball.position.x - 0.2 < -5) {
        agScore(2);
        resetBall();
    }
    }
   
}
// Fonction pour gérer les contrôles du clavier
function onDocumentKeyDown(event) {

    
    if (!gameStarted) {
       setgameStarted(true);
    }

    switch (event.key) {
        case 'Escape':
            if (isMenuOpen() === true && !isMenuFormOpen() && !isMenuTournamentFormOpen()) {
                setMenuVisibility(false);
                setIsPaused(false);
            } else if(isMenuOpen() ===false && !isMenuFormOpen() && !isMenuTournamentFormOpen()){
                setMenuVisibility(true) ;
                if(modeSelected)
                setIsPaused(true);
            }
            if(isMenuTournamentFormOpen())
            {    document.getElementById('tournamentForm').style.display = 'none';
                setMenuVisibility(true);

            }
            if(isMenuFormOpen()){
                 document.getElementById('nameForm').style.display = 'none';  
                 setMenuVisibility(true);
            }
             
            return; 

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

export {updatePaddlesPosition,updateBallPosition,detectCollision};