/*****************************************************/
// html_manager.js
// written by Ezra 2023
/*****************************************************/

/*****************************************************/
//window.onload = function()
//called when the page loads fully
//will always initialise firebase
//HTML_checkPage() function returns the filename of the page currently in the window.
//code will execute if the pagename == to whatever page i want certain functions to run.
/*****************************************************/
window.onload = function () {

    fb_initialise();

    if (HTML_checkPage() != "regPage.html") {
        db_login();
    }

    if (HTML_checkPage() == "gtnPage.html") {
        fb_readRec(GAMEPATH, userDetails.uid, userGameData, fb_processGameData)
        HTML_checkDisconnected();
    }

    // REG PAGE ONLOAD
    if (HTML_checkPage() == "regPage.html") {
        reg_popUp();
    }

    if (HTML_checkPage().length == 0 || HTML_checkPage() == "index.html") {
        if (HTML_checkLogin() == true) {
            HTML_updateHTMLFromPerms();
        }
    }

    if (HTML_checkPage == "adminPage.html") {
        ad_user();
    }

    if (HTML_checkPage() == "leaderboardPage.html") {
        HTML_lbDisplay("gtn");
    }

	if (HTML_checkPage() == "adminPage.html") {
		if (parseInt(sessionStorage.getItem("permissions")) == 1) {
			window.location.replace("../index.html")
		}
	}

}

/*****************************************************/
//HTML_checkPage()
//called mainly in the window.location = function() function a few lines above this.
//function returns the filename of the page the user is currently in
/*****************************************************/
function HTML_checkPage() {
    var page = window.location.pathname.split("/").pop()
    return page;
}

/*****************************************************/
// HTML_updateHTMLFromPerms();
// called by firebase.js in fb_processAuthRole();
// shows or destroys the admin button and admin page section according to userAuthRole
// makes ad_admin null -> cannot call ad_admin in console to show admin page
/*****************************************************/
function HTML_updateHTMLFromPerms() {

    if (permissions.userAuthRole == null) {
        permissions.userAuthRole = parseInt(sessionStorage.getItem("permissions"))
    }

    if (permissions.userAuthRole >= 2) {
        document.getElementById("lP_Admin").style.display = "block";
    } else {
        document.getElementById("lP_Admin").remove();
        window.ad_admin = null; //sets function to null
    }
}

/*****************************************************/
// HTML_updateAdminPage(page);
// called by admin_manager.js in ad_user(), ad_home(), and ad_PTB()
// updates admin page tabs
/*****************************************************/
function HTML_updateAdminPage(page) {
    switch (page) {
        case "ad_user":
            document.getElementById("b_adUser").style.backgroundColor = "cyan";
            document.getElementById("b_adHome").style.backgroundColor = "grey";
            document.getElementById("b_adPTB").style.backgroundColor = "grey";
            break;

        case "ad_home":
            //document.getElementById('gamePage').style.display    = "none";
            //document.getElementById("landingPage").style.display   = "block";
            //document.getElementById('s_adminPage').style.display = "none";
            window.location.replace("../index.html")
            break;
        case "ad_Game":
            document.getElementById("b_adPTB").style.backgroundColor = "cyan";
            document.getElementById("b_adUser").style.backgroundColor = "grey";
            document.getElementById("b_adHome").style.backgroundColor = "grey";
            break;
    }
}

/*****************************************************/
// HTML_editGameInfo(game);
// called by game_manager.js in setup()
// updates user info on side of game page
/*****************************************************/
function HTML_editGameInfo(game) {
    document.getElementById("username").innerHTML = `Username: ${userGameData.gameName}`;
    document.getElementById("hellouser").innerHTML = `Hello ${userDetails.name}`

    //ptb details
    if (game == "PTB") {
        document.getElementById("highavgscore").style.display = "block"
        document.getElementById("misses").innerHTML = "Misses: 0";
        document.getElementById("hitscore").innerHTML = "Average Hit Score: 0";
        document.getElementById("highavgscore").innerHTML = `Highest AHS: ${userGameData.PTB_avgScore}`;
        document.getElementById("highscore").innerHTML = `Fastest Time: ${userGameData.PTB_timeRec}s`;
        document.getElementById("game_timeDiv").style.display = "block";

        //tic tac toe details	
    } else if (game == "TTT") {
        document.getElementById("highavgscore").style.display = "none"
        document.getElementById("hitscore").innerHTML = `Wins: ${userGameData.TTT_Wins}`;
        document.getElementById("highscore").innerHTML = `Losses: ${userGameData.TTT_Losses}`;
        document.getElementById("misses").innerHTML = "";
        document.getElementById("game_timeDiv").style.display = "none";
    }
}

