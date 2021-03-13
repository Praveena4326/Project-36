//Create variables here
var dog, happyDog, database, foodS, foodStock;
var canvas;
var dogImg, happyDogImg;
var feedDog, addFood;
var lastFed, fedTime;
var foodObj;
var changeState, readState;
var bedroomImg, gardenImg, washroomImg;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");

  bedroomImg = loadImage("images/virtual pet images/Bed Room.png");
  gardenImg = loadImage("images/virtual pet images/Garden.png");
  washroomImg = loadImage("images/virtual pet images/ Wash Room.png");
}

function setup() {
  canvas = createCanvas(700, 500);
  database = firebase.database();
  dog = createSprite(320,300,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  addFood = createButton("Add Food");
  addFood.position(600,50);
  addFood.buttonPressed(addfoodObj);

  feedDog = createButton("Feed Food");
  feedDog.position(640,50);
  feedDog.buttonPressed(feedFood);

  foodObj = new Food();
  
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })
}


function draw() {  
  
  background(46,139,87)
  
  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  if(currentTime===(lastFed+1)){
    update("Playing");
    foodObj.garden();
}

else if(currentTime===(lastFed+2)){
 update("Sleeping");
 foodObj.bedroom();
}

else if(currentTime>(last+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
}

else{
    update("Hungry")
    foodObj.display();
}

  if(gameState!== "Hungry"){
    feed.hide();
    addFood.show();
    dog.remove();
  }

  else{
    feed.show();
    addFood.show();
    dog.addImage("dogImg");
  }

  if(currentTime===lastFed+1){
    garden();
    gameState = changeState;
     update(){
      database.ref('/').update({
        gameState:playing
      })
    }
    }

    if(currentTime=2<4){
      washroom();
       update(){
        database.ref('/').update({
          gameState: bathing
        })
      }
    }
    
   


  foodObj.diplay();

  drawSprites();
  //add styles here
  textSize(20)
  fill("red")
  stroke("white")
  
  text("Press the UP ARROW key to feed LUCY milk!!",150,50);
  text("Food Remaining:" +foodS,190,100);
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x)
{

  if(x<=0){
    x=0;
  
  }

  else{
    x = x-1
  }
  database.ref('/').update({
    Food:x
  })
}

function addfoodObj(){

  foodS = foodS+1;
  database.ref('/').update({
    Food:foodS
  })
  }


function feedFood(){

  dog.addImage(happyDog);
  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }

  else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)

  }
  database.ref('/').update({
    Food: foodObj.getFoodStock()
    feedTime: hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
