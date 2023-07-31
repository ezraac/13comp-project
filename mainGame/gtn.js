/*****************************************************/
// gtn.js
// written by Ezra Term 2 2023
/*****************************************************/
var checkWrite = false
var time = 0;
/*****************************************************/
//gtn_guessNum()
//called when user submits their gtn guess
//checks if the guess is outside the 0-100 boundary
//checks if the turn is the players turn
//checks if the guess is equal to the random number
//if the number is equal then alert user and call gtn_resetLobby
//sets checkwrite to tre and turns off readon for the lobby
//otherwise will update the turn and their guess to firebase
/*****************************************************/
function gtn_guessNum() {
	var playerguess = parseInt(document.getElementById("gtn_guess").value);

	if (playerguess > 100 || playerguess < 0) {
		alert("please enter a number between 0 and 100")
	} else {
		if (gameStats.turn == `p${clientCreateLobby[0].player}`) {
			clearInterval(gtnInterval)
			if (playerguess != randomNum) {
				document.getElementById("gp_gtnInfo").innerHTML = "turn: opponent";
				if (clientCreateLobby[0].player == 1) {
					fb_updateRec(onlineLobby, "onlineGame", { playerOneGuess: playerguess, turn: "p2" });
				} else if (clientCreateLobby[0].player == 2) {
					fb_updateRec(onlineLobby, "onlineGame", { playerTwoGuess: playerguess, turn: "p1" });
				}
			} else {
				checkWrite = true;
				fb_readOff(LOBBY, `LOBBY: ${gameStats.p1_uid}`);
				gameStats.turn = "end";
				if (clientCreateLobby[0].player == 1) {
					fb_updateRec(onlineLobby, "onlineGame", { playerOneGuess: playerguess, turn: "end", winner: "p1" });
					alert("you guessed the correct number!");
				} else if (clientCreateLobby[0].player == 2) {
					fb_updateRec(onlineLobby, "onlineGame", { playerTwoGuess: playerguess, turn: "end", winner: "p2" });
					alert("you guessed the correct number!");
				}

				gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, gameStats);
			}
		}
	}
}

/*****************************************************/
//gtn_checkOppGuess(_onlineGame)
//called from readOn from db_lobbyOnReadSort
//readon will check if the lobby gets updated data and calls this function
//checks if the turn is the users turn
//updates the html to show the opponents guess
//if the turn is equal to end and neither player has disconnected
//turns off readon for lobby and calls gtn_resetLobby
/*****************************************************/
function gtn_checkOppGuess(_onlineGame) {
	if (_onlineGame.turn == "p1" && clientCreateLobby[0].player == 1) {
		if (_onlineGame.playerTwoGuess) {
			document.getElementById("gp_opponentGuess").innerHTML = `opponent guessed: ${_onlineGame.playerTwoGuess}`;
			document.getElementById("gp_gtnInfo").innerHTML = "turn: you";
			time = 0
			gtnInterval = setInterval(gtn_nextSecond, 1000)
		}
	} else if (_onlineGame.turn == "p2" && clientCreateLobby[0].player == 2) {
		if (_onlineGame.playerOneGuess) {
			document.getElementById("gp_opponentGuess").innerHTML = `opponent gussed: ${_onlineGame.playerOneGuess}`;
			document.getElementById("gp_gtnInfo").innerHTML = "turn: you";
			time = 0
			gtnInterval = setInterval(gtn_nextSecond, 1000)
		}
	}

	if (_onlineGame.turn == "end" && _onlineGame.p1_Status != "offline" && _onlineGame.p2_Status != "offline") {
		if (checkWrite == false) {
			if (_onlineGame.method) {
				fb_readOff(LOBBY, `LOBBY: ${_onlineGame.p1_uid}`)
				gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, _onlineGame)
				alert("opponent ran out of time")
			} else {
				fb_readOff(LOBBY, `LOBBY: ${_onlineGame.p1_uid}`)
				gtn_resetLobby(playerTwoDetails, clientCreateLobby[0], _onlineGame)
			}
		}
	}
}