/*****************************************************/
// HTML_loadPage();
// called in firease.js in fb_processUserDetails
// removes login button and shows landing page
/*****************************************************/
function HTML_loadPage() {
    if (HTML_checkPage().length == 0 || HTML_checkPage() == "index.html") {
        document.getElementById("landingPage").style.display = "block";
        document.getElementById("lP_loadingText").style.display = "none";
    }
}

function HTML_enterGame(chosenGame) {
	sessionStorage.setItem("chosenGame", chosenGame);
	if (chosenGame == "GTN") {
		window.location.replace('pages/gtnPage.html');
	} else {
		window.location.replace('pages/gamePage.html');
	}
}

/*****************************************************/
// HTML_returnLobby();
//called when the gtn game ends
//makes the game section gone and shows the build lobby table
//makes p1 and p2 stats back to waiting for player
/*****************************************************/
function HTML_returnLobby() {
    document.getElementById("gtn_game").style.display = "none";
    document.getElementById("s_table").style.display = "block";
    document.getElementById("p1_stats").innerHTML = "WAITING FOR PLAYER 1";
    document.getElementById("p2_stats").innerHTML = "WAITING FOR PLAYER 2";
}

/*****************************************************/
//HTML_loadMultiGame(_p2data)
//called when player two joins the lobby or when client joins a lobby
//p2data is just the opponents data
//creates lists with the clients gtn stats and the opponents gtn stats and shows them
//shows info like what player you are and who's turn it is
//generates a random number from 0 to 100
/*****************************************************/
function HTML_loadMultiGame(_p2data) {
    document.getElementById("s_table").style.display = "none";
    document.getElementById("gtn_game").style.display = "block";
    var player = clientCreateLobby[0]

    var stats = `
    <li>Username: ${player.gameName}</li>
    <li>Wins: ${player.GTN_Wins}</li>
    <li>Draws: ${player.GTN_Draws}</li>
    <li>Losses: ${player.GTN_Losses}
    `

    var opponentStats = `
    <li>Username: ${_p2data.gameName}</li>
    <li>Wins: ${_p2data.GTN_Wins}</li>
    <li>Draws: ${_p2data.GTN_Draws}</li>
    <li>Losses: ${_p2data.GTN_Losses}</li>
    `

    document.getElementById(`p${player.player}_stats`).innerHTML = stats;
    document.getElementById(`p${_p2data.player}_stats`).innerHTML = opponentStats;
    document.getElementById("gtn_player").innerHTML = `you are player ${player.player}`;
    document.getElementById("gp_opponentGuess").innerHTML = "WAITING FOR GUESS";

    let onlineGame = JSON.parse(sessionStorage.getItem("currentGameData"));
    if (onlineGame.turn == `p${player.player}`) {
        document.getElementById("gp_gtnInfo").innerHTML = "turn: your turn";
        fb_onDisconnectOff(LOBBY, player.UID, "p1dc");
		time = 0
		gtnInterval = setInterval(gtn_nextSecond, 1000);
    } else {
        document.getElementById("gp_gtnInfo").innerHTML = "turn: opponent's turn";
    }
    randomNum = Math.floor(Math.random() * 101);
    fb_onDisconnect(onlineLobby, "onlineGame", `p${player.player}`);
}

/*****************************************************/
//HTML_checkDisconnected()
//called when the gtnpage is loaded
//if onlineGame exists in sessionstorage then player WAS in a game
//adds a loss to the player and removes p2, lobby, and ingame data from session storage
//makes onlineGame null and alerts the user of their punishment
//if the user created a lobby, no one joined, and the user disconnected then
//user will be alerted about their disconnection, lobby removed, and sessionstorage data removed for the lobby
/*****************************************************/
function HTML_checkDisconnected() {
    let onlineGame = JSON.parse(sessionStorage.getItem("currentGameData"));
    let inGame = (sessionStorage.getItem("inGame") === 'true')

    if (onlineGame && inGame == true) {
        console.log("reconnected")
        let loss = userGameData.GTN_Losses += 1
        fb_updateRec(GAMEPATH, userDetails.uid, {GTN_Losses: loss})

        sessionStorage.removeItem("inGame")
        sessionStorage.removeItem("playerTwoData")
        sessionStorage.removeItem("currentGameData")
        onlineGame = null;
        alert("you disconnected from last game, you lost the game as a punishment")
		fb_writeRec(LOBBY, `LOBBY: ${userDetails.uid}`, null)
    } else if (onlineGame && inGame == false){
        alert("you disconnected, your lobby has been removed. please make another one.")
        sessionStorage.removeItem("inGame")
        sessionStorage.removeItem("playerTwoData")
        sessionStorage.removeItem("currentGameData")
    }
}

 // if (onlineGame.turn != "end") {
        //     console.log("reconnected")
        //     playerTwoDetails = JSON.parse(sessionStorage.getItem("playerTwoData"));
        //     clientCreateLobby[0] = JSON.parse(sessionStorage.getItem("clientData"));
        //     onlineLobby = sessionStorage.getItem("onlineLobby");

        //     if (clientCreateLobby[0].player == 1) {
        //         fb_updateRec(onlineLobby, "onlineGame", { p1_Status: "online" })
        //     } else {
        //         fb_updateRec(onlineLobby, "onlineGame", { p2_Status: "online" })
        //     }
        //     HTML_loadMultiGame();
        // }

