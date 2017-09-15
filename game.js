//Draw canvas and cards
var canvas = document.getElementById("myCanvas");
var card = canvas.getContext("2d");
var imgA = document.getElementById("pic_A");
var imgB = document.getElementById("pic_B");

var click1;
var click2;
var counter;
var playerScore;
var player;
var successPair;
var level;
var noOfPairs;

var wrongFlipAudio = new Audio("glass_ping.mp3");
var player1Audio = new Audio('Farty-McSty.mp3');
var player2Audio = new Audio('Stoned-Invaders_Looping.mp3');
var winnerAudio = new Audio('cheer2.mp3');

//Mouse Click on boardGame
canvas.addEventListener("mousedown", doMouseDown, false);

//Mouse Click - reset
var reset = document.getElementById('reset');
reset.addEventListener("click",startGame);

//Mouse Click - sound
var sound = document.getElementById('sound');
sound.addEventListener("click",turnOnOffSound);

//AssignCards -> 6*6 = 36 cards
var listOfcards = [];
var cardsOnCanvas =[];

//start game
startGame();

function startGame(){

// clear canvas
listOfcards = [];
cardsOnCanvas =[];

for(i=0;i<6;i++){
  var lat = i * 100;
  for(x=0;x<6;x++){
    var long = x* 100;
    card.clearRect(lat,long,100,100);
  }
}

// get selected level
  var select = document.querySelector("select").selectedIndex;
  if(select == 0){
    level = 16;
  }else{
    level = 36;
  }

  noOfPairs = level/2;

  // reset values
  click1 = 0;
  click2 = 0;
  counter = 0;
  playerScore = [{player:1, score:0}, {player:2, score:0}];
  player = playerScore[0];
  successPair = 0;
  document.getElementById("playerScore1").innerHTML = playerScore[0].score;
  document.getElementById("playerScore2").innerHTML = playerScore[1].score;

  // load music for player1
  player1Audio.pause();
  player2Audio.pause();
  wrongFlipAudio.play();
  player1Audio.play();

  //load card image
  for(loadImg = 0;loadImg<noOfPairs; loadImg++){
    listOfcards.push("imgA");
    listOfcards.push("imgB");
  }

  shuffle(listOfcards);
  loadCards();
  setTimeout(hideCards, 1000);
}

//shuffle Cards
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

//get selected card via position of mouseclick
function doMouseDown(event){
  var canvas_x = event.pageX - Math.abs(canvas.getBoundingClientRect().left);
  canvas_x = Math.floor(canvas_x/100)*100;

  var canvas_y = event.pageY - 500;
  canvas_y = Math.floor(canvas_y/100)*100;

  flipCard(canvas_x,canvas_y);
}

//flipCard
function flipCard(canvas_x,canvas_y){
  var obj = cardsOnCanvas.find(function (obj) {
    if (obj.lat === canvas_x && obj.long === canvas_y){
      return obj;
    }
  });

  card.drawImage(obj.img,obj.lat,obj.long,100,100);

  if(obj.cardMatched != "Yes"){
    setTimeout(function() {
      checkMatch(obj);
    }, 200)
  }
}

//loadCards
function loadCards(){

cardsOnCanvas = [];

  var imageID=0;
  for(i=0;i<Math.sqrt(level);i++){
    var long = i * 100;

   for(x=0;x<Math.sqrt(level);x++){
      var lat = x * 100;
      var img = window[listOfcards[imageID]];
      cardsOnCanvas.push({img:img, lat:lat, long:long, cardMatched:"No"}); //insert card position into Canvas
      card.drawImage(img,lat,long,100,100); // show cards on Canvas
      imageID =imageID+1;
    }
  }
}

//hideCards
function hideCards(){
  for(i=0;i<Math.sqrt(level);i++){
    var lat = i * 100;
    for(x=0;x<Math.sqrt(level);x++){
      var long = x* 100;
      card.clearRect(lat,long,100,100);
      card.strokeRect(lat,long,100,100);
      document.getElementById('announce').innerHTML ="Now playing: Player 1";
    }
  }
}

function checkMatch(obj){
  if(click1 == 0){
    click1 = obj;
  }else{
    click2 = obj;
  }

  if(click1 != 0 && click2 !=0){
    //check for match
    if(click1.img.id==click2.img.id){ //match
      click1.cardMatched = "Yes";
      click2.cardMatched = "Yes";
      card.strokeRect(click1.lat,click1.long,100,100);
      card.strokeRect(click2.lat,click2.long,100,100);
      player.score =player.score+1;
      successPair = successPair + 1;

    }else{ //unmatch
      card.clearRect(click1.lat,click1.long,100,100);
      card.clearRect(click2.lat,click2.long,100,100);
      card.strokeRect(click1.lat,click1.long,100,100);
      card.strokeRect(click2.lat,click2.long,100,100);
      wrongFlipAudio.play();

      //swap player
      if(player== playerScore[0]){
        document.getElementById('announce').innerHTML ="Now playing: Player 2";
        player1Audio.pause();
        player1Audio.currentTime = 0;
        player2Audio.play();
        player1Audio.currentTime = 0;
        player = playerScore[1];
      }else{
        document.getElementById('announce').innerHTML ="Now Playing: Player 1";
        player2Audio.pause();
        player2Audio.currentTime = 0;
        player1Audio.play();
        player1Audio.currentTime = 0;
        player = playerScore[0];
      }
    }

    //console.log(playerScore);
    document.getElementById("playerScore1").innerHTML = playerScore[0].score;
    document.getElementById("playerScore2").innerHTML = playerScore[1].score;
    click1 =0;
    click2 =0;

    //check game complete, announce winner
    if(successPair == noOfPairs){
      if(playerScore[1].score == playerScore[0].score){
        document.getElementById('announce').innerHTML ="It is a draw!";
        player2Audio.pause();
        player2Audio.currentTime = 0;
        player1Audio.pause();
        player1Audio.currentTime = 0;
        wrongFlipAudio.play();
      }
      if (playerScore[1].score >playerScore[0].score) {
        document.getElementById('announce').innerHTML ="Player 2 wins!";
        player2Audio.pause();
        player2Audio.currentTime = 0;
        player1Audio.pause();
        player1Audio.currentTime = 0;
        winnerAudio.play();
        player2Audio.play();
      }
      if (playerScore[1].score <playerScore[0].score){
        document.getElementById('announce').innerHTML ="Player 1 wins!";
        player2Audio.pause();
        player2Audio.currentTime = 0;
        player1Audio.pause();
        player1Audio.currentTime = 0;
        winnerAudio.play();
        player1Audio.play();
      }
    }
  }
}

function turnOnOffSound (){
  var soundButton = document.getElementById("sound").innerHTML;

  if(soundButton == 'Turn off Sound'){
    player2Audio.muted=true;
    player2Audio.currentTime = 0;
    player1Audio.muted=true;
    player1Audio.currentTime = 0;
    winnerAudio.muted=true;
    winnerAudio.currentTime = 0;
    wrongFlipAudio.muted=true;
    document.getElementById("sound").innerHTML = "Turn on Sound";
  }else {
    player2Audio.muted=false;
    player1Audio.muted=false;
    winnerAudio.muted=false;
    wrongFlipAudio.muted=false;
    document.getElementById("sound").innerHTML = "Turn off Sound";
  }

}
