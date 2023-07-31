/*****************************************************
  Written by Ezra Chai Term 2 2021
  Program for popBall game.
****************************************************/
var PTB_time = 0;
var PTB_ms = 0;
var PTB_AHS = 0;
var buttonfunc = "start";

//ball variables
const DIA = 50;
const BALLCOUNT = 10;
const BALLSPEED = [5, 4, 3, 2, -2, -3, -4, -5]; //8 different velocities
var ballarray = [];

//other variables - called in game_manager.js
var PTB_misses = 0;
var ballhit;

/*****************************************************/
// balls();
// called in game_manager in game_gameStart();
// creates 10 objects (balls) with functions
// adds balls into ballarray
/*****************************************************/
function PTB_balls() {
	for (var i = 0; i < BALLCOUNT; i++) { 
		ballarray[i] = {
			//positioning and speed set to random values
			x: random(230, 270),
			y: random(230, 270),
			xspeed: random(BALLSPEED),
			yspeed: random(BALLSPEED),
			
			//creates the balls
			display: function() {
				stroke(255);
				noFill();
				ellipse(this.x, this.y, DIA);
			},

			//bounce function - reverses velocity if ball hits the edge
			bounce: function() { 
				if (this.x + DIA/2 > width) { 
					this.xspeed = -this.xspeed	//reverses speed
					this.x = width-DIA/2; //position ball inside canvas
				} else if (this.x - DIA/2 < 0) {
					this.xspeed = -this.xspeed;
					this.x = 0+DIA/2;
				}
				
				if (this.y + DIA/2 > height) {//y axis
					this.yspeed = -this.yspeed; //refer to x axis
					this.y = height-DIA/2;
				} else if (this.y - DIA/2 < 0) {
					this.yspeed = -this.yspeed;
					this.y = 0+DIA/2;
				}
			},

			//moves the balls
			move: function() {
				this.x = this.x + this.xspeed;
				this.y = this.y + this.yspeed;
			},

			//dist mouse to ball, returns true/false
			distance: function() {
				let px2ball = dist(this.x, this.y, mouseX, mouseY); //dist mouse 2 ball
				if (px2ball <= DIA/2) {
					return true
				} else {
					return false
				}
			}
		}
	}
}

/*****************************************************/
// PTB_MouseFunc
// called in game_manager.js in setup()
// function runs the code when the canvas is clicked
/*****************************************************/
function PTB_MouseFunc() {
	if (buttonfunc == "stop") {
		ballhit = false;

		for (var i = 0; i < ballarray.length; i++) { //iteration through balls
			let hit = ballarray[i].distance(); // built-in function

			if (hit == true) {
				ballhit = true;
				ballarray.splice(i, 1); //deletes object in array

				if (ballarray.length == 0) {
					let PTB_fullTime = parseFloat(`${PTB_time}.${PTB_ms}`); //makes seconds and ms into a float
					PTB_AHS = PTB_calcScore(PTB_fullTime, PTB_misses);
					document.getElementById("hitscore").innerHTML = "Average Hit Score: " + PTB_AHS;

					//checking avghitscore and replacing if higher than int in data
					if (PTB_AHS > userGameData.PTB_avgScore) {
						userGameData.PTB_avgScore = PTB_AHS;
						document.getElementById("highavgscore").innerHTML = `Highest AHS: ${PTB_AHS}`;
						fb_writeRec(GAMEPATH, userDetails.uid, userGameData);
					}

					
					if (PTB_fullTime < userGameData.PTB_timeRec || userGameData.PTB_timeRec == 0) {
						userGameData.PTB_timeRec = PTB_fullTime;
						document.getElementById("highscore").innerHTML = `Fastest Time: ${userGameData.PTB_timeRec}s`
						fb_writeRec(GAMEPATH, userDetails.uid, userGameData);
					}

					clearInterval(pBInterval); //stops timer
					document.getElementById("game_startButton").style.backgroundColor = "rgb(24, 230, 72)";
					document.getElementById("game_startButton").innerHTML = "START"; //changes button to start button
					buttonfunc = "start";
					misses = 0;
				}
			}
		}

		if (ballhit == false) {
			PTB_misses += 1;
			document.getElementById("misses").innerHTML = "Misses: " + misses;
		} else {
			ballhit = false;
		}
	}
}

function PTB_calcScore(time, misses) {
	if (misses == 0) {
		misses = 1;
	}
	
	let avgHitScore = Math.round(((10/time)/misses) * 1000);

	return avgHitScore;
}
/*****************************************************/
//   END OF CODE
/*****************************************************/