/*****************************************************/
//HTML_checkLogin()
//checks if the user has logged in
//session storage will have data if the user has logged in
//returns either true or false if session storage has data that exists for user
/*****************************************************/
function HTML_checkLogin() {
    if (sessionStorage.getItem("userDetails") && sessionStorage.getItem("userGameData")) {
        return true
    } else {
        return false
    }
}

/*****************************************************/
//HTML_logout()
//called when user clicks logout button in index.html
//logs the user out, automatically logs the user in and clears sessionstorage
/*****************************************************/
function HTML_logout() {
    fb_logout();
    fb_login(userDetails, permissions);
    sessionStorage.clear();
}

/*****************************************************/
//HTML_lbdisplay(game)
//makes leaderboard variable an empty array
//reads all game data and sorts the data depending on what parameter 'game' equals to
//sorts the data by either highest to lowest or lowest to highest depdending on what 'game' is
/*****************************************************/
function HTML_lbDisplay(game) {
    leaderboard = []
    switch(game) {
        case "gtn":
            fb_readAll(GAMEPATH, leaderboard, fb_processGameAll, "gtn");
            break;
        
        case "ptb":
            fb_readAll(GAMEPATH, leaderboard, fb_processGameAll, "ptb");
            break;

        case "ptb_ahs":
            fb_readAll(GAMEPATH, leaderboard, fb_processGameAll, "ptb_ahs");
            break;
        
        case "ttt":
            fb_readAll(GAMEPATH, leaderboard, fb_processGameAll, "ttt");
            break;
    }
}

function HTML_sortLeaderboard(_leaderboard, _sort) {
    console.log("html sort leaderboard", _leaderboard, _sort)
    document.getElementById("lb_leaderboard").innerHTML = null;

    switch (_sort) {
        case "gtn":
            _leaderboard.sort((a, b) => parseInt(b.GTN_Wins) - parseInt(a.GTN_Wins));
			document.getElementById("lb_title").innerHTML = "guess the number wins leaderboard"
            break;
        
        case "ptb":
            _leaderboard.sort((a, b) => parseFloat(a.PTB_timeRec) - parseFloat(b.PTB_timeRec));
			document.getElementById("lb_title").innerHTML = "pop the bal fastest time leaderboard"
            break;
        
        case "ttt":
            _leaderboard.sort((a, b) => parseInt(b.TTT_Wins) - parseInt(a.TTT_Wins));
			document.getElementById("lb_title").innerHTML = "tic tac toe wins leaderboard"
            break;

        case "ptb_ahs":
            _leaderboard.sort((a, b) => parseInt(b.PTB_avgScore) - parseInt(a.PTB_avgScore));
			document.getElementById("lb_title").innerHTML = "pop the ball highest average hit score leaderboard"
            break;
    }
    
	let placement = 1;
    for (let i = 0; i < _leaderboard.length; i++) {
        let row = `<tr>
        <td>${placement}</td>
        <td>${_leaderboard[i].gameName}</td>`

        if (_sort == "gtn") {
            row += `<td class="w3-center">${_leaderboard[i].GTN_Wins}</td>
            </tr>`
			document.getElementById("lb_leaderboard").innerHTML += row
			placement += 1
        } else if (_sort == "ptb") {
            if (leaderboard[i].PTB_timeRec != 0) {
                row += `<td class="w3-center">${_leaderboard[i].PTB_timeRec}s</td>
                </tr>`
				document.getElementById("lb_leaderboard").innerHTML += row
				placement += 1
            }
        } else if (_sort == "ttt") {
            row += `<td class="w3-center">${_leaderboard[i].TTT_Wins}</td>
            </tr>` 
			document.getElementById("lb_leaderboard").innerHTML += row
			placement += 1
        } else if (_sort == "ptb_ahs") {
            row += `<td class="w3-center">${_leaderboard[i].PTB_avgScore}</td>
            </tr>` 
			document.getElementById("lb_leaderboard").innerHTML += row
			placement += 1
        }

		if (placement > 10) {
			break;
		}
    }
}