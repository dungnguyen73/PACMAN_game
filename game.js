const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");
const heartFrames = document.getElementById("heart");
const startBtn = document.getElementsByClassName("pushable")[0]
let DIRECTION_RIGHT = 4  //use for rotation
let DIRECTION_LEFT = 2
let DIRECTION_UP = 3
let DIRECTION_DOWN = 1
let pacman;
let score = 0;
let ghosts = [];
let ghostsCount = 4;
let createRect = (x,y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x,y,width,height);
};

startBtn.addEventListener('click', startGame);

let lives= 3;
// we now create the map of the walls,
// if 1 wall, if 0 not wall
// 21 columns // 23 rows
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 1, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let gameLoop = () =>{
    update();
    draw();
}
let update = () =>{
    pacman.moveProcess();
    pacman.eat();
    for(let i =0; i< ghosts.length; i++){
        ghosts[i].moveProcess();
    }

    if(pacman.checkGhostCollision()){
        console.log("Ghost collision");
        lives--;
        restartGame();
    }
};
let draw = () =>{
    createRect(0,0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawLivesLeft();
    drawGhosts();
    
};
let gameInterval;
function startGame() {
    lives = 3;
    gameInterval = setInterval(gameLoop, 1000/ fps);
    startBtn.style.display = "none";
}

let fps = 30;
let oneBlockSize = 20;
let wallColor = `#CC00FF`;
let wallInnerColor = 'black'

let wallSpaceWidth = oneBlockSize/ 1.6 ;// the black empty part inside the wall,( to look better)
let wallOffset = (oneBlockSize - wallSpaceWidth)/2; // the line between walls and paths
let drawWalls = () =>{
    for(let i = 0; i<map.length; i++){
        for(let j = 0; j<map[i].length; j++){
            if(map[i][j] ===1){ //walls
                
                createRect(j*oneBlockSize, i* oneBlockSize, oneBlockSize, oneBlockSize, `#CC00FF`);
            };
            if(j >0 && map[i][j-1] ===1){
                createRect(j*oneBlockSize,
                    i*oneBlockSize + wallOffset,
                    wallSpaceWidth + wallOffset,
                    wallSpaceWidth,
                    wallInnerColor);
            }
            if(j< map[0].length -1 && map[i][j+1] ===1){
                createRect(
                    j*oneBlockSize + wallOffset, 
                    i*oneBlockSize + wallOffset, 
                    wallSpaceWidth + wallOffset,
                    wallSpaceWidth, 
                    wallInnerColor);

            }
            if(i >0 && map[i-1][j] ===1){
                createRect(
                    j*oneBlockSize+ wallOffset,
                    i*oneBlockSize ,
                    wallSpaceWidth,
                    wallSpaceWidth+ wallOffset,
                    wallInnerColor);
            }
            if(i< map.length -1 && map[i+1][j] ===1){
                createRect(
                    j*oneBlockSize + wallOffset,
                    i*oneBlockSize + wallOffset,
                    wallSpaceWidth ,
                    wallSpaceWidth+ + wallOffset,
                    wallInnerColor);

            }
        }
    }
}

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) {
            // left arrow or a
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) {
            // up arrow or w
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {
            // right arrow or d
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {
            // bottom arrow or s
            pacman.nextDirection = DIRECTION_DOWN;
        }
    }, 1);
});


let foodWidth = 5; // = oneBlockSize /4
let foodHeight = 5;
let foodColor = 'white';

let drawFoods = () => {
    for(let  i =0; i< map.length; i++){
        for(let j = 0; j<map[0].length; j++){
            if(map[i][j] === 2){ //food
                createRect(
                    (j+1/4)*oneBlockSize ,
                    (i+1/4)*oneBlockSize,
                    foodWidth,
                    foodHeight,
                    foodColor,
                    
                );
            }
        }
    }
}

let drawScore = () =>{
    canvasContext.font = `20px Common Pixel`;
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(
    `SCORE: `+ score, 
    0, 
    oneBlockSize* (map.length +1)
    );
    
    
}
let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];



let restartGame=() =>{
    createNewPacman();
    createGhosts();
    if(lives ===0 ){
        gameOver();
    }
}
let gameOver = () =>{
    clearInterval(gameInterval);
    
    alert(`End game`);
    startBtn.style.display = 'block';
}
let drawLivesLeft = () =>{
    
    canvasContext.font = `20px Common Pixel`;
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(
    `LIVES: `+ lives, 
    oneBlockSize* (map[0].length -4), 
    oneBlockSize* (map.length +1)
    );
    
}