/*************************************************************
  ad_manager.js
  
  Written by Mr Bob, Term 1 2020
  Develop a basic W3.CSS interface.
    v1 Basic layout of landing & game pages.
    v2 Landing/games pages full screen height but only display
       landing page on start up.
    v3 Stop canvas being displayed until its wanted.
    v4 Divide pages into left hand (1/3 of page) & 
       right hand (2/3 page) divs. 
       Also provide a margin at the bottom of pages.
    v5 Add button to landing page which hides the landing page
       and displays game page.
    v6 Add START button and score paragraphs etc to game page 
       left hand div (user control panel).
    v7 Make START button toggle between START and STOP button. 
    v8 Add bouncing balls when START button clicked.
    v9 Add reSize canvas.
    v10 Make font size responsive by using em instead of px.
    v11 Add firebase
    v12 Add admin with fixed table update
    v13 Add numeric validation
    v14 Add further comments
*************************************************************/

   

/**************************************************************/
// ad_admin()
// Input event; called when clock button clicked
// Display admin screen
// Input:   
// Return:
/**************************************************************/
function ad_admin() {
  if (permissions.userAuthRole >= 2) {
    window.location.replace("pages/adminPage.html")
    //ad_user();
  }
}

/**************************************************************/
// ad_home()
// Input event; called when admin home button clicked
// Display home screen
// Input:   
// Return:
/**************************************************************/
function ad_home() {
  console.log('ad_home: ');
  HTML_updateAdminPage("ad_home")

  // Display the HOME (landing page) screen
  // ENSURE THE HTML ID ARE CORRECT                                    

}

/**************************************************************/
// ad_user()
// Input event; called by ad_admin and when admin user button clicked.
// Display user screen
// Input:   
// Return:
/**************************************************************/
function ad_user() {
  console.log('ad_user: ');
  HTML_updateAdminPage("ad_user")
  // ENSURE THE READ FUNCTION NAME & THE PATH NAME ARE CORRECT         
  fb_readAll(DBPATH, "", ad_processUSERReadAll);                          
}

/**************************************************************/
// ad_Game()
// Input event; called when admin PTB button clicked
// Display BB screen
// Input:   
// Return:
/**************************************************************/
function ad_Game() {
  console.log('ad_Game: ');

  HTML_updateAdminPage("ad_Game")
  // ENSURE THE READ FUNCTION NAME & THE PATH NAME ARE CORRECT         
  fb_readAll(GAMEPATH, "", ad_processGameReadAll);                                 
}

/**************************************************************/
// ad_processUSERReadAll(_result, _dbRec)
// Called by db_readAll to handle result of read ALL USER records request.
// Save data & update display with record info
// Input:  read status "OK", data record just read. 
//         NOTE: this is the raw data, EG snapshot, NOT snapshot.val()
// Return:
/**************************************************************/
function ad_processUSERReadAll(_dbRec, _dbData, _result) {
  console.log(Object.values(_dbRec))

  var childKey;
  var childData;
  var ad_adminArray = [];
  // Note: if read was successful, 1st input parameter must = "OK"     
  if (_result = "ok") {
    _dbRec.forEach(function (childSnapshot) {
      childKey = childSnapshot.key;
      childData = childSnapshot.val();

      // ENSURE THE FEILDS YOU PUSH INTO THE ARRAY OF OBJECTS          
      //  MATCH YOUR FIREBASE RECORDS FOR THE PATH                     
      ad_adminArray.push({
        name: childData.name,
        email: childData.email,
        // Left photoURL out as its so long the table will be too wide for the screen
        //photoURL:   childData.photoURL,  
        phone: childData.phone,
        age: childData.age,
        sex: childData.sex,
        address: childData.address,
        city:       childData.city,
        postcode:   childData.postcode,
        //   addrCity:     childData.addrCity,
        birthday: childData.birthday,
        uid: childKey
      });
    });

    // build & display user data
    // MAKE SURE THE FOLOWING PARAMETERS ARE CORRECT. PARAMETER:       
    //  4 = HTML ID OF DIV TO HIDE OR LEAVE EMPTY                      
    //  5 = HTML ID OF DIV TO HIDE OR LEAVE EMPTY                      
    //  6 = HTML ID OF DIV TO SHOW OR LEAVE EMPTY                      
    //  7 = COLUMMN NUMBER WHICH CONTAINS THE DATABASE KEY.            
    //  8 = DATABASE PATH THE RECORDS WERE READ FROM.                  
    ad_displayAll("t_userData", ad_adminArray, true,
      "landingPage", "gamePage", "s_adminPage", 10, DBPATH);      
  }
}

/**************************************************************/
// ad_processBBReadAll(_result, _dbRec)
// Called by db_readAll to handle result of read ALL BB records request.
// Save data & update display with record info
// Input:  read status "OK", data record just read. 
//         NOTE: this is the raw data, EG snapshot, NOT snapshot.val()
// Return:
/**************************************************************/
function ad_processGameReadAll(_dbRec, _dbData, _result) {
  console.log('ad_processBBReadAll: ', 'result = ' + _result);

  var childKey;
  var childData;
  var ad_adminArray = [];

  // Note: if read was successful, 1st input parameter must = "ok"     
  if (_result == 'ok') {
    _dbRec.forEach(function (childSnapshot) {
      childKey = childSnapshot.key;
      childData = childSnapshot.val();

      // ENSURE THE FEILDS YOU PUSH INTO THE ARRAY OF OBJECTS          
      //  MATCH YOUR FIREBASE RECORDS FOR THE PATH                     
      ad_adminArray.push({
        gameName: childData.gameName,
        PTB_timeRec: childData.PTB_timeRec,
        PTB_avgScore: childData.PTB_avgScore,
        TTT_Losses: childData.TTT_Losses,
        TTT_Wins: childData.TTT_Wins,
        GTN_Wins: childData.GTN_Wins,
        GTN_Draws: childData.GTN_Draws,
        GTN_Losses: childData.GTN_Losses,
        uid: childKey,
      });
    });

    // build & display user data
    // MAKE SURE THE FOLOWING PARAMETERS ARE CORRECT. PARAMETER:       
    //  7 = COLUMMN NUMBER WHICH CONTAINS THE DATABASE KEY.            
    //  8 = DATABASE PATH THE RECORDS WERE READ FROM.                  
    ad_displayAll("t_userData", ad_adminArray, true, "", "", "",
      9, GAMEPATH);                                              
  } else if (_result == 'n/a') {
    ad_displayAll("t_userData", ad_adminArray, true, "", "", "",
      9, GAMEPATH);                                              
  }
}

/**************************************************************/
// ad_userInput(_feildName, _data)
// Called by finishTdEdit
// Validate numeric data & convert string number input to numerics
// Input:  field and user input
// Return: if validation ok: [true, numeric user input] else: [false, user input]
/**************************************************************/
function ad_userInput(_feildName, _data) {
  console.log("ad_userInput: _feildName = " + _feildName + ',  _data = ' + _data);
  // Set up data types; 'a' for aplhabetic,   'n' for numeric  &  'b' for both
  // ENSURE THE FEILDS BELOW MATCH YOUR DB FILEDS                     
  //   AND THE DATATYPE IS CORRECTLY SET                              
  var vd_dataTypes = {
    name: 'a',
    email: 'b',
    // Left photoURL out - its so long the table will be too wide for screen
    //photoURL:   'b', 
    gameName: 'b',
    phone: 'n',
    age: 'n',
    sex: 'a',
    address: "b",
    city: "a",
    postcode: "n",
    birthday: "b",
    //   addrPostCode: 'n',
    uid: 'b',

    GTN_Wins: "n",
	GTN_Losses: "n",
	GTN_Draws: "n",
    PTB_avgScore: 'n',
    PTB_timeRec: 'n',

    TTT_Wins: 'n',
    TTT_Losses: 'n',
    //   TTTTime:      'n'
  };

  if (vd_dataTypes[_feildName] == 'n') {
    temp = Number(_data);
    if (isNaN(temp)) {
      return [false, _data];
    }
    return [true, temp];
  }

  else {
    return [true, _data];
  }
}

//================================================================================= 
//        YOU SHOULD NOT ALTER ANY OF THE CODE BELOW                   
//=================================================================================

/**************************************************************/
// ad_displayAll(_tableId, _array, _action, _hideId, _showId, _path)
// Called by ad_dbRAllUResult & ad_dbRAllBBResult
// Display all user records screen:
//    1. optionaly hide other screen & display the admin screen.
//    2. empty the html table.
//    3. dyanmicaly build html table & display all records. 
// Input:  1. html table id to dynamicaly build and populate.
//         2. data (an array of objects) to add to the table.
//         3. add DELETE & MODIFY capability to the table (true OR false).
//         4. to hide the previous screen, supply the html ids
//           of the associated divs to hide it OR leave them empty ''
//         5. to show the admin screen, supply the html id
//           of the associated div to show it OR leave empty ''
//         6. table item number containing the db key.
//         7. firebase path for delete capability.
// Return: n/a
//
// V01: Initial version
// v02: Add delete & update code
//
// Example call of ad_displayAll:
//  ad_displayAll("t_userData", dbArray, true, "landingPage", "", "adminPage", 
//                1, DETAILS);
/**************************************************************/
function ad_displayAll(_tableId, _array, _action, _hideId1, _hideId2, _showId, _item, _path) {
  console.log('ad_displayAll: ');

  // Optionaly hide html divs and show another html div
  // if (_hideId1 != null && _hideId1 != "") {
  //   document.getElementById(_hideId1).style.display = "none";
  // }
  // if (_hideId2 != null && _hideId2 != "") {
  //   document.getElementById(_hideId2).style.display = "none";
  // }
  // if (_showId != null && _showId != "") {
  //   document.getElementById(_showId).style.display = "block";
  // }

  // Ensure the html table is empty before we start
  if (document.getElementById(_tableId).rows.length > 0) {
    document.getElementById(_tableId).innerHTML = "";
  }

  var tableInfo = document.getElementById(_tableId); //Get info on target table

  if (_array.length > 0) { // Only if there is data
    var fieldNames = Object.keys(_array[0]); //Get header from 1st entry 


    console.log('--------------------------');    //DIAG
    console.log('_array[0]: ');                   //DIAG
    console.log(_array[0]);                       //DIAG
    console.log('fieldNames= ' + fieldNames);     //DIAG
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^');    //DIAG


    //Dynamically build html table & display the data
    ad_genTableEntry(tableInfo, _array, _action, _tableId, _item, _path);
    ad_genTableHead(tableInfo, fieldNames, _action);

    ad_clickEditCell(_tableId, _item, _path); // Make cells editable
  }
}

/**************************************************************/
// ad_genTableHead(_tableInfo, _fieldNames, _action)
// Called by ad_BB
// Create table header
// Input:  table & object array of data 
//         if _action = true, then add action column
// Return: 
/**************************************************************/
function ad_genTableHead(_tableInfo, _fieldNames, _action) {
  console.log('ad_genTableHead: ');

  let thead = _tableInfo.createTHead();
  let row = thead.insertRow();

  // Optionaly create ACTION header
  if (_action != null && _action != "") {
    let th = document.createElement("th");
    let text = document.createTextNode("action");
    th.appendChild(text);
    row.appendChild(th);
  }

  // Loop thru array of object's field names creating header for entry each
  for (let key of _fieldNames) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

/**************************************************************/
// ad_genTableEntry(_tableInfo, _array, _action, _tableId, _item, _path)
// Called by ad_BB
// Create table entries
// Input:  table & object array of data
//         if _action = true, then add DELETE button
//         table id & table item number containing db key
//         db path
// Return:
/**************************************************************/
function ad_genTableEntry(_tableInfo, _array, _action, _tableId, _item, _path) {
  console.log('ad_genTableEntry: ');

  // Loop thru array of object's data creating cell for entry each
  for (let element of _array) {
    let row = _tableInfo.insertRow();
    // Optionaly create ACTION cell
    if (_action != null && _action != "") {
      // add a button control.
      var button = document.createElement('input');

      // set the attributes.
      button.setAttribute('type', 'button');
      button.setAttribute('value', 'Delete');

      // add button's "onclick" event.         
      button.addEventListener("click", function () {
        ad_dbDelRec(_tableId, this, _item, _path);
      });
      let cell = row.insertCell();
      cell.appendChild(button);
    }

    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

/**************************************************************/
// ad_clickEditCell(_tableId _item, _path)
// Called by user clicking on a table's cell
// Edit the cell's data except for cell 0.
// Input:  table id
/**************************************************************/
function ad_clickEditCell(_tableId, _item, _path) {
  console.log('ad_clickEditCell: path = ' + _path + ', item = ' + _item);

  let table = document.getElementById(_tableId);
  let editingTd;
  var cell;
  var row;
  var dbKey;
  var dbFieldName;

  //document.querySelector("table").addEventListener("click", function(event) {
  table.onclick = function (event) {
    //console.log('table.onclick: click event called. path = ' + _path); 
    // 4 possible targets:                
    let target = event.target.closest('.edit-cancel,.edit-ok,td');

    if (!table.contains(target)) return;

    if (target.className == 'edit-cancel') {
      finishTdEdit(editingTd.elem, false);
    } else if (target.className == 'edit-ok') {
      finishTdEdit(editingTd.elem, true, _path, dbKey, dbFieldName);
    } else if (target.nodeName == 'TD') {
      if (editingTd) return; // already editing
      if (typeof event.target.cellIndex == 'undefined') return;

      cell = event.target.cellIndex;
      row = target.parentNode.rowIndex;
      dbKey = table.rows[row].cells[_item].innerHTML;
      dbFieldName = table.rows[0].cells[cell].innerHTML;

      makeTdEditable(target);
    }
  }

  function makeTdEditable(td) {
    editingTd = {
      elem: td,
      data: td.innerHTML
    };

    td.classList.add('edit-td'); // td is in edit state, CSS also styles the area inside

    let textArea = document.createElement('textarea');
    textArea.style.width = td.clientWidth + 'px';
    textArea.style.height = td.clientHeight + 'px';
    textArea.className = 'edit-area';

    textArea.value = td.innerHTML;
    td.innerHTML = '';
    td.appendChild(textArea);
    textArea.focus();

    td.insertAdjacentHTML("beforeEnd",
      '<div class="edit-controls"><button class="edit-ok">OK' +
      '</button><button class="edit-cancel">CANCEL</button></div>'
    );
  }

  function finishTdEdit(td, isOk, _path, _dbKey, _dbFieldName) {
    if (isOk) {
      td.innerHTML = td.firstChild.value;
      console.log('path/key = ' + _path + '/' + _dbKey +
        ',  field name = ' + _dbFieldName + ', data = ' + td.innerHTML);

      var data = {};
      var rtn = [];
      rtn = ad_userInput(_dbFieldName, td.innerHTML);
      if (rtn[0]) {        // User input validated ok?
        data[_dbFieldName] = rtn[1];
        console.log("finishTdEdit: td.innerHTML = " + rtn[1] +
          '  type = ' + typeof (rtn[1]));
        td.style.background = 'red';
        ad_dbUpdateRec(_path, _dbKey, _dbFieldName, data, td);
      }
      else {
        td.style.background = 'red';
      }
    }
    else {
      td.innerHTML = editingTd.data;
    }
    td.classList.remove('edit-td');
    editingTd = null;
  }
}

/**************************************************************/
// ad_dbUpdateRec(_tableId, _row, _item, _path)
// Called by finishTdEdit when user clicks OK button
// Update the associated record from firebase
// Input:  path, key, field name, data & td object
// Return:
/**************************************************************/
function ad_dbUpdateRec(_path, _dbKey, _dbFieldName, _data, _td) {
  console.log('ad_dbUpdateRec: _path/_dbKey = ' + _path + '/' + _dbKey +
    ',  _dbFieldName = ' + _dbFieldName +
    ',  _data = ' + _data + '  _td = ' + _td);

  var dbRef = firebase.database().ref(_path + '/' + _dbKey);
  dbRef.update(_data).then(function () {
    _td.style.background = 'Azure';
    console.log("ad_dbUpdateRec: Update succeeded for " + _path + '/' + _dbKey);
    //ad_delRow(_tableId, _row, item, _path);
  })
    .catch(function (error) {
      console.log("ad_dbUpdateRec: Update failed for " +
        _path + '/' + _dbKey + ': ' + error.message);
    });
}

/**************************************************************/
// ad_dbDelRec(_tableId, _row, _item, _path)
// Called when user clicks DELETE button
// Delete the associated record from firebase
// Input:  html table id, row & item number of firebase key and firebase path 
// Return:
/**************************************************************/
function ad_dbDelRec(_tableId, _row, _item, _path) {
  console.log('ad_dbDelRec: _tableId/_row = ' + _tableId + '/' + _row +
    ',  _item = ' + _item + ',  _path = ' + _path);

  var i = _row.parentNode.parentNode.rowIndex;
  var key = document.getElementById(_tableId).rows[i].cells.item(_item).innerHTML;
  console.log('ad_dbDelRec; db path/key = ' + _path + '/' + key);

  var dbRef = firebase.database().ref(_path + '/' + key);
  dbRef.remove().then(function () {
    console.log("ad_dbDelRec: Remove succeeded for " + _path + '/' + key);
    ad_delRow(_tableId, _row);
  })
    .catch(function (error) {
      console.log("ad_dbDelRec: Remove failed for " +
        _path + '/' + key + ': ' + error.message);
    });
}

/**************************************************************/
// ad_delRow(_tableId, _row)
// Called by ad_dbDelRec when user clicks DELETE button
// Delete a row from a table
// Input:  table id & row to delete
// Return:
/**************************************************************/
function ad_delRow(_tableId, _row) {
  console.log('ad_delRow: _tableId/_row = ' + _tableId + '/' + _row);

  var i = _row.parentNode.parentNode.rowIndex;
  console.log('ad_delRow: i = ' + i); //DIAG
  document.getElementById(_tableId).deleteRow(i);
}

/**************************************************************/
// ad_enterEvent(_tableId)
// Called by user entering data in a table's cell
// Display the cell's data
// Input:  table id
/**************************************************************/
function ad_enterEvent(_tableId) {
  //console.log('ad_enterEvent: _tableId = ' + _tableId);

  // Listen for typing into a cell - display what is being typed into the cell.
  document.getElementById(_tableId).addEventListener("input", function (event) {
    var td = event.target;
    while (td !== this && !td.matches("td")) {
      td = td.parentNode;
    }

    if (td === this) {
      logIt('ad_dbRAllUResult', 'enter - No table cell found', COL_ERROR);
    } else {
      logIt('ad_dbRAllUResult', 'enter - cell= ' + td.innerHTML, COL_INFO);
      if (td.innerHTML == 'd') {
        //document.getElementById(_tableId).deleteRow(2);
      }
    }
  });
}

/**************************************************************/
// ad_clickCell(_tableId)
// Called by user clicking on a table's cell
// Edit the cell's data
// Input:  table id
/**************************************************************/
function ad_clickCell(_tableId) {
  //console.log('ad_clickCell: _tableId = ' + _tableId);

  // Click on cell to display its contents
  document.querySelector("table").addEventListener("click", function (event) {
    var td = event.target;
    while (td !== this && !td.matches("td")) {
      td = td.parentNode;
    }
    if (td === this) {
      logIt('ad_dbRAllUResult', 'click - No table cell found', COL_ERROR);
    } else {
      logIt('ad_dbRAllUResult', 'click - cell= ' + td.innerHTML, COL_INFO);
    }
  });
}

/**************************************************************/
//  END OE APP
/**************************************************************/