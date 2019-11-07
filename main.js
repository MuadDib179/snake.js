var run = true;
var direction          = [1,0];
var body               = [];
var bodyPositions      = [];
var addChild           = false;

function move(){
    let length = bodyPositions.length;
    for(let i = 0; i < body.length; i++){
        bodyPositions[length - (i + 1)] = bodyPositions[length - (i + 2)];
    }
    
    bodyPositions[0] = [
                            42*direction[0] + parseInt(body[0].style.left, 10),
                            42*direction[1] + parseInt(body[0].style.top, 10)
                            ];   
    
    update();
}
function update(){
    for(let i = 0; i < body.length; i++){
        body[i].style.left = bodyPositions[i][0];
        body[i].style.top  = bodyPositions[i][1];
    }
}
function add(){
    bodyPositions[bodyPositions.length] = [0,0];
    body[body.length] = makeSnakeBit(bodyPositions[body.length-1]);
}

window.onload = function(){
    let head = document.createElement("div");
    head.style.width = "40";
    head.style.height = "40";
    head.style.backgroundColor = "red";
    head.style.position = "absolute";
    head.style.top = 250;
    head.style.left = 250;
    this.document.body.appendChild(head);

    body[0] = head;
    bodyPositions[0] = [250,250];
    add();
    gameLoop();

    document.body.onclick = function(){
        run = run ? false : true;
    }
}
document.addEventListener("keydown", function(event){
    switch(event.keyCode){
        case 38:
            //upp
            if(direction[1] !== 1)    
                direction = [0,-1];
            break;
        case 40:
            //down
            if(direction[1] !== -1)
                direction = [0 , 1];
            break;
        case 37:
            //left
            if(direction[0] !== 1)
                direction = [-1, 0];
            break;
        case 39:
            //right
            if(direction[0] !== -1)
                direction = [1,0];
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

        await sleep(333);
    }
}


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}