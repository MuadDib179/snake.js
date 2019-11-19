//#region suggestedDirections()
class SuggestedDirections{
    constructor(){
        this.nextDirection = null;
    }
    add(newDirection){
        let invertedNewDirection = this.inverse(newDirection);
        if(this.nextDirection === null){
            if(snakeDirection[0] !== invertedNewDirection[0] &&
                snakeDirection[1] !== invertedNewDirection[1])
            this.nextDirection = new Direction(newDirection, null); 
        }
        else{
            if(this.nextDirection.direction[0] !== invertedNewDirection[0] &&
                this.nextDirection.direction[1] !== invertedNewDirection[1])//for whatever reason you cant directly compare the inverted array??
                this.nextDirection.nextDirection = new Direction(newDirection, null); 
        }
    }
    get(){
        let newDirection = null
        if(this.nextDirection !== null){
            newDirection = this.nextDirection.direction;
            this.nextDirection = this.nextDirection.nextDirection;
        }
        return newDirection;
    }
    inverse(arr){ //inverses every number in the array
        let ret = [arr[0],arr[1]];
        if(arr[0] !== 0)
            ret[0] = arr[0]*-1
        if(arr[1] !== 0)
            ret[1] = arr[1]*-1    
        return ret
        // return [(arr[0] == 0) ? arr[0] : arr[0]*-1,(a[1] == 0) ? a[1] : a[1]*-1]; xD
    }
}
class Direction{
    constructor(direction, nextDirection){
        this.direction = direction;
        this.nextDirection = null;
    }
}
//#endregion
var run = true;
var suggestedDirections  = new SuggestedDirections();
var snakeDirection     = [1,0];
var body               = [];
var bodyPositions      = [];
var addChild           = false;
var fieldSize          = [];
var fieldSizeInTiles   = [];
var foodPosition       = [];
var food;
//#region snake stuff
function collisions(){
    if(fieldSize[0] < bodyPositions[0][0])
        bodyPositions[0][0] = 84;
    else if(bodyPositions[0][0] < 84)
        bodyPositions[0][0] = fieldSize[0];
    else if(fieldSize[1] < bodyPositions[0][1])
        bodyPositions[0][1] = 84;
    else if(bodyPositions[0][1] < 84)
        bodyPositions[0][1] = fieldSize[1];
    
    if(bodyPositions[0][0] == foodPosition[0] &&
        bodyPositions[0][1] == foodPosition[1]){
        spawnFood();
        add();
    }
    else{
        for(let i = 2; i < bodyPositions.length; i++){
            if(bodyPositions[0][0] == bodyPositions[i][0] &&
                bodyPositions[0][1] == bodyPositions[i][1])
                location.reload();
        }
    }

}
function move(){
    let length = bodyPositions.length;
    for(let i = 0; i < body.length; i++){
        bodyPositions[length - (i + 1)] = bodyPositions[length - (i + 2)];
    }
    snakeDirection = suggestedDirections.get() || snakeDirection;
    bodyPositions[0] = [
                            42*snakeDirection[0] + parseInt(body[0].style.left, 10),
                            42*snakeDirection[1] + parseInt(body[0].style.top, 10)
                        ];   
    collisions();
    update();
}
function update(){
    for(let i = 0; i < body.length; i++){
        body[i].style.left = bodyPositions[i][0];
        body[i].style.top  = bodyPositions[i][1];
    }
}
function add(){
    bodyPositions[bodyPositions.length] = bodyPositions[bodyPositions.length-1];
    body[body.length] = makeSnakeBit(bodyPositions[bodyPositions.length-1]);
}
//#endregion
//#region field stuff
function setUpField(){
    //removing 84 pixels to account for the border margin
    fieldSize[0] = 42*Math.floor((document.body.offsetWidth-84)/42);
    fieldSize[1] = 42*Math.floor((document.body.offsetHeight-84)/42);
    //sets the walls of the field
    document.body.appendChild(createWall(40,fieldSize[1]+40,[42,42]));    
    document.body.appendChild(createWall(fieldSize[0]+40,40,[42,42]));
    document.body.appendChild(createWall(40,fieldSize[1]+40,[fieldSize[0]+42,42]));
    document.body.appendChild(createWall(fieldSize[0]+40,40,[42,fieldSize[1]+42]));
    
    //sets the food div
    food = document.getElementById("food");
    //sets the field size in tiles(snake bits)
    fieldSizeInTiles[0] = fieldSize[0]/42;
    fieldSizeInTiles[1] = fieldSize[1]/42;
    //spawns food
    spawnFood();
    function createWall(width,height, position){
        let wall = document.createElement("div");
        wall.style.width            = width;
        wall.style.height           = height;
        wall.style.backgroundColor  = "#f078d0";
        wall.style.position         = "absolute";
        wall.style.left             = position[0];
        wall.style.top              = position[1];

        return wall;
    }
}
function spawnFood(){
    let set = false;
    do{
        set = false;
        foodPosition = [
                        84+42*Math.round(Math.random()*(fieldSizeInTiles[0]-2)),
                        84+42*Math.round(Math.random()*(fieldSizeInTiles[1]-2))
                    ];
        for(let i = 0; i < bodyPositions.length; i++){
            if(foodPosition[0] == bodyPositions[i][0] &&
                foodPosition[1] == bodyPositions[i][1]){
                    set = true;
                    console.log("stopped food from spawning inside snake");
            }
        }
    }while(set);

    food.style.left = foodPosition[0];
    food.style.top  = foodPosition[1];
}

//#endregion
window.onload = function(){
    setUpField();
    
    let head = document.createElement("div");
    head.style.width = "40";
    head.style.height = "40";
    head.style.backgroundColor = "red";
    head.style.position = "absolute";
    head.style.top = 336;
    head.style.left = 336;
    this.document.body.appendChild(head);

    body[0] = head;
    bodyPositions[0] = [336,336];
    add();add();add();add();add();
    gameLoop();
    document.body.onclick = function(){
        run = run ? false : true;
    }
}
document.addEventListener("keydown", function(event){
    switch(event.keyCode){
        case 38:
            //upp
            suggestedDirections.add([0,-1]);
            break;
        case 40:
            //down
            suggestedDirections.add([0 , 1]);
            break;
        case 37:
            //left
            suggestedDirections.add([-1, 0]);
            break;
        case 39:
            //right
            suggestedDirections.add([1,0]);
            break;
    }
})
function makeSnakeBit(position){
    let div = document.createElement("div");
    div.style.width = "40";
    div.style.height = "40";
    div.style.backgroundColor = "red";
    div.style.position = "absolute";
    div.style.top = position[1];
    div.style.left = position[0];
    document.body.appendChild(div);
    return div;
}

async function gameLoop(){
    for(;;){
        if(run){
            move();
            // console.log("shit");
        }

        await sleep(86);
    }
}


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}