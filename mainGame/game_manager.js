/****************************************************/
// code to manage what game is shown in the p5 canvas
// written by Ezra 2023
/****************************************************/
var whatGame;
var pBInterval; //asigned an interval
var started = false;
var cnv;

//default p5.js functions

/*
default function called automatically by p5.js
creates a canvas and sets the parent to div "game_canvasDiv" and positions it over that same div.
*/
function setup() {
	let element = document.getElementById("game_canvasDiv")
	cnv = createCanvas(element.offsetWidth, element.offsetHeight); //sets width and height to same as div
	cnv.parent("game_canvasDiv");
	whatGame = sessionStorage.getItem("chosenGame");
}

/*
default function draw
called after setup
any code inside it will be automatically executed continuously
amount of "draws" per second controlled by frame rate (defaulted to 60). to be left alone.
*/
function draw() {
	if (whatGame == "PTB") {
		background(0);
		document.getElementById("gameTimer").innerHTML = `Time: ${PTB_time}.${PTB_ms}s`; //timer text
		document.getElementById("misses").innerHTML = "Misses: " + PTB_misses;
		for (var i = 0; i < ballarray.length; i++) {
			//ball functions
			ballarray[i].display();
			ballarray[i].move();
			ballarray[i].bounce();
		}
	} else if (whatGame == "TTT") {
		let element = document.getElementById("game_canvasDiv")
		background(0)
		textSize(50)
		text("UNDER DEVELOPMENT", 0, 0, 500, 500)
		fill('rbg(255, 255, 255)')
	}
}

/*
function for the start button
changes button function when clicked
*/
function game_gameStart() {
	if (started == false) {
		game_resetVars();
		if (buttonfunc == "start") {
			if (whatGame == "PTB") {
				document.getElementById("game_startButton").style.backgroundColor = "red";
				document.getElementById("game_startButton").innerHTML = "STOP"; //changes button to stop button
				buttonfunc = "stop";
				cnv.mousePressed(PTB_MouseFunc) //mouse pressed over canvas func
				PTB_balls() //creates balls called in popball.js
				pBInterval = setInterval(game_nextMs, 100); //starts timer
				document.getElementById("hitscore").innerHTML = "Average Hit Score: 0"
			}
		}
	} else {
		started = false
		if (buttonfunc == "stop") {
			if (whatGame == "PTB") {
				document.getElementById("game_startButton").style.backgroundColor = "rgb(24, 230, 72)";
				document.getElementById("game_startButton").innerHTML = "START"; //changes button to start button
				buttonfunc = "start";
				ballarray.splice(0, ballarray.length); //removes all balls in object
				started = false;
				clearInterval(pBInterval); //stop timer
			}
		}
	}
}

//next second - called by interval
function game_nextMs() {
	PTB_ms++;

	if (PTB_ms == 10) {
		PTB_time++;
		PTB_ms = 0;
	}
}

//game_resetVars
//called by game_gameStart
//resets vars on the side ui in game page
function game_resetVars() {
	started = true;
	PTB_ms = 0;
	PTB_time = 0;
	PTB_misses = 0;
	PTB_avgScore = 0;
}