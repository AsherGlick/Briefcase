// a wrapper function
function eparse(input) {
  return _ASMATH(_RMWHITE(input));
}

//remove equational whitespace
function _RMWHITE (input) {
  var output = "";
  var inquote = false;
  for (var i = 0; i < input.length; i++) {
    if ((input[i] == "'" || input[i] == '"')) {
      inquote = !inquote;
    }
    if (input[i] != " " || inquote == true) {
      output+=input[i];
    }
  }
  return output;
}

//_ASMATH handles additions and subtractions in math
function _ASMATH(input) {
  var lastpoint = 0;
  var output;
  var first = true;
  var negativeSwitch = false;
  var parenCount = 0; // keep track of parenthasese
  var i = 0;
  // if the first number is negative
  if (input[0]=='-') {
    negativeSwitch = true;
    i=1;
    lastpoint = 1; 
  }
  for (; i < input.length; i++) {
    if ((input[i] == '+' || input[i] == '-') && parenCount == 0) {
      // parse block
      var addon;
      if (_INPAREN(input.substring(lastpoint,i))) {
        addon = _ASMATH(input.substring(lastpoint+1,i-1));
      }
      else {
        addon = _MDMATH(input.substring(lastpoint,i));
      }
      
      // add or subtract result
      if (negativeSwitch) {output -= addon;}
      else if (first) { output = addon; first=false;}
      else {output += addon}
      
      // check to see if the symbol is a subtraction sign
      negativeSwitch = (input[i] == '-');
      // make the next block start after the symbol
      lastpoint = i+1;
    }
    else if (input[i] == '('){
      parenCount++;
    }
    else if (input[i] == ')'){
      parenCount--;
    }
  }
  // parse the final block, lastpoint to end
  var addon;
  if (_INPAREN(input.substring(lastpoint,input.length))) {
    addon = _ASMATH (input.substring(lastpoint+1,input.length-1));
  }
  else{
    addon = _MDMATH (input.substring(lastpoint,input.length));
  }
  
  if (negativeSwitch) {output -= addon;}
  else if (first) { output = addon; first=false;}
  else {output += addon;}
  return output;
}
/**************************** MULTIPLY DIVIDE MATH ****************************\
|
\******************************************************************************/

// MD math handles multiplication and division
function _MDMATH (input) {
  var output = 0;
  var lastpoint = 0;
  var parenCount = 0;
  var divideSwitch = false;
  var first = true;
  
  for (var i = 0; i < input.length; i++) {
    if ((input[i] == '*' || input[i] == '/') && !parenCount) {
      var addon;
      if (_INPAREN(input.substring(lastpoint,i))) {
        addon = _ASMATH (input.substring(lastpoint+1, i-1));
      }
      else {
        addon = _ANALYZEATOM(input.substring(lastpoint,i));
      }
      
      if (divideSwitch) { output /= addon; }
      else if (first) { output = addon; first=false;}
      else {output *= addon;}
      
      divideSwitch = (input[i] == '/');
      lastpoint = i+1;
    }
    else if (input[i] == '(') {parenCount++;}
    else if (input[i] == ')') {parenCount--;}
  }
  
  var addon;
  if (_INPAREN(input.substring(lastpoint,input.length))){
    addon = _ASMATH(input.substring(lastpoint+1,input.length-1));
  }
  else {
    addon = _ANALYZEATOM(input.substring(lastpoint,input.length));
  }
  if (divideSwitch) output /= addon;
  else if (first) {output = addon; first=false;}
  else {output *= addon;}
  return output;
}

function isDigit(character) {
  return (character == '1' ||
          character == '2' ||
          character == '3' ||
          character == '4' ||
          character == '5' ||
          character == '6' ||
          character == '7' ||
          character == '8' ||
          character == '9' ||
          character == '0');
}

function isCapLetter (character) {
  return (character == 'A' ||
          character == 'B' ||
          character == 'C' ||
          character == 'D' ||
          character == 'E' ||
          character == 'F' ||
          character == 'G' ||
          character == 'H' ||
          character == 'I' ||
          character == 'J' ||
          character == 'K' ||
          character == 'L' ||
          character == 'M' ||
          character == 'N' ||
          character == 'O' ||
          character == 'P' ||
          character == 'Q' ||
          character == 'R' ||
          character == 'S' ||
          character == 'T' ||
          character == 'U' ||
          character == 'V' ||
          character == 'W' ||
          character == 'X' ||
          character == 'Y' ||
          character == 'Z');
}

function letterValue (character) {
  if (character == 'A' || character == 'a') { return 0; }
  else if (character == 'B' || character == 'b') { return 1; }
  else if (character == 'C' || character == 'c') { return 2; }
  else if (character == 'D' || character == 'd') { return 3; }
  else if (character == 'E' || character == 'e') { return 4; }
  else if (character == 'F' || character == 'f') { return 5; }
  else if (character == 'G' || character == 'g') { return 6; }
  else if (character == 'H' || character == 'h') { return 7; }
  else if (character == 'I' || character == 'i') { return 8; }
  else if (character == 'J' || character == 'j') { return 9; }
  else if (character == 'K' || character == 'k') { return 10; }
  else if (character == 'L' || character == 'l') { return 11; }
  else if (character == 'M' || character == 'm') { return 12; }
  else if (character == 'N' || character == 'n') { return 13; }
  else if (character == 'O' || character == 'o') { return 14; }
  else if (character == 'P' || character == 'p') { return 15; }
  else if (character == 'Q' || character == 'q') { return 16; }
  else if (character == 'R' || character == 'r') { return 17; }
  else if (character == 'S' || character == 's') { return 18; }
  else if (character == 'T' || character == 't') { return 19; }
  else if (character == 'U' || character == 'u') { return 20; }
  else if (character == 'V' || character == 'v') { return 21; }
  else if (character == 'W' || character == 'w') { return 22; }
  else if (character == 'X' || character == 'x') { return 23; }
  else if (character == 'Y' || character == 'y') { return 24; }
  else if (character == 'Z' || character == 'z') { return 25; }
}