/*****************************************************/
//gtn_resetLobby(_winner, _loser, _onlineGame)
//called when: user guesses correctly, or opponent guesses correctly
//turns off ondisconnect for the lobby
//if the winner is the user, updates wins for user 
//if loser is the user, updates losses for user
//removes the lobby data in sessionstorage
//sets lobby variables to null or false
//calls HTML_returnLobby to return to the lobby
/*****************************************************/
function gtn_resetLobby(_winner, _loser, _onlineGame) {
	console.log(_winner, _onlineGame)
	fb_onDisconnectOff(onlineLobby, "onlineGame", `p${clientCreateLobby[0].player}`);

	if (_winner.UID == clientCreateLobby[0].UID) {
		if (_onlineGame.turn == "end") {
			if (clientCreateLobby[0].player == 1) {
				fb_writeRec(LOBBY, `LOBBY: ${clientCreateLobby[0].UID}`, null);
			} else {
				fb_writeRec(LOBBY, `LOBBY: ${playerTwoDetails.UID}`, null);
			}
			
			let wins = _winner.GTN_Wins += 1
			console.log(wins)
			fb_updateRec(GAMEPATH, _winner.UID, { GTN_Wins: wins })
		}
	}

	if (_loser.UID == clientCreateLobby[0].UID) {
		if (_onlineGame.turn == "end") {
			let loss = _loser.GTN_Losses += 1
			fb_updateRec(GAMEPATH, _loser.UID, { GTN_Losses: loss })
			userGameData.GTN_Losses += 1;
			clientCreateLobby[0].GTN_Losses = userGameData.GTN_Losses;
			if (_onlineGame.method) {
				alert("you ran out of time")
			} else {
				alert("opponent guessed their random number");
			}
		}
	}

	if (document.getElementById(`${_onlineGame.p1_uid}`)) {
		document.getElementById(`${_onlineGame.p1_uid}`).remove();
	}
	sessionStorage.setItem("clientData", JSON.stringify(clientCreateLobby[0]));

	sessionStorage.removeItem("playerTwoData");
	sessionStorage.removeItem("currentGameData");
	sessionStorage.removeItem("inGame");
	sessionStorage.removeItem("onlineGame");

	gameStats = null;
	playerTwoDetails = null;
	console.log("removed");
	checkWrite = false;
	inGame = false;
	HTML_returnLobby();
}

/*****************************************************/
//gtn_checkDisconnect(_onlineGame)
//called in db_lobbyOnReadSort from readOn
//checks if user is in game
//checks if p1 or p2 disconnected
//resets lobby from db and removes session storage variables for lobby
//returns back to lobby
/*****************************************************/
function gtn_checkDisconnect(_onlineGame) {
	console.log("check disconnect: ")
	console.log(_onlineGame)
	if (inGame == true) {
		console.log("true")
		if (_onlineGame.p1_Status == "offline" || _onlineGame.p2_Status == "offline") {
			_onlineGame.turn = "end";
			_onlineGame.winner = "p2";
			gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, _onlineGame)

			sessionStorage.removeItem("playerTwoData");
			sessionStorage.removeItem("currentGameData");
			sessionStorage.removeItem("inGame");
			sessionStorage.removeItem("onlineGame");
			alert("opponent disconnected")
			clearInterval(gtnInterval)
			HTML_returnLobby();
		}
	}
}

/*****************************************************/
//gtn_nextsecond()
//called when gtn game starts
//simple timer
//if the time is 20 seconds, it will reset lobby as player has lost by time.
/*****************************************************/
function gtn_nextSecond() {
	time ++
	document.getElementById("gp_timer").innerHTML = `timer: ${time}`

	if (time == 20) {
		clearInterval(gtnInterval)
		gameStats.winner = `p${playerTwoDetails.player}`
		gameStats.turn = "end";
		gameStats.method = "time";
		fb_readOff(LOBBY, `LOBBY: ${gameStats.p1_uid}`)
		fb_updateRec(onlineLobby, "onlineGame", gameStats)
		gtn_resetLobby(playerTwoDetails, clientCreateLobby[0], gameStats)
	}
}