/*****************************************************/
// database.js
// holds all database variables

// database variables
const DBPATH = "userInformation";
const GAMEPATH = "userGameData";
const AUTHPATH = "authorizedUsers";
const LOBBY = "activeLobbies";

var loginStatus = ' ';
var readStatus = ' ';
var writeStatus = ' ';

var userDetails = {
	uid: '',
	email: '',
	name: '',
	photoURL: '',
	age: '',
	sex: '',
};

var permissions = {
	userAuthRole: null,
}

var userGameData = {
	PTB_avgScore: 0,
	PTB_timeRec: 0,
	gameName: '',
	TTT_Wins: 0,
	TTT_Losses: 0,
	GTN_Wins: 0,
	GTN_Losses: 0,
	GTN_Draws: 0,
}

var leaderboard = [];

var gameStats = []
var clientCreateLobby = []
var lobbyArray = [];
var playerTwoDetails = []

var inGame = false;
var onlineLobby;
var randomNum;
var gtnInterval;
/*****************************************************/

/*****************************************************/
//db_fbSync()
//called when user clicks sync firebase details button in index.html
//'logs' the user in and the details get updated to what is in firebase
/*****************************************************/
function db_fbSync() {
	fb_login(userDetails, permissions);
}

/*****************************************************/
//db_login()
//called in window.location in html_manager.js
//checks if the user has their details in session storage
//if no data, logs the user in
//else sets the userdetails, usergamedata, and client lobby data to the data in session storage
/*****************************************************/
function db_login() {
	if (HTML_checkLogin() == false) {
		fb_login(userDetails, permissions);
	} else {
		userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
		userGameData = JSON.parse(sessionStorage.getItem("userGameData"));
		clientCreateLobby[0] = JSON.parse(sessionStorage.getItem("clientData"));

		if (HTML_checkPage().length == 0 || HTML_checkPage() == "index.html") {
			HTML_loadPage()
		}
	}
}

/*****************************************************/
//db_lobbyOnReadSort(_dbData)
//called from readOn in fb_io.js
//when data is changed inside the clients lobby ONLY, will loop through _dbData and do the following
//playerTwo uid is the only key that will not equal to user uid or onlineGame
//saves playerTwoData and client lobby data
//saves onlinegame and checks if opponent disconnected and checks opponents guess
//when the for loop saves playertwodata and onlinegame, it will call db_checkStart to start the game
/*****************************************************/
function db_lobbyOnReadSort(_dbData) {
	console.log(_dbData)
	var playerData = _dbData
	let p2data, onlinegame
	for (let key in playerData) {
		if (key != userDetails.uid && key != "onlineGame") {
			p2data = playerData[key];
			console.log(p2data)
			sessionStorage.setItem("playerTwoData", JSON.stringify(p2data))
			playerTwoDetails = JSON.parse(sessionStorage.getItem("playerTwoData"))
		} else if (key == userDetails.uid) {
			clientCreateLobby[0] = playerData[key]
			console.log(clientCreateLobby[0])
			sessionStorage.setItem("clientData", JSON.stringify(clientCreateLobby[0]))
		} else if (key == "onlineGame") {
			onlinegame = playerData[key]
			console.log(onlinegame);
			sessionStorage.setItem("currentGameData", JSON.stringify(onlinegame));
			gameStats = JSON.parse(sessionStorage.getItem("currentGameData"));
			gtn_checkDisconnect(onlinegame);
			gtn_checkOppGuess(onlinegame);
		}
	}

	if (p2data != null && onlinegame != null && inGame == false) {
		db_checkStart(p2data, onlinegame);
	}
}

/*****************************************************/
//db_checkStart(_p2data, _onlineGame)
//checks if there are two players in the lobby path, if they are not in game, and if the game hasn't ended
//if all are true then will update lobby and set inGame to true and load the page
/*****************************************************/
function db_checkStart(_p2data, _onlineGame) {
	console.log("db_checkStart", _p2data, _onlineGame)
	if (_onlineGame.p1_Status == "online" && _onlineGame.p2_Status == "online" && inGame == false && _onlineGame.turn != "end") {
		console.log("yes", _p2data)
		inGame = true;
		sessionStorage.setItem("inGame", inGame)
		onlineLobby = sessionStorage.getItem("onlineLobby");
		fb_updateRec(onlineLobby, "onlineGame", { turn: "p1" });
		HTML_loadMultiGame(_p2data);
	}
}
/*****************************************************/
//    END OF PROG
/*****************************************************/