function isFunction(atom) {
  if (atom[atom.length-1] == ')' && !isDigit(atom[0])) {
    // check for function
    var parencount = 0;
    var parenStart = -1;
    for (var i = 0; i < atom.length; i ++) {
      if (parencount == 0 && parenStart != -1){
        // ERROR
        return "false";
      }
      if (atom[i] == '(') {
        if (parenStart == -1) {
          parenStart = i;
        }
        parencount++;
      }
      else if (atom[i] == ')') {
        parencount--;
      }
    }
    if (parencount == 0) {
      var functionName = atom.substring(0,parenStart).split('.',-1);
      if (functionName.length == 1) {
        functionName[1]=functionName[0];
        functionName[0]='default';
      }
      if (functionName.length > 2) {
        alert("split failed badly");
      }
      return atom.substring(parenStart+1,atom.length-1) + ',' + functionName[0]+'_'+functionName[1];
    }
  }
  else {
    return "false";
  }
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
function _splitcomma (block) {
  var data = block.split(',');
  var parenCount = 0;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      if (data[i][j] == '(') {
        parenCount++;
      }
      else if (data[i][j] == ')') {
        parenCount--;
      }
    }
    if (parenCount > 0) {
      data[i] += ',' + data.splice(i+1,1);
      parenCount = 0;
      i--;
    }
  }
  return data;
}
////////////////////////////////////////////////////////////////////////////////
// a check to see if an atom is a cell
////////////////////////////////////////////////////////////////////////////////
function isCell (atom) {
  var atNumbers = false;
  var splitPosition = -1;
  if (!isCapLetter(atom[0])) {
    return "false";
  }
  for (var i = 0; i < atom.length; i++) {
    if (isCapLetter(atom[i]) && !atNumbers) {
      continue;
    }
    atNumbers=true;
    splitPosition = i;
    if (isDigit(atom[i])) {
      continue;
    }
    return "false";
  }
  // Convert Letters to numbers
  var letters = atom.substring(0,splitPosition);
  var resultingNumber = 0;
  for (var i = 0; i < letters.length; i++) {
    resultingNumber += Math.pow(26,i) * letterValue (letters[i]);
  }
  return (resultingNumber+','+atom.substring(splitPosition,atom.length));
}
////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
function getCellValue (cell) {
  return data[cell];
}

  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// ATOM PARSING ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/******************************** ANALYZE ATOM ********************************\
| the Analyse Atom function parses an element of the arithmatic and determines |
| if it is a function, a number, or a cell name                                |
\******************************************************************************/
function _ANALYZEATOM(input){
  // Input is a String
  if (_INQUOTES(input)) {
    return input.substring(1,input.length-1);
  }
  // Input is a Function
  var functData = isFunction(input);
  if (functData != "false") {
    // Call the Function
    var parsed = _splitcomma (functData);
    var functionName = parsed.pop();
    if (window[functionName] == undefined) {
      alert("Function Not Found");
    }
    else {
      for (var i = 0; i < parsed.length; i++) {
        parsed[i] = eparse(parsed[i]);
      }
      return window[functionName].apply(this,parsed);
    }
  }
  // Input is a Cell Location
  var cellData = isCell(input)
  if (cellData != "false"){
    var cellValue = getCellValue(cellData);
    if (cellValue == undefined || cellValue == "") {
      alert("cell is undefined");
      return 0;
    }
    if (cellValue[0] == '=') {
      return eparse(cellValue.substring(1,cellValue.length));
    }
    return cellValue;
  }
  // Input is a Number
  return parseInt(input);
}

  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// ENCAPSULATORS ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/******************************* IN PARENTHESES *******************************\
| inparen checks to see if the atom is encapsulated in Parentheses, if so      |
| then the function returns true, if not the function returns false            |
\******************************************************************************/
function _INPAREN(atom) {
  var pcout = 1;
  if (atom[0] == '(' && atom[atom.length-1] == ')') {
    for (var i = 1; i < atom.length-1; i++) {
      if (atom[i] == '(') pcout++;
      else if (atom[i] == ')') pcout--;
      // if pcount is zero then it is not just one big parenthase group
      if (pcout == 0) return false;
    }
    return true;
  }
  return false;
}
/********************************** IN QUOTES *********************************\
| This function is very similar to resmath but it functions for quotes         |
| instead of Parentheses                                                       |
\******************************************************************************/
function _INQUOTES(atom) {
  if (atom.length < 2) {
    return false;
  }
  if ((atom[0] == '"' || atom[0]=="'") && (atom[atom.length-1] == '"' || atom[atom.length-1] == "'")) {
    // more tests may need to be in here, for quotes and parentheses inside each other
    return true;
  }
  return false;
}
