let canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let h = 600;
let w = 1020;
let isHammerDrawn =false;
let isGameOver =false;
let mainAudio = new Audio("sounds/MacDonald.mp3");

let farmer ={
    type: 'farmer',
    x: 60,
    y: 60
};
let step = 60;

let bunny ={
    type: 'bunny',
    x: 360,
    y: 360
};


let carrotMap = [
    [0,34, 0, 1,0,1,0,1,0,100,0,1,0,1,0,1,0],
    [0,78, 0, 1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1, 0, 1,0,1,0,1,0,1,0,1,0,45,0,1,0],
    [0,1, 0, 1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1, 0, 1,0,54,0,1,0,1,0,67,0,1,0,1,0],
    [0,1, 0, 1,0,1,0,23,0,1,0,1,0,1,0,1,0],
    [0,1, 0, 1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1, 0, 1,0,23,0,1,0,34,0,1,0,12,0,1,0],
    [0,56, 0, 78,0,1,0,23,0,1,0,78,0,1,0,1,0]
    
  ];

let farmerImg = document.createElement('IMG');
farmerImg.src = 'images/farmman.png';
 let bushImg = document.createElement('img');
 bushImg.src = 'images/bush.png';
 let soilImg = document.createElement('img');
 soilImg.src = 'images/soil.png';
 let carrotImg= document.createElement('img');
 carrotImg.src='images/carrot.png';
 let bunnyImg = document.createElement('img');
 bunnyImg.src= 'images/bunny.png';
 let hammerImg =document.createElement('img');
 hammerImg.src = 'images/hammer.png';
 let gameOverImg =document.createElement('img');
 gameOverImg.src='images/gameover.jpg';
 


function draw() {
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
   
    drawBush();
    drawSoil();
    drawCarrot();
    ctx.drawImage(farmerImg, farmer.x,farmer.y,60,60);
    ctx.drawImage(bunnyImg,bunny.x,bunny.y,60,60);
    
    
    if (isHammerDrawn){
        ctx.drawImage(hammerImg,bunny.x,bunny.y,60,60);
    }
   
    if(isGameOver){
        ctx.drawImage(gameOverImg,  120,120,780,h-240);
    }
    
}
setInterval(draw, 10);
let bunnyInterval;
let timerInterval;

document.addEventListener("keydown", walking);

function timerFunc(){
    let timer=document.getElementById('timer');
    let count =  parseInt(timer.innerText)+1;

    if(count>=45){
        isGameOver = true;
        clearInterval(timerInterval);
    }else{
        timer.innerText = count;
    }
}


function walking (e){
    

    let currentStepX = 0;
    let currentStepY = 0;

    switch(e.which){
        case 38:
        if (farmer.y==0){
            return;
        }
            farmer.y -= step;
            currentStepY+=step;
        break;
        case 40:
            if (farmer.y==canvas.clientHeight-step){
                return;
            } 
            farmer.y += step;
            currentStepY-=step;
        break;
        case 37:
            if (farmer.x==0){
                return;
            }
            farmer.x -= step;
            currentStepX += step ;
        break;
        case 39:
            if (farmer.x==canvas.clientWidth-step){
                return;
            }
            farmer.x += step;
             currentStepX -= step;
        break;
        case 32: 
             score();
        break;


    }
    if(isBushCollision()){
        farmer.x += currentStepX;
        farmer.y += currentStepY;
    }
    Boom();

   
    
}

function isBushCollision(){
    if ( farmer.x==0 || farmer.y ==0 || farmer.x==w-step || farmer.y==h-step){
        alert("Get out of bushes, lad");
        return true;
    }
    return false;
}

function drawBush(){
    for (let index = 0; index<600; index+=60) {
        ctx.drawImage(bushImg, 0,index,60,60); 
               
    }
    for (let index = 0; index<1020; index+=60) {
        ctx.drawImage(bushImg, index,0,60,60); 
               
    }
    for (let index = 0; index<600; index+=60) {
        ctx.drawImage(bushImg, 960,index,60,60); 
    }
    for (let index = 0; index<1020; index+=60) {
        ctx.drawImage(bushImg, index,540,60,60); 
}

}
function drawSoil(){

    for (let i =step; i<h-step;i+=step){
       for( let j=step ; j <w-step;j+=step){
           ctx.drawImage(soilImg,j,i,60,60);
       }
    }
}

function mainSound(){
    mainAudio.play();
}

function drawCarrot(){
    for ( let i=step; i<h-step;i+=step){
        for (let j=step;j <w-step;j+=step*2){
            if (carrotMap[i/60][j/60]!==0)
            ctx.drawImage(carrotImg,j,i,60,60)
        }
    }
}
function drawBunny(){

    bunny.x =Math.floor((Math.random() * 13) + 1)*step;
    bunny.y=Math.floor((Math.random() * 8) + 1)*step;
    scoreForBunny();
    Boom();
}

//Score 
function score(){
    let scoreLabel=document.getElementById("score");
    let i =farmer.x/60;
    let j= farmer.y/60;
    if (carrotMap[j][i]!=0){
        let count =  parseInt(scoreLabel.innerText)+carrotMap[j][i];
        scoreLabel.innerText = count;
        carrotMap[j][i]=0;
     
    }

}

function scoreForBunny(){
    let scoreLabel=document.getElementById("score");
    let i =bunny.x/60;
    let j= bunny.y/60;
    if (carrotMap[j][i]!=0){
        let count =  parseInt(scoreLabel.innerText)-carrotMap[j][i];
        scoreLabel.innerText = count;
        carrotMap[j][i]=0;
    }
}

 function Boom(){
    if (farmer.x==bunny.x && farmer.y==bunny.y){
        isHammerDrawn=true;
        clearInterval(bunnyInterval);
        setTimeout(endBoom,3000);
    }
 }

 function endBoom(){
     if(isHammerDrawn)
        bunnyInterval = setInterval(drawBunny, 5500); 
     isHammerDrawn=false;
    
 }

 function startGame(elem){
    isGameOver = false;
    mainSound();
    document.getElementById('timer').innerText = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(timerFunc, 1000);
    bunnyInterval = setInterval(drawBunny, 5500);
    document.getElementById("score").innerText = "0";
    carrotMap =  [
        [0,34, 0, 1,0,1,0,1,0,100,0,1,0,1,0,1,0],
        [0,78, 0, 1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1, 0, 1,0,1,0,1,0,1,0,1,0,45,0,1,0],
        [0,1, 0, 1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1, 0, 1,0,54,0,1,0,1,0,67,0,1,0,1,0],
        [0,1, 0, 1,0,1,0,23,0,1,0,1,0,1,0,1,0],
        [0,1, 0, 1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1, 0, 1,0,23,0,1,0,34,0,1,0,12,0,1,0],
        [0,56, 0, 78,0,1,0,23,0,1,0,78,0,1,0,1,0]
        
      ];
      farmer.x = 60;
      farmer.y = 60;
      elem.blur();
 }

 let musicFlag = true;
 function mute(elem){
    if(musicFlag){
        mainAudio.pause();
        musicFlag=false;
    }       
    else{
        mainAudio.play();
        musicFlag = true;
    }

        elem.blur();
 }
 
