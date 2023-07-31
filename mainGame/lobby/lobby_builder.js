//******************************************************//
// html_buildLobby.js
// Written by mr Bob, Term 1 2023
// Example of building html lobby
// NOTE: uses a temperate literal
//******************************************************//
MODULENAME = "html_buildLobby.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

var html_sortKey = '';

//******************************************************//
// html_getData()
// Called by html GET DATA button
// Call fb_ readAll to read all firebase records in the path
// Input:  n/a
// Output: n/a
//******************************************************//
function html_getData() {
  console.log("html_getData: ");

  fb_readAll(LOBBY, lobbyArray, fb_processLobbyAll);
}

//******************************************************//
// html_build()
// Called by html build button
// Calls function to build html table
// Input:  n/a
// Output: n/a
//******************************************************//
function html_build() {
  console.log("html_build: ");

  html_buildTableFunc("tb_userDetails", clientCreateLobby);
  // if (typeof clientCreateLobby[0].p2_Status === "undefined" || clientCreateLobby[0].p2_Status === null) {
  //   clientCreateLobby[0].p2_Status = "offline";
  //   clientCreateLobby[0].p1_Status = "online";
  // }

  // console.log(clientCreateLobby[0])
  clientCreateLobby[0].player = 1;
  let lobbyData = {
      onlineGame: {
        p1_Status: "online",
        p2_Status: "offline",
        p1_uid: clientCreateLobby[0].UID,
      }
  };
  lobbyData[userDetails.uid] = clientCreateLobby[0];

  onlineLobby = `${LOBBY}/LOBBY: ${userDetails.uid}`;
  sessionStorage.setItem("onlineLobby", onlineLobby);
  sessionStorage.setItem("inGame", inGame)
  fb_readOn(LOBBY, `LOBBY: ${userDetails.uid}`, lobbyArray, fb_processReadOn);
  fb_onDisconnect(LOBBY, `LOBBY: ${userDetails.uid}`, "p1dc")
  fb_writeRec(LOBBY, `LOBBY: ${userDetails.uid}`, lobbyData);
}

//******************************************************//
// html_reset()
// Called by html reset button
// resets html table & buttons
// Input:  n/a
// Output: n/a
//******************************************************//
function html_reset() {
  console.log("html_reset: ");

  document.getElementById("tb_userDetails").innerHTML = '';
  lobbyArray = [];

  var html_elements = document.querySelectorAll('.b_options');
  html_elements.forEach((element) => {
    element.classList.remove('w3-disabled');
  });
  html_elements = document.querySelectorAll('.b_part2');
  html_elements.forEach((element) => {
    element.classList.add('w3-disabled');
  });
}

//******************************************************//
// html_buildTableFunc(_tableBodyID, _array)
// Called by html_build()
// Build html table rows from an array of objects
// Input:  html id of table body, array of objects
//  EG  [{name:   'bobby',
//        wins:    4,
//        draws:   1,
//        losses:  0,
//        UID:     zE45Thkj9#se4ThkP},
//       {name:   'car man',
//        wins:    9,
//        draws:   0,
//        losses:  0,
//        UID:     g7K456hledrj#gkij}]
// Output: n/a
//******************************************************//
function html_buildTableFunc(_tableBodyID, _array) {
  console.log("html_buildTableFunc: ");
  console.table(_array);

  // Get all the info on the table
  var html_table = document.getElementById(_tableBodyID);
    
  // Loop thu array; build row & add it to table
  for (i = 0; i < _array.length; i++) {
    // Back ticks define a temperate literal
    var player = _array[i]
    console.log(player, _array)
    var row = `<tr id='${player.UID}'>
                <td>${player.gameName}</td>
                <td class="w3-center">${player.GTN_Wins}</td>
                <td class="w3-center">${player.GTN_Draws}</td>
                <td class="w3-center">${player.GTN_Losses}</td>
                <td>${player.UID}</td>
                <td><button class="b_join">Join</button></td>
              </tr>`
    html_table.innerHTML += row;
  }

  /*--------------------------------------------------*/
  // jQuery ready()
  // Only runs when jQuery determines page is "ready"
  // Adds to all rows inside tb_userDetails an onclick
  //  function to get the current row's UID entry.
  /*--------------------------------------------------*/
  $(document).ready(function () {
    // code to read selected table row cell data (values).
    $("#tb_userDetails").on('click', '.b_join', function () {
      // get the current row
      var currentRow = $(this).closest("tr");
      
      // get current row's 1st TD value
      var col4 = currentRow.find("td:eq(4)").text();

      console.log("hi")
      if (col4 != userDetails.uid){
        console.log("html_buildTableFunc: uid = " + col4);

        document.getElementById(`${col4}`).remove();
        clientCreateLobby[0].player = 2;

        onlineLobby = `${LOBBY}/LOBBY: ${col4}`
        sessionStorage.setItem("onlineLobby", onlineLobby);

        fb_readOn(LOBBY, `LOBBY: ${col4}`, lobbyArray, fb_processReadOn);
        fb_updateRec(onlineLobby, "onlineGame", {p2_uid: userDetails.uid, p2_Status: "online", turn: "p1"});
        fb_writeRec(onlineLobby, userDetails.uid, clientCreateLobby[0]);
      }
    });
  });
}

//******************************************************//
// END OF CODE
//******************************************************//