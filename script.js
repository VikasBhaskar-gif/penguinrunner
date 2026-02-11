const penguin = document.getElementById("penguin");
const obstacle = document.getElementById("obstacle");
const obstacleImg = document.getElementById("obstacleImg");
const challengeDisplay = document.getElementById("challenge");
const input = document.getElementById("input");
const scoreDisplay = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const gameOverScreen = document.getElementById("gameOverScreen");
const startMessage = document.getElementById("startMessage");

let words = [
    "snow","ice","cold","gift","bell","tree",
    "star","elf","sled","coal","frost","noel",
    "wrap","mint"
];

let obstacles = [
    "snowball.png",
    "snowman.png",
    "polarbear.png",
    "grinch.png",
    "gift.png",
    "tree.png"
];

let currentAnswer = "";
let score = 0;
let speed = 8;
let obstacleX = window.innerWidth;
let gameInterval;
let running = false;

let velocity = 0;
let gravity = 0.7;
let jumping = false;
let solved = false;

document.addEventListener("keydown", function(e){
    if(e.code === "Space"){
        if(!running){
            startGame();
        }
    }
});

function startGame() {
    score = 0;
    speed = 8;
    obstacleX = window.innerWidth;
    scoreDisplay.textContent = score;
    gameOverScreen.style.display = "none";
    input.value = "";
    input.focus();
    running = true;

    startMessage.style.display = "none";

    penguin.style.bottom = "45px";
    penguin.src = "penguin.gif";

    newObstacle();
    newChallenge();

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 20);

    startSnow();
}

function newObstacle() {
    let randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
    obstacleImg.src = randomObstacle;

    if(randomObstacle === "polarbear.png"){
        obstacleImg.style.width = "130px";
    } 
    else if(randomObstacle === "tree.png"){
        obstacleImg.style.width = "120px";
    }
    else if(randomObstacle === "snowman.png"){
        obstacleImg.style.width = "120px";
    }
    else if(randomObstacle === "grinch.png"){
        obstacleImg.style.width = "120px";
    }
    else {
        obstacleImg.style.width = "100px";
    }

    obstacleX = window.innerWidth;
}

function newChallenge() {
    solved = false;
    currentAnswer = words[Math.floor(Math.random() * words.length)];
    challengeDisplay.textContent = currentAnswer;
}

function updateGame() {
    if (!running) return;

    obstacleX -= speed;
    obstacle.style.left = obstacleX + "px";

    if (solved && obstacleX < 500 && !jumping) {
        jump();
        solved = false;
    }

    if (jumping) {
        velocity -= gravity;
        let newBottom = parseFloat(penguin.style.bottom) + velocity;

        if (newBottom <= 45) {
            newBottom = 45;
            jumping = false;
            velocity = 0;
            penguin.src = "penguin.gif";
        }

        penguin.style.bottom = newBottom + "px";
    }

    if (obstacleX < -300) {
        newObstacle();
        newChallenge();
        score++;
        scoreDisplay.textContent = score;
        speed += 0.4;
    }

    checkCollision();
}

function checkCollision() {
    let p = penguin.getBoundingClientRect();
    let o = obstacleImg.getBoundingClientRect();

    if (
        p.right > o.left + 40 &&
        p.left < o.right - 40 &&
        p.bottom > o.top + 30
    ) {
        gameOver();
    }
}

input.addEventListener("input", function(){
    if(!running) return;

    if(input.value.trim() === currentAnswer && !solved){
        solved = true;
        input.value = "";
    }
});

function jump(){
    if(!jumping){
        jumping = true;
        velocity = 18;
        penguin.src = "penguin.png";
    }
}

function startSnow() {
    setInterval(() => {
        if (!running) return;

        let snow = document.createElement("div");
        snow.classList.add("snow");
        snow.style.left = Math.random() * window.innerWidth + "px";
        snow.style.animationDuration = (2 + Math.random() * 3) + "s";

        document.querySelector(".game").appendChild(snow);

        setTimeout(() => {
            snow.remove();
        }, 5000);
    }, 200);
}

function gameOver(){
    running = false;
    clearInterval(gameInterval);
    finalScore.textContent = score;
    gameOverScreen.style.display = "flex";
    startMessage.style.display = "block";
}
