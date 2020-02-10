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
var run = false;
var suggestedDirections  = new SuggestedDirections();
var snakeDirection     = [1,0];
var body               = [];
var bodyPositions      = [];
var addChild           = false;
var fieldSize          = [];
var fieldSizeInTiles   = [];
var foodPosition       = [];
var food;
var menuWall;
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
        add();
    }
    else{
        for(let i = 2; i < bodyPositions.length; i++){
            if(bodyPositions[0][0] == bodyPositions[i][0] &&
                bodyPositions[0][1] == bodyPositions[i][1]){
                openMenu("dead");
                run = false;
            }
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
function makeSnakeBit(position){
    let div                     = document.createElement("div");
    div.style.width             = "40";
    div.style.height            = "40";
    div.style.backgroundColor   = "red";
    div.style.position          = "absolute";
    div.style.zIndex            = -1;
    div.style.top               = position[1];
    div.style.left              = position[0];
    
    document.body.appendChild(div);
    return div;
}
function setupSnake(length){
    body = [];
    bodyPositions = [];
    let head = makeSnakeBit([336,336]);
    body[0] = head;
    bodyPositions[0] = [336,336];

    for(let i = 0; i < length; i++)
        add();
}

//#endregion
//#region field stuff
function setUpField(init){
    run = true;

    //removing 84 pixels to account for the border margin
    fieldSize[0] = 42*Math.floor((document.body.offsetWidth-84)/42);
    fieldSize[1] = 42*Math.floor((document.body.offsetHeight-84)/42);

    if(init){//only runs if this is the initial set of the field
        //sets up them menu when it is collapsed (the wall state)
        document.styleSheets[0].insertRule(".menu{height: " + (fieldSize[1]+40) + "px}",0);
        document.styleSheets[0].insertRule(".menu{top:42px}",0);
        document.styleSheets[0].insertRule(".menu{left:42px}",0);
        //sets up the menu transition
        document.styleSheets[0].insertRule(".menu.open{width: "+fieldSize[0]+"px !important}",0);
        //sets the menu-wall
        menuWall = document.getElementById("menu");
    }
    else{
        //sets the walls of the field   
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
    }
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
    do{//stops food from spawning inside the snake
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
//#region menu logic
function reset(){
    let length = document.body.children.length;
    for(let i = length-1; i > 0; i--){//clears the field
        if(document.body.children[i].id !== "menu"&&
            document.body.children[i].id !== "food")
            document.body.removeChild(document.body.children[i]);
    }
    setUpField(false);
    setupSnake(15);
    openMenu("dead");    
}
function openMenu(context){
    if(context === "dead"){
        if(menuWall.classList.contains("open"))
            menuWall.classList.remove("open");
        else
            menuWall.classList.add("open");
    }
    else if(context === "init"){
       setUpField(true);
       setupSnake(5);
       gameLoop(); 
    }
}
//#endregion
window.onload = function(){
    openMenu("init");

    //pausing function for testing
    // document.body.onclick = function(){
    //     run = run ? false : true;
    //     if(menuWall.classList.contains("open"))
    //         menuWall.classList.remove("open");
    //     else
    //         menuWall.classList.add("open");
    // }
}
document.addEventListener("keydown", function(event){
    switch(event.keyCode){
        case 38:
            //upp
            suggestedDirections.add([0, -1]);
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
            suggestedDirections.add([1, 0]);
            break;
    }
})
async function gameLoop(){
    for(;;){
        if(run){
            move();
        }

        await sleep(90);
    }
}


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}