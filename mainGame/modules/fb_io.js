/*****************************************************/
// fb_io.js
// Written by Mr Bob 2020
// Edited and tailored by Ezra 2022
/*****************************************************/

/*****************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/*****************************************************/
function fb_initialise() {
	console.log('fb_initialise: ');

	var firebaseConfig = {
		apiKey: "AIzaSyACgBfQCpj4tm5GTj7B9bDG_mkYyWYvVM8",
		authDomain: "comp-2023-ezrachai.firebaseapp.com",
		databaseURL: "https://comp-2023-ezrachai-default-rtdb.firebaseio.com",
		projectId: "comp-2023-ezrachai",
		storageBucket: "comp-2023-ezrachai.appspot.com",
		messagingSenderId: "334631994952",
		appId: "1:334631994952:web:34df1f77408a2b16e1fa7d",
		measurementId: "G-KGPN9CV9LG"
	};

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	console.log(firebase);
}

/*****************************************************/
// fb_login(_dataRec, permissions)
// Called by setup
// Login to Firebase
// Input:  where to save the google data
// Return: n/a
/*****************************************************/
function fb_login(_dataRec, permissions) {
	console.log('fb_login: ');
	firebase.auth().onAuthStateChanged(newLogin);

	function newLogin(user) {
		if (user) {
			// user is signed in, so save Google login details
			_dataRec.uid = user.uid;
			_dataRec.email = user.email;
			_dataRec.name = user.displayName;
			_dataRec.photoURL = user.photoURL;


			fb_readRec(DBPATH, _dataRec.uid, userDetails, fb_processUserDetails); //reads user details
			fb_readRec(AUTHPATH, _dataRec.uid, permissions, fb_processAuthRole); //reads user auth role
			console.log(permissions)
			loginStatus = 'logged in';
			console.log('fb_login: status = ' + loginStatus);
		}
		else {
			// user NOT logged in, so redirect to Google login
			loginStatus = 'logged out';
			console.log('fb_login: status = ' + loginStatus);

			var provider = new firebase.auth.GoogleAuthProvider();
			//firebase.auth().signInWithRedirect(provider); // Another method
			firebase.auth().signInWithPopup(provider).then(function(result) {
				_dataRec.uid = result.user.uid;
				_dataRec.email = result.user.email;
				_dataRec.name = result.user.displayName;
				_dataRec.photoURL = result.user.photoURL;
				loginStatus = 'logged in via popup';
				console.log('fb_login: status = ' + loginStatus);
				fb_writeRec(AUTHPATH, _dataRec.uid, 1);
			})
				// Catch errors
				.catch(function(error) {
					if (error) {
						var errorCode = error.code;
						var errorMessage = error.message;
						loginStatus = 'error: ' + error.code;
						console.log('fb_login: error code = ' + errorCode + '    ' + errorMessage);

						alert(error);
					}
				});
		}
	}
}

/*****************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/*****************************************************/
function fb_writeRec(_path, _key, _data, _location) {
	console.log(`fb_WriteRec: path= ${_path} key= ${_key}`);
	writeStatus = "waiting"


	firebase.database().ref(_path + "/" + _key).set(_data, function(error) {
		if (error) {
			writeStatus = "failure"
			console.log(error)
		}
		else {
			writeStatus = "ok"
			console.log(writeStatus)
			if (_location == "reg") {
				window.location.replace("../index.html")
			}
		}
	});
	console.log("fb_writerec exit")
}

/*****************************************************/
// fb_readAll(_path, _data)
// Read all DB records for the path
// Input:  path to read from and where to save it
// Return:
/*****************************************************/
function fb_readAll(_path, _data, _processAll, _sort) {
	console.log('fb_readAll: path= ' + _path);

	readStatus = "waiting"
	firebase.database().ref(_path).once("value", gotRecord, readErr)

	function gotRecord(snapshot) {
		if (snapshot.val == null) {
			readStatus = "no record"
		}
		else {
			readStatus = "ok"
			var dbData = snapshot.val()
			console.log(dbData)

			if (dbData == null) {
				alert("no data found")
			} else {
				var dbKeys = Object.keys(dbData)

				//_processall in parameter
				_processAll(snapshot, dbData, readStatus, _data, dbKeys, _sort)
			}
		}
	}

	function readErr(error) {
		readData = "fail"
		console.log(readData, error)
		_processAll(_data, readStatus, dbData, dbKeys)
	}
}

/*****************************************************/
// fb_readRec(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/*****************************************************/
function fb_readRec(_path, _key, _data, _processData, _readExtraVar) {
	console.log('fb_readRec: path= ' + _path + '  key= ' + _key);
	console.log(_data)


	readStatus = "waiting"
	firebase.database().ref(`${_path}/${_key}`).once("value", gotRecord, readErr)

	function gotRecord(snapshot) {
		let dbData = snapshot.val()
		console.log(dbData)
		if (dbData == null) {
			readStatus = "no record"
			_processData(dbData, _data)
		}
		else {
			readStatus = "ok"
			if (_path == GAMEPATH) {
				_processData(dbData, _data);
				// } else if (_path == LOBBY) {
				// _processData(dbData, _data);
			} else {
				_processData(dbData, _data);
				console.log(_data)
			}
		}
	}

	function readErr(error) {
		readStatus = "fail"
		console.log(error)
	}
}

/*
fb_processUserDetails(_dbData, _data)
called by fb_login and in fb_readRec
checks if there is data in the database
if none shows reg page
if data exists put in variable userDetails
*/
function fb_processUserDetails(_dbData, _data) {
	console.log("processing data")
	console.log(_dbData)
	//if no data in db
	//shows reg page and fills name + email in form
	if (_dbData == null) {
		sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
		window.location.replace("pages/regPage.html");
	} else {
		_data.uid = _dbData.uid
		_data.name = _dbData.name
		_data.email = _dbData.email
		_data.photoURL = _dbData.photoURL
		_data.sex = _dbData.sex
		_data.age = _dbData.age
		_data.address = _dbData.address
		_data.city = _dbData.city
		_data.postcode = _dbData.postcode
		_data.birthday = _dbData.birthday

		sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
		fb_readRec(GAMEPATH, _dbData.uid, userGameData, fb_processGameData); //reads user game data
	}
}

/*
fb_processAuthRole(_dbData, _data)
called in fb_login and fb_readRec
processes user's auth role
if no data exists makes data for user
if data exists update permissions variable (data.js)
calls function to check perms for admin button
*/
function fb_processAuthRole(_dbData, _data) {
	if (_dbData == null) {
		fb_writeRec(AUTHPATH, userDetails.uid, 1);
		_data.userAuthRole = 1;
		sessionStorage.setItem("permissions", _data.userAuthRole);
	} else {
		console.log(_dbData)
		_data.userAuthRole = _dbData;
		console.log(_data, permissions)
		sessionStorage.setItem("permissions", _data.userAuthRole);
		HTML_updateHTMLFromPerms();
	}
}

/*
fb_processGameData(_dbData, _data)
called after processing user details
if userdetails exists then game data has to exist
puts data in userGameData variable (data.js)
calls function to load page
*/
function fb_processGameData(_dbData, _data) {
	_data.gameName = _dbData.gameName
	_data.PTB_timeRec = _dbData.PTB_timeRec
	_data.PTB_avgScore = _dbData.PTB_avgScore
	_data.TTT_Wins = _dbData.TTT_Wins
	_data.TTT_Losses = _dbData.TTT_Losses
	_data.GTN_Wins = _dbData.GTN_Wins
	_data.GTN_Losses = _dbData.GTN_Losses
	_data.GTN_Draws = _dbData.GTN_Draws

	sessionStorage.setItem("userGameData", JSON.stringify(userGameData));
	fb_processPlayerCreateLobby();

	if (HTML_checkPage() == "index.html") {
		HTML_loadPage();
	}
}


/*
fb_processPlayerCreateLobby()
called after logging in automatically from gamePage.html
processes the user game data into lobby array
meant to allow the player to build a lobby
*/


function fb_processPlayerCreateLobby() {
	clientCreateLobby = [
		clientCreateLobby[userDetails.uid] = {
			gameName: userGameData.gameName,
			GTN_Wins: userGameData.GTN_Wins,
			GTN_Losses: userGameData.GTN_Losses,
			GTN_Draws: userGameData.GTN_Draws,
			UID: userDetails.uid,
		}
	]

	sessionStorage.setItem("clientData", JSON.stringify(clientCreateLobby[0]))
}

/*
fb_processLobbyAll(_snapshot, _dbData, _result, _data, dbkeys)
called in fb_readAll from html_getData in lobby_builder
process all of the data in 'activeLobbies' path
adds to _data and calls html_buildTableFunc to build the table for the user
*/
function fb_processLobbyAll(_snapshot, _dbData, _result, _data, dbKeys) {
	if (_result == "ok") {
		for (i = 0; i < dbKeys.length; i++) {
			let key = dbKeys[i]
			let user = Object.values(_dbData[key])
			_data = [];

			if (user[2] == null) {
				if (user[1].UID != null) {
					console.log(user, key)
					_data.push({
						gameName: user[1].gameName,
						GTN_Wins: user[1].GTN_Wins,
						GTN_Losses: user[1].GTN_Losses,
						GTN_Draws: user[1].GTN_Draws,
						UID: user[1].UID,
					})
				} else {
					console.log(user, key)
					_data.push({
						gameName: user[0].gameName,
						GTN_Wins: user[0].GTN_Wins,
						GTN_Losses: user[0].GTN_Losses,
						GTN_Draws: user[0].GTN_Draws,
						UID: user[0].UID,
					})
				}
			}
			html_buildTableFunc("tb_userDetails", _data)
		}
	}
}

/*****************************************************/
//fb_processGameAll(snapshot, _dbData, _result, _data, dbKeys, _sort)
//called in fb_readAll from HTML_lbDisplay
//process all the game data needed for leaderboard and calls HTML_sortLeaderboard to sort the data into a leaderboard
/*****************************************************/
function fb_processGameAll(_snapshot, _dbData, _result, _data, dbKeys, _sort) {
	if (_result == "ok") {
		console.log(dbKeys)
		for (i = 0; i < dbKeys.length; i++) {
			let key = dbKeys[i]
			_data.push({
				gameName: _dbData[key].gameName,
				GTN_Wins: _dbData[key].GTN_Wins,
				TTT_Wins: _dbData[key].TTT_Wins,
				PTB_timeRec: _dbData[key].PTB_timeRec,
				PTB_avgScore: _dbData[key].PTB_avgScore,
			})
		}
		HTML_sortLeaderboard(_data, _sort)
	}
}

/*****************************************************/
//fb_processReadOn(_dbData, _data, _path)
//called from fb_readOn
//not much here, with my code right now, only db_lobbyOnReadSort gets called
//can add more for other things like another multiplayer game
/*****************************************************/
function fb_processReadOn(_dbData, _data, _path) {
	//console.log("processing data")
	//console.log(_dbData)
	//if no data in db
	//shows reg page and fills name + email in form
	if (_dbData == null) {
		//reg_showPage();
		//reg_popUp(userDetails);
		//document.getElementById("loadingText").style.display = "none";
	} else {

		if (_path == LOBBY) {
			db_lobbyOnReadSort(_dbData)
		} else {
			_data.uid = _dbData.uid
			_data.name = _dbData.name
			_data.email = _dbData.email
			_data.photoURL = _dbData.photoURL
			_data.sex = _dbData.sex
			_data.age = _dbData.age
		}


		//fb_readRec(GAMEPATH, _dbData.uid, userDetails, fb_processGameData); //reads user game data
	}
}

/*****************************************************/
//fb_readOn(_path, _key, _data, _processData)
//called in gtn
//default firebase function
//sets a callback when data in the reference in the database gets updated
//calls _processData to process the data
/*****************************************************/
function fb_readOn(_path, _key, _data, _processData) {
	console.log('fb_readOn: path= ' + _path + '  key= ' + _key);

	readStatus = "waiting"
	firebase.database().ref(`${_path}/${_key}`).on("value", gotRecord, readErr);

	function gotRecord(snapshot) {
		let dbData = snapshot.val()
		//console.log(dbData)
		if (dbData == null) {
			readStatus = "no record"
			_processData(dbData)
		}
		else {
			readStatus = "ok"
			_processData(dbData, _data, _path)
		}
	}

	function readErr(error) {
		readStatus = "fail"
		//console.log(error)
	}
}

/*****************************************************/
//fb_readOff(_path, _key)
//default firebase function
//called to turn off a readOn in firebase
//turns off the readOn for the lobby
/*****************************************************/
function fb_readOff(_path, _key) {
	console.log("fb_readOff for " + _key)

	firebase.database().ref(`${_path}/${_key}`).off()
}

/*****************************************************/
//fb_updateRec(_path, _key, _data)
//default firebase function
//called to update a specific record in the database
//update and write has a difference
//update will not delete the other data in the same path
/*****************************************************/
function fb_updateRec(_path, _key, _data) {
	writeStatus = "waiting";
	firebase.database().ref(_path + "/" + _key).update(_data, function(error) {
		if (error) {
			writeStatus = "failure"
			console.log(error)
		}
		else {
			writeStatus = "ok"
			console.log(writeStatus)
		}
	});
	console.log("fb_updaterec exit")
}

/*****************************************************/
//fb_onDisconnect(_path, _key, _player)
//default firebase function
//will set the referenced to specified data in parameters when the player disconnects
/*****************************************************/
function fb_onDisconnect(_path, _key, _player) {
	if (_player == "p1dc") {
		var ref = firebase.database().ref(`${_path}/${_key}`)
		ref.onDisconnect().set(null)
	} else {
		inGame = (sessionStorage.getItem("inGame") === "true")
		if (inGame == true) {
			console.log(`${_path}/${_key}/${_player}_Status`)
			var ref = firebase.database().ref(`${_path}/${_key}`);
			if (_player == "p1") {
				ref.onDisconnect().update({ p1_Status: "offline" });
			} else {
				ref.onDisconnect().update({ p2_Status: "offline" });
			}

		}
	}
}

/*****************************************************/
//fb_onDisconnectOff(_path, _key, _player)
//default firebase function
//will turn off the onDisconnect function for the specified record
/*****************************************************/
function fb_onDisconnectOff(_path, _key, _player) {
	console.log("ondisconnect off for " + _player)
	if (_player == "p1dc") {
		var ref = firebase.database().ref(`${_path}/${_key}`)
		ref.onDisconnect().cancel()
	} else {
		var ref = firebase.database().ref(`${_path}/${_key}`)
		ref.onDisconnect().cancel()
	}
}

/*****************************************************/
//fb_logout()
//default firebase function
//signs the user out of the google account
/*****************************************************/
function fb_logout() {
	firebase.auth().signOut().then(function() {
		console.log("signout")
	}, function(error) {
		console.log(error)
	});
}
/*****************************************************/
//    END OF MODULE
/*****************************************************/