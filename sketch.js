// define variables
var dogImg, happyDog, milkImg;
var dog;
var foodStockRef, foodStock;
var timer = 0;
var feedPetButton, addFoodButton;
var foodClass;
var lastFed;
var nameInput, dogNameConfirmation, dogName, nameValid;
var gameState = "";
var bedroomImg, gardenImg, washroomImg;

function preload()
{
  // load images
  dogImg = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");
  deadDogImg = loadImage("virtual pet images/deadDog.png")
  
  bedroomImg = loadImage("virtual pet images/Bed Room.png");
  gardenImg = loadImage("virtual pet images/Garden.png");
  washroomImg = loadImage("virtual pet images/Wash Room.png");

}

function setup()
{
  // create canvas
  createCanvas(500, 500);
  imageMode(CENTER);
  // refer to food in database
  database = firebase.database();
  
  // create dog sprite and give normal dog image
  dog = createSprite(width/2 - 10, height/2 - 10, 20, 20);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  // make object from food class
  foodClass = new Food;
  // get foodStock from database
  foodClass.getFoodStock();
  // get lastFed from database
  getLastFed();
  // get gameState from database
  getGameState();

  // make button to feed pet
  feedPetButton = createButton("Feed the dog")
  feedPetButton.position(width/2, height - height / 10);
  feedPetButton.mousePressed(feedDog);
  // make button to add food
  addFoodButton = createButton("add food")
  addFoodButton.position(width/2 - 120, height - height / 10);
  addFoodButton.mousePressed(addFood);
  // make input for dog name with confirmation button
  nameInput = createInput("dog's name");
  nameInput.position(width/2 - 120, height - height/10 - 50);
  dogNameConfirmation = createButton("Go!")
  dogNameConfirmation.position(width/2 + 40, height - height / 10 - 50);
  dogNameConfirmation.mousePressed(dogNameText);

}

function draw()
{  
  // make lime background
  background(rgb(46, 139, 87));

  // if the foodStock is less than 1
  if(foodStock <= 0)
  {
    // display message
    fill("white");
    textSize(20);
    text("food has run out", width/2 - 85, height/2 - 100);
  }

  // display foodstock text
  textSize(20);
  fill("white");
  text("Food stock: " + foodStock, width/2 - 100, height / 2 + height / 5 );

  // display instructions text if dogName is valid
  if(nameValid)
    text("Click the buttons to feed " + dogName + "!", width/2-180, 20);

  // display lastFed in AM/PM
  if(lastFed >= 12)
  {
    text("Last Feed: " + lastFed % 12 + "PM", width/2 - 100, height/2 + height/4);
  }
  else if(lastFed === 0)
  {
    text("Last Feed: 12 AM", width/2 - 100, height/2 + height/4);
  }
  else
  {
    text("Last Feed: " + lastFed + "AM", width/2 - 100, height/2 + height/4);
  }
  currentTime = hour();
  if(gameState !== "hungry")
  {
    feedPetButton.hide();
    addFoodButton.hide();
    // every 150 frames
    if(frameCount % 150 === 0)
    {
      // give the dog the normal image (so happy image does not stay forever)
      dog.addImage(dogImg);
    }
  }
  else
  {
    feedPetButton.show();
    addFoodButton.show();
    dog.addImage(deadDogImg);
  }
  
  if(currentTime === (lastFed + 1) || currentTime === lastFed)
  {
    gameState = "playing";
    garden();
  }
  else if(currentTime === (lastFed + 2))
  {
    gameState = "sleeping";
    bedroom();
  }
  else if(currentTime >= (lastFed + 3) && currentTime <= (lastFed + 4))
  {
    gameState = "bathing";
    washroom();
  }
  else
  {
    gameState = "hungry";
  }

  console.log(gameState);
  // update gameState
  updateGameState(gameState);

  // console.log(gameState);

  // display milk bottles
  foodClass.display();
  
  // draw sprites
  drawSprites();
}

function feedDog()
{

  if(foodStock > 0)
  {
    // get hour
    lastFed = hour();
    // update database for lastFed
    updateLastFed();
    // deduct food
    foodClass.deductFood();
    // add happy image
    dog.addImage(happyDog);
    // updateFoodStock
    foodClass.update(foodStock);
  }
}

function addFood()
{
  if(foodStock < 20)
  {
    // increase foodStock by one and update database
    foodStock ++;
    foodClass.update(foodStock);
  }
}

function getLastFed()
{
  // get value of lastFed time from database
  database.ref("lastFed").on("value", (data) => 
  {
    lastFed = data.val();
  })
}

function updateLastFed()
{
  database.ref("/").update(
    {
      lastFed: lastFed
    }
  )
}

async function getGameState()
{
  // get value of lastFed time from database
  database.ref("lastFed").on("value", (data) => 
  {
    lastFed = data.val();
  })
}

async function updateGameState(state)
{
  database.ref("/").update(
    {
      gameState: state
    }
  )
}

function dogNameText()
{
  // make dogName equal user input and display text
  dogName = nameInput.value();
  nameValid = true;
}

function bedroom()
{
  image(bedroomImg, width/2, height/2, width, height);
}
function garden()
{
  image(gardenImg, width/2, height/2, width, height);
}
function washroom()
{
  image(gardenImg, width/2, height/2, width, height);
}
