class Pacman {
    constructor(x,y,width, height, speed){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height =height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT; //initially\
        this.nextDirection = this.direction;
        this.currentFrame =1;
        this.frameCount=7;  //due to the number òf frame in animations gifs

        setInterval(()=>{
            this.changeAnimation();
            this.changePossibleDirection();
            
        }, 100);
    }

    moveProcess(){
        this.changePossibleDirection();
        this.moveForwards();
        if(this.checkCollision()){
            
            this.moveBackwards();
            return;
        }
    };
    
    eat(){
        for(let i = 0; i< map.length; i++){
            for(let j =0; j<map[0].length; j++){
                if(map[i][j] == 2 &&
                    this.getXinMap() == j &&
                    this.getYinMap() ==i
                ){
                    map[i][j] = 3;
                    score +=1;
                }
            }
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
        for(let i = 0; i<ghosts.length; i++){
            let ghost = ghosts[i];
            if(ghost.getXinMap() === this.getXinMap() &&
              ghost.getYinMap() === this.getYinMap()
            ){
                return true;
            }
        }
        return false;
    };
    changePossibleDirection(){ //change if the direction is possible
        if(this.direction === this.nextDirection) return;
        
        let tempDirect = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if(this.checkCollision()){
            this.moveBackwards();
            this.direction = tempDirect;
        }
        else{
            this.moveBackwards();
        }
    };
    changeAnimation(){
        this.currentFrame =
        (this.currentFrame === this.frameCount)?1: this.currentFrame+1;
    };
    draw(){
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2, 
            this.y + oneBlockSize / 2
        );
        canvasContext.rotate((this.direction *90* Math.PI)/180);
        // console.log((this.direction * Math.PI)/180)
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );
        canvasContext.drawImage(pacmanFrames,
        (this.currentFrame-1)*oneBlockSize,
        0,
        oneBlockSize,
        oneBlockSize,
        this.x,
        this.y,
        this.width,
        this.height
        );
        canvasContext.restore();
    };
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

let createNewPacman = () =>{
    pacman =  new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize/5,
    );
};


createNewPacman();