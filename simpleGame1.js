// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 510;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Fire image
var fireReady = false;
var fireImage = new Image();
fireImage.onload = function () {
	fireReady = true;
};
fireImage.src = "images/fire.png";

// Fireball image
var fireBallReady = false;
var fireBallImage = new Image();
fireBallImage.onload = function () {
	fireBallReady = true;
};
fireBallImage.src = "images/Fireball.png";

// Energy image
var energyReady = false;
var energyImage = new Image();
energyImage.onload = function () {
	energyReady = true;
};
energyImage.src = "images/energy.png";

//You died image
var diedReady = false;
var diedImage = new Image();
diedImage.onload = function () {
    diedReady = true;
};
diedImage.src = "images/youDied.png";

// Game objects
var hero = {
  x: canvas.width / 2,
  y: canvas.height / 2,
	speed: 256 // movement in pixels per second
};
var monster = {
  speed: 200
};

var fire = {
  speed: 300,
  x: 0,
  y: 0
};

var fireBall = {
  speed: 250,
  x: 0,
  y: 0
}

var energies = [];


var level1 = 4;
var level2 = 9;
var level3 = 14

var monstersCaught = 0;
var highScore = 0;
var monsterMove = false;
var i = 0;
var h = 0;
var xEnergyDif = [];
var yEnergyDif = [];
var xEnergyScale = [];
var yEnergyScale = [];
var dead = false;
var poof = false;

// Handle keyboard controls
var keysDown = {};


canvas.addEventListener("mousedown", getPosition, false);

function getPosition(event) {
  var x = event.x;
  var y = event.y;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  
    energies[h] = {
    aimX: x,
    aimY: y,
    x: hero.x,
    y: hero.y,
    speed: 500,
    energyThrowCheck: true,
    energyThrow: true
  }
  h++
  
}


addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
  
  if (monstersCaught > highScore) {
    highScore = monstersCaught;
  }

	// Throw the monster somewhere on the screen randomly
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));
  
  
    
    if (monstersCaught > level2) {
      monsterMove = true;
      monsterMoveX = (2 * Math.random() - 1) * monster.speed;
      monsterMoveY = (2 * Math.random() - 1) * monster.speed;
    }
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown || 87 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown || 83 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown || 65 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown || 68 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
  }
  if (fire.x < canvas.width) {
    fire.x += fire.speed * modifier;
  }
  else {
    fire.x = 0;
    fire.y = 32 + (Math.random() * (canvas.height - 64));
  } 
  
  if (monsterMove) {
    monster.x += monsterMoveX * modifier;
    monster.y += monsterMoveY * modifier;
  }
    if (monster.x <= 0) {
      monsterMoveX = Math.random() * monster.speed;
      monsterMoveY = (2 * Math.random() - 1) * monster.speed;
    }
    if (monster.x + 32 >= canvas.width) {
      monsterMoveX = -1 * Math.random() * monster.speed;
      monsterMoveY = (2 * Math.random() - 1) * monster.speed;
    }
    if (monster.y <= 0) {
      monsterMoveX = (2 * Math.random() - 1) * monster.speed;
      monsterMoveY = Math.random() * monster.speed;
    }
    if (monster.y + 32 >= canvas.height) {
      monsterMoveX = (2 * Math.random() - 1) * monster.speed;
      monsterMoveY = -1 * Math.random() * monster.speed;
    }
  
  
  if (monstersCaught > level1) {
    if (fireBall.x > 0 && fireBall.x < canvas.width && fireBall.y > 0 && fireBall.y < canvas.height) {    
      fireBall.x += xScale * fireBall.speed * modifier;
      fireBall.y += yScale * fireBall.speed * modifier;
    }
    
    else {
      poof = false;
      
      fireBall.x = monster.x;
      fireBall.y = monster.y;
        
      xDif = monster.x - hero.x;
      yDif = monster.y - hero.y;

      xScale = Math.cos(Math.atan(yDif/xDif));
      yScale = Math.sin(Math.atan(yDif/xDif));
      
      if (xDif > 0) {
        xScale *= -1;
        yScale *= -1;
      }
      
    }
  }

  for (i = 0; i < energies.length; i++) {
    if (energies[i].energyThrowCheck) {
      xEnergyDif[i] = hero.x - energies[i].aimX;
      yEnergyDif[i] = hero.y - energies[i].aimY;

      xEnergyScale[i] = Math.cos(Math.atan(yEnergyDif[i]/xEnergyDif[i]));
      yEnergyScale[i] = Math.sin(Math.atan(yEnergyDif[i]/xEnergyDif[i]));
  
    if (xEnergyDif[i] > 0) {
      xEnergyScale[i] *= -1;
      yEnergyScale[i] *= -1;
    }
    energies[i].energyThrowCheck = false;
    }
  if (energies[i].energyThrow && energies[i].x < canvas.width && energies[i].x > -32 && energies[i].y < canvas.height && energies[i].y > -32) {
    energies[i].x += xEnergyScale[i] * energies[i].speed * modifier;
    energies[i].y += yEnergyScale[i] * energies[i].speed * modifier;
  }
  else {
    energies[i].energyThrow = false;
  }
  }
  
  
  
  

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
    dead = false;
		reset();
	}

if (
		hero.x <= (fire.x + 25)
		&& fire.x <= (hero.x + 25)
		&& hero.y <= (fire.y + 25)
		&& fire.y <= (hero.y + 25)
	) {
    monsterMove = false;
		monstersCaught = 0;
    dead = true;
    fire.x = 0;
    fire.y = 32 + (Math.random() * (canvas.height - 64));
		reset();
	}
  if (
		hero.x <= (fireBall.x + 25)
		&& fireBall.x <= (hero.x + 25)
		&& hero.y <= (fireBall.y + 25)
		&& fireBall.y <= (hero.y + 25)
    && monstersCaught > level1
    && !poof
	) {
    monsterMove = false;
		monstersCaught = 0;
    for (i = 0; i < energies.length; i++) {
      energies[i].energyThrow = false;
    }
    dead = true;
		reset();
	}
  
  for (i = 0; i < energies.length; i++) {
    if (
      energies[i].energyThrow
      && monster.x <= (energies[i].x + 32)
      && energies[i].x <= (monster.x + 32)
      && monster.y <= (energies[i].y + 32)
      && energies[i].y <= (monster.y + 32)
    ) {
      monstersCaught++
      dead = false;
      energies[i].energyThrow = false;
      reset();
    }
    
    if (
      energies[i].energyThrow
      && fireBall.x <= (energies[i].x + 32)
      && energies[i].x <= (fireBall.x + 32)
      && fireBall.y <= (energies[i].y + 32)
      && energies[i].y <= (fireBall.y + 32)
      && !poof
    ) {
      energies[i].energyThrow = false;
      poof = true;
    }
  }
  
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}
  
  if (fireReady) {
		ctx.drawImage(fireImage, fire.x, fire.y);
	}
  
  if (fireBallReady && monstersCaught > level1 && !poof) {
    ctx.drawImage(fireBallImage, fireBall.x, fireBall.y);
  }
  
  if (diedReady && dead) {
    ctx.drawImage(diedImage, 150, 120);
  }
  
  for (i = 0; i < energies.length; i++) {
    if (energies[i].energyThrow) {
      ctx.drawImage(energyImage, energies[i].x, energies[i].y);
    }
  }
  

	// Score
  ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillText("High Score: " + highScore, 32, 32);
  
  
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
  
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();