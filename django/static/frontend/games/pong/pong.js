import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

import { moveAI,moveAI2} from './ia.js';
import {sendWinnerMessage,fetchUser,populateUserDropdowns,showNameForm} from './utils.js';
import {showTournamentForm,populateTournamentDropdowns,tournamentScores,startTournamentMatches,match2Players,tournamentPlayers} from './tournament.js';
import {ball,paddle1,paddle2 ,paddle3,paddle4,renderer,scene,handleCameraTransition,handleInitialCameraRotation,pointLight,camera,drawScores,closeScoreVisible,woodTexture,scoreContext,scoreCanvas} from './sceneSetup.js';
import {updateBallPosition,updatePaddlesPosition,detectCollision} from './ballMouvementCollision.js';

let isTournament = false;
let isFirstMatchComplete = false;

let isPaused = false;
function setIsPaused(trueordfalse){
     isPaused = trueordfalse;
}
let currentMatch = 1;
// Fonction pour afficher/masquer le menu de pause
function setPauseMenuVisibility(visible) {
    const pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.style.display = visible ? 'block' : 'none';
}

function asingPlayer(){
    player1 = tournamentPlayers[0];
    player2 = tournamentPlayers[1];
    player3 = tournamentPlayers[2];
    player4 = tournamentPlayers[3];
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

let winners1;
let winners2;

// Fonction pour afficher le message de victoire
function showWinMessage(winner, loser) {

    scoreContext.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreContext.font = '50px Arial';
    scoreContext.fillStyle = 'green';
    scoreContext.textAlign = 'center';
    if (!isModeFreeForAll && !isTournament || (currentMatch === 1 || currentMatch === 2))
    {
         scoreContext.fillText(`${winner} wins!`, scoreCanvas.width / 2, scoreCanvas.height / 2);
        //  setTimeout(() => {
        //     scoreCanvas.style.display = 'none';
        // }, 3000);
    }  
    else
    {
         scoreContext.fillText(`${winner} wins tournament!`, scoreCanvas.width / 2, scoreCanvas.height / 2);
        //  setTimeout(() => {
        //     scoreCanvas.style.display = 'none';
        // }, 3000);
    }
       
    scoreContext.font = '20px Arial';
    // Masquer le canvas après un délai, par exemple 3 secondes

 // Délai en millisecondes
    // if(!isModeFreeForAll && !isTournament)
    sendWinnerMessage(winner, loser, 'Pong'); //// DO NOT REMOVE!
    // else if (isTournament)
    // sendWinnerMessage(winner, loser, 'tournement'); //// DO NOT REMOVE! tournement est sposer updater les tournement win/losses

    if (isTournament) {
        if (currentMatch === 1) {
            isFirstMatchComplete = true
            currentMatch = 2;
            startMatch(player3, player4, 'Match 2');
            isFirstMatchComplete = false;
            winners1 = winner;
        }
        else if (currentMatch === 2) {
            // Proceed to final match
            winners2 = winner;
            currentMatch = 3;
            startMatch(winners1, winners2, 'Final');
        }
        else {
            sendWinnerMessage(winner, loser, 'tournement'); //// DO NOT REMOVE! tournement est sposer updater les tournement win/losses
            // Tournament is complete
            console.log(`${winner} remporte le tournoi !`);
            // tournamentPlayers = []; // Clear players
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
let player2; 
let player3;
let player4;
let score1 = 0;
let score2 = 0;
let score3 = 0;
let score4 = 0;
let gameOver = false;
let gameStarted = false;
let isSinglePlayer = false;
let isMultiplayer = false;
function setgameStarted(falseortrue){
    gameStarted = falseortrue;
}
// Variables pour le mouvement de la balle
let ballSpeed = 0.05;
let ballDirection = getRandomDirection();
// const speedIncrease = 0.005;
function upgradeBallSpeed(speed){
    ballSpeed += speed;
}
function agScore(score){
    if(score === 1)
    score1 += 1;
    if(score === 2)
    score2 +=1 ;
}
function decscore(score){
    if(score === 1)
        score1 -= 1;
        if(score === 2)
        score2 -=1 ;
        if(score === 3)
            score3 -= 1;
            if(score === 4)
            score4 -=1 ; 
}
// Variables pour la rotation de la caméra
let initialCameraRotation = true;
function stopcamerarotation(){
    initialCameraRotation = false;
}

///variables mode
let modeSelected = false;
// Afficher le menu principal
function checkGameOver() {
    
    if(!modeSelected)
        {
            if(score1 === 7 || score2 ===7)
            {
                score1 = 0;
                score2 = 0;
                return;
            }
        }
    if(isModeFreeForAll)
    {   
        
        if(score1 === 0)
        {  paddle1.position.set(100, 100, 0);
            scene.remove(paddle1);
        }
       
        if(score2 === 0)
        { 
            paddle2.position.set(100, 100, 0);
           scene.remove(paddle2); 
        }
            
        if(score3 === 0)
        {
            paddle3.position.set(100, 100, 0);
            scene.remove(paddle3); 
        }
           
        if(score4 === 0)
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
    score1 = 0;
    score2 = 0; 
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
        currentMatch= 1;
        isSinglePlayer = false;
        isMultiplayer = false;
        isModeFreeForAll = false;
        ia1Active = false;
        ia2Active = false;
        // tournamentScores = { player1: 0, player2: 0 };
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
    initializeGameData();
    username = await fetchUser();
    console.log('Fetched Username:', username);
    player2 = "IA2"; 
    modeSelected = false;
    isMultiplayer = false;
    isTournament = false;
   isModeFreeForAll = false;
    isSinglePlayer = false;
    ia1Active= true;
    ia2Active= true;
    currentMatch= 1;
    initialCameraRotation = true;
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
    // document.getElementById('welcomeText').style.display = 'block'; // ou 'inline', 'flex', selon le besoin

 if (animationId) {
        cancelAnimationFrame(animationId); 
        console.log("Animation cancelled");
    }
}

// Exemple : fonction qui s'exécute quand on ferme le jeu
function closeGame() {
  closeScoreVisible(false);
  scoreCanvas.style.display = 'none';
    stopGame(); // Arrêter l'animation et nettoyer la scène
      closeGameWindow();
    console.log("Game has been stopped and window closed");
}

function asingNextPlayer(match21,match22){
 
    player3 = match21;
    player4 = match22;
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
    var windowExist1 = document.getElementById('myWindowgame');
    
    if (windowExist || windowExist1)
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
    closeScoreVisible(true);
    scoreCanvas.style.display = 'block'; 
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);
   scene.background = null; 
        
       document.getElementById('resumeButton').addEventListener('click', () => {
           setPauseMenuVisibility(false);
           isPaused = false;
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

   export {currentMatch,asingNextPlayer,isTournament,isMenuOpen,setIsPaused,isMenuFormOpen,isMenuTournamentFormOpen,modeSelected,isPaused,score1,score2,score3,score4,ballDirection,isfreeforall,startGame,player1,player2,player3,player4,startMatch,setMenuVisibility,asingPlayer,startMultiplayerHandler,paddle1,paddle2,paddle3,paddle4,ball,initialCameraRotation,stopcamerarotation,isModeFreeForAll,pointLight,ballSpeed,upgradeBallSpeed,agScore,decscore,resetBall,gameStarted,ia1Active,ia2Active,setgameStarted};