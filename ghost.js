class Ghost{
    constructor(x,y,width, height, speed, imageX, imageY, imageWidth, imageHeight, range ){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height =height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT; //initially\
        this.nextDirection = this.direction;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.range = range;
        this.randomTargetId = parseInt(Math.random() *randomTargetsForGhosts.length);
        this.target = randomTargetsForGhosts[this.randomTargetId];
        setInterval(()=>{
            // this.changeAnimation();
            this.changePossibleDirection();
            
        }, 100);
    }

    changeRandomDirection(){
        this.randomTargetId = (this.randomTargetId+1)%(randomTargetsForGhosts.length);
    }

    moveProcess(){
        if(this.isPacmaninRange()){
            this.target = pacman;
        }
        else{
            this.target = randomTargetsForGhosts[this.randomTargetId];
            // this.randomTargetId = Math.floor(Math.random() *4); //new random target 
        }
        this.changePossibleDirection();
        this.moveForwards();
        if(this.checkCollision()){
            
            this.moveBackwards();
            return;
        }
    };
    

    
    moveForwards(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x += this.speed;
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION_UP:
                this.y -= this.speed;
                break;
            case DIRECTION_DOWN:
                this.y += this.speed;
                break;
        }
            
            
    };
    moveBackwards(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x -= this.speed;
                break;
            case DIRECTION_LEFT:
                this.x += this.speed;
                break;
            case DIRECTION_UP:
                this.y += this.speed;
                break;
            case DIRECTION_DOWN:
                this.y -= this.speed;
                break;
        }
    };
    
    checkCollision(){
        let isCollided = false;
        if(
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
            ){
               isCollided = true;
        }
        return isCollided;
    };
    checkGhostCollision(){
    
    };
    isPacmaninRange(){
        let xDictance = Math.abs(pacman.getXinMap() - this.getXinMap());
        let yDictance = Math.abs(pacman.getYinMap() - this.getYinMap());
        if(Math.sqrt(xDictance* xDictance + yDictance*yDictance) <= this.range){
            return true;
        }
        return false;

    }
    changePossibleDirection(){ //change if the direction is possible
        let tempDirections = this.direction;
        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x/oneBlockSize),
            parseInt(this.target.y/oneBlockSize),
        )
        if(typeof this.direction == `undefined`){
            this.direction = tempDirections;
            return;
        }
        //handle in the corner
        if(
            this.getYinMap() != this.getMapYRightSide() &&
            ( this.direction === DIRECTION_LEFT || this.direction === DIRECTION_RIGHT )
        ){
            this.direction = DIRECTION_UP;
        }
        if(this.getXinMap() != this.getMapXRightSide() && this.direction== DIRECTION_UP)
        {
            this.direction= DIRECTION_LEFT;
        }
        this.moveForwards();
        if(this.checkCollision()){
            this.moveBackwards();
            this.direction = tempDirections;
        }
        else{
            this.moveBackwards();
        }
    };
    
    calculateNewDirection(map, TargetX, TargetY){ // base on Dijkstra algorithm
        let mp = [];
        for(let i = 0; i<map.length; i++){
            mp[i] = map[i].slice();
        }
        let queue = [
            {
                x: this.getXinMap(),
                y: this.getYinMap(),
                moves: [] //
            }
        ]

        while(queue.length> 0){
            let top = queue.shift();
            if(top.x === TargetX && top.y === TargetY){
                // console.log(top.moves)
                return top.moves[0];
            }
            else{ // go check in the adjacent position
                mp[top.y][top.x] = 1; 
                let neighborList = this.addNeighbors(top, mp);
                for(let i = 0; i< neighborList.length; i++ ){
                    queue.push(neighborList[i]);
                }
            }
        }
        return DIRECTION_UP;
    }

    addNeighbors(top, mp){
        let queue = []
        let rows = mp.length;
        let cols = mp[0].length;
        
        if(top.x - 1 >= 0 && top.x -1 < rows &&
            mp[top.y][top.x -1 ] !== 1)
            {
                let tempMoves = top.moves.slice(); //for deep copy
                tempMoves.push(DIRECTION_LEFT);
                queue.push({x: top.x-1, y: top.y, moves: tempMoves});
            }
        if(top.x + 1 < rows && mp[top.y][top.x +1 ]  !== 1)
            {
                let tempMoves = top.moves.slice();
                tempMoves.push(DIRECTION_RIGHT);
                queue.push({x: top.x+1, y: top.y, moves: tempMoves});
            }
        if( top.y -1 >= 0 && mp[top.y-1][top.x] != 1 )
            {
                let tempMoves = top.moves.slice();
                tempMoves.push(DIRECTION_UP);
                queue.push({x: top.x, y: top.y-1, moves: tempMoves});
            }
        if( top.y +1 < cols && mp[top.y +1][top.x] != 1 )
            {
                let tempMoves = top.moves.slice();
                tempMoves.push(DIRECTION_DOWN);
                queue.push({x: top.x, y: top.y+1, moves: tempMoves});
            }
            
        return queue;
            
    }

    draw() {
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
        canvasContext.beginPath();
        canvasContext.strokeStyle = "red";
        canvasContext.arc(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2,
            this.range * oneBlockSize,
            0,
            2 * Math.PI
        );
        canvasContext.stroke();
        }
    
    // the x and y-coordinate of Pac-Man's position in the game map
    getXinMap(){  
        return parseInt(this.x / oneBlockSize);
    }
    getYinMap(){
        return parseInt(this.y / oneBlockSize);
    }
    // the right-side position of Pac-Man in the game map
    getMapXRightSide(){ 
        return parseInt( (this.x * 0.999 +  oneBlockSize) / oneBlockSize );
        // account for any potential rounding or floating-point precision issues
    }
    getMapYRightSide(){
        return parseInt( (this.y *  0.999 + oneBlockSize) / oneBlockSize );
    }
}; 

let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
];

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostsCount; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 4 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            100,
            100,
            6 + i
        );
        ghosts.push(newGhost);
    }
};
createGhosts();
let drawGhosts = () =>{
    for(let i = 0; i< ghosts.length;  i++){
        ghosts[i].draw();
    }
}