//**************************************************************//
// reg_manager.js
//
// Test registration page
// Written by Mr Bob 2020
// Tailored by Ezra 2023
// v01 Initial code
// v02 Include reg_getFormItemValue function in reg_manager.js 
// v03 Add reg_prep function
// v04 Add conversion from string to number for numeric feilds
// v05 Cut down version
// v06 Check if form passed html validation
/**************************************************************/      
//  TO IMPLIMENT THE REGISTRATION FEATURE:                                //<=======
//   1. Copy the style.css into your style.css &                         //<=======
//        DELETE the  display: block;  line.                             //<=======
//   2. Copy parts of index.html into your index.html as outlined in     //<=======
//         the index.html.                                                //<=======
//    3. Create a ???????.js module in your project &                     //<=======
//         copy the contents of this file into it.                        //<=======
//    4. Taylor your ???????.js to fit your program code by looking       //<=======
//         at lines ending with  //<=======                               //<=======
//    5. Create an images folder in your project.                         //<=======
//    6. Download this project to your computer, extract all the          //<=======
//         files from the zipped folder.                                  //<=======
//    7. Upload all the images to you projects images folder.             //<=======
//*************************************************************          //<=======
// These two lines need to be executed only after the                 //<=======
//  registration page is displayed                                    //<=======
// Save name & email into the form
// ENSURE THE OBJECT NAME IS CORRECT; its currently details           //<=======

function reg_popUp() {
  userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  console.log(userDetails);
  document.getElementById("p_regName").innerHTML = userDetails.name;        //<=======    
  document.getElementById("p_regEmail").innerHTML = userDetails.email;       //<=======  
}
//**************************************************************//
// reg_regDetailsEntered()
// Input event; called when user clicks ?????????? button               //<========
// Write user's details to DB
// Input:   
// Return:
//**************************************************************//
function reg_regDetailsEntered() {
  console.log('reg_regDetailsEntered');


  // Save player1's details from the form into your details object
  //  ENSURE THE OBJECT NAME THE PROGRAM SAVES TO IS CORRECT; 
  userGameData.gameName = reg_getFormItemValue("f_reg", 0);       //<=======
  userDetails.phone = Number(reg_getFormItemValue("f_reg", 1));      //<=======
  userDetails.sex = reg_getFormItemValue("f_reg", 2);
  userDetails.age = Number(reg_getFormItemValue("f_reg", 3))
  userDetails.address = reg_getFormItemValue("f_reg", 4)
  userDetails.city = reg_getFormItemValue("f_reg", 5)
  userDetails.postcode = reg_getFormItemValue("f_reg", 6)
  userDetails.birthday = reg_getFormItemValue("f_reg", 7)

  console.log("reg_regDetailsEntered: form passed html validation - " +
    document.getElementById('f_reg').checkValidity());

  if (isNaN(userDetails.phone)) {
    alert("Please input a proper phone number.");
  } else {
    if (document.getElementById('f_reg').checkValidity()) {
      fb_writeRec(DBPATH, userDetails.uid, userDetails, "reg"); //<=======
      fb_writeRec(GAMEPATH, userDetails.uid, userGameData);
    }
  }
  // Only write record to DB if all the fom's input passed html validation
}

//**************************************************************//
// reg_getFormItemValue(_elementId, _item)
// Called by reg_regDetailsEntered
// Returns the value of the form's item
// Input:  element id & form item number
// Return: form item's value
//**************************************************************//
function reg_getFormItemValue(_elementId, _item) {
  //console.log('reg_getFormItemValue: _elementId=' + _elementId +
  //	  ',  _item= ' + _item);

  return document.getElementById(_elementId).elements.item(_item).value;
}
//**************************************************************//
//    END OF PROG
//**************************************************************//