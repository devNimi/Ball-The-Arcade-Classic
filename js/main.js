// Hey! there, my AI name is Gedion :)
var canvas;
var ctx;
var framesPerSecond = 40;
// player details
var playerName = '';
// AI name
var aiName = '';
// ball's initial X-coordinates
var ballXposition = 50;
var ballYposition = 50;
// ball speed i.e. coordinates to jump framesPerSecond
var ballSpeedInX = 12;
var ballSpeedInY = 5;
// paddles Y-coordinates
var playerPaddleYposition = 250;
var aiPaddleYposition = 250;
// players score
var playerScore = 0;
var aiScore = 0;
// Game-End Screen, displaying scores and other details
var showingWinScreen = false;

// constants
const WINNING_SCORE = 3;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

// Return mouse poisition relative to Canvas
function calculateMousePosition(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

// For now it listen for a click event to restart the game when it ends, along with reseting the scores to zero
function handleMouseClick(evt) {
  if (showingWinScreen) {
    playerScore = 0;
    aiScore = 0;
    showingWinScreen = false;
  }
}

// Resets the ball, when either player misses and check for winning condition
function ballReset() {
  if (playerScore >= WINNING_SCORE || aiScore >= WINNING_SCORE) {
    // ends the game
    showingWinScreen = true;
  }
  // handles the case when either player misses. It resests the ball position to center and in opposite direction.
  ballSpeedInX = -ballSpeedInX;
  ballXposition = canvas.width / 2;
  ballYposition = canvas.height / 2;
}

// handles AI movement
// few numbers below are hardcoded for now, we'll handle them when we'll create levels in game
function aiMovement() {
  var aiPaddleYcenter = aiPaddleYposition + (PADDLE_HEIGHT / 2);
  if (aiPaddleYcenter < ballYposition - 35) {
    aiPaddleYposition = aiPaddleYposition + 6;
  } else if (aiPaddleYcenter > ballYposition + 35) {
    aiPaddleYposition = aiPaddleYposition - 6;
  }
}

// draw circle
function colorCircle(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}

// draw rectangle
function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}

// draws the net to middle of Canvas
function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
  }
}

// this is responsible for drawing everything on Canvas
function drawEverything() {
  // draws game's background
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  ctx.font = '36px serif';

  if (showingWinScreen) {
    // Draws win screen
    ctx.fillStyle = 'white';

    if (playerScore >= WINNING_SCORE) {
      ctx.fillText('You Won! ' + playerName, 350, 200);
    } else if (aiScore >= WINNING_SCORE) {
      ctx.fillText(aiName + ' Won!, She is smart isnt she!', 150, 200);
    }

    ctx.fillText('Play Again!', 350, 500);
    return;
  }

  drawNet();

  // this is left player paddle
  colorRect(0, playerPaddleYposition, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  // this is gedion's paddle
  colorRect(canvas.width - PADDLE_WIDTH, aiPaddleYposition, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  // next line draws the ball
  colorCircle(ballXposition, ballYposition, 10, 'white');

  ctx.fillText(playerName + ' ' + playerScore, 200, 100);
  ctx.fillText(aiScore + ' ' + aiName, canvas.width - 300, 100);
}

// moves things around Canvas
function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  aiMovement();

  ballXposition = ballXposition + ballSpeedInX;
  ballYposition = ballYposition + ballSpeedInY;

  // player side
  // when ball hits the player side end of Canvas
  if (ballXposition < 0) {
    // case when ball hits the paddle
    if (ballYposition > playerPaddleYposition &&
      ballYposition < playerPaddleYposition + PADDLE_HEIGHT) {
      ballSpeedInX = -ballSpeedInX;

      var deltaYplayer = ballYposition - (playerPaddleYposition + PADDLE_HEIGHT / 2);
      ballSpeedInY = deltaYplayer * 0.35;
    } else { // case when ball miss the paddle
      aiScore++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  // AI side
  // when ball hits the AI side end of Canvas
  if (ballXposition > canvas.width) {
    // case when ball hits the paddle
    if (ballYposition > aiPaddleYposition &&
      ballYposition < aiPaddleYposition + PADDLE_HEIGHT) {
      ballSpeedInX = -ballSpeedInX;

      var deltaYgedion = ballYposition - (aiPaddleYposition + PADDLE_HEIGHT / 2);
      ballSpeedInY = deltaYgedion * 0.35;
    } else { // case when ball miss the paddle
      playerScore++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  // when ball hits upper end of Canvas
  if (ballYposition < 0) {
    ballSpeedInY = -ballSpeedInY;
  }
  // when ball hits lower end of Canvas
  if (ballYposition > canvas.height) {
    ballSpeedInY = -ballSpeedInY;
  }
}

window.onload = function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  function animate() {
    setTimeout(function() {
      // animation stuff
      moveEverything();
      drawEverything();

      requestAnimationFrame(animate);
    }, 1000 / framesPerSecond);
  }
  animate();
  canvas.addEventListener('mousedown', handleMouseClick);
  canvas.addEventListener('mousemove',
    function(evt) {
      var mousePos = calculateMousePosition(evt);
      playerPaddleYposition = mousePos.y - (PADDLE_HEIGHT / 2);
    });
};

// Personalized plyer name, AI name... stuff
var playerNameChangeButton = document.getElementById('playerNameChangeButton');
var aiNameChangeButton = document.getElementById('aiNameChangeButton');

// for player one
function setplayerName() {
  var myName = prompt('What should we call you? ' + playerName + '!');
  localStorage.setItem('playerName', myName);
  playerName = localStorage.getItem('playerName');
}

if(!localStorage.getItem('playerName')) {
  setplayerName();
} else {
  playerName = localStorage.getItem('playerName');
  // myHeading.innerHTML = 'Mozilla is cool, ' + storedName;
}

playerNameChangeButton.onclick = function() {
  setplayerName();
}

// for AI
function setAIname() {
  var newAIname = prompt('We get it! You don\'t wanna fight ' + aiName + '!\nWhat you want to call your AI?');
  localStorage.setItem('newAIname', newAIname);
  aiName = localStorage.getItem('newAIname');
}
if(!localStorage.getItem('newAIname')) {
  // saving AI name 'Gedion' bydefault
  aiName = 'gedion';
} else {
  aiName = localStorage.getItem('newAIname');
}
aiNameChangeButton.onclick = function() {
  setAIname();
}
