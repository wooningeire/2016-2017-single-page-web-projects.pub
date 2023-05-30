// NodeList
function nodeListToArray(nodeList) {
	return [].slice.call(nodeList);
}

// String
function isUpperCase(character) {
	if (character.length != 1) throw {name: "LengthError", message: "only one character allowed"};
	return (character == character.toUpperCase());
}

function isLowerCase(character) {
	if (character.length != 1) throw {name: "LengthError", message: "only one character allowed"};
	return (character == character.toLowerCase());
}

function replaceInStr(str, index, str1) {	
	return str.substr(0, index) + str1 + str.substr(index + str1.length);
}

function switchCase(str) {
	var letter;
	for (var i in str) {
		letter = str[i];
		if (isUpperCase(letter)) str = replaceInStr(str, i, letter.toLowerCase());
		if (isLowerCase(letter)) str = replaceInStr(str, i, letter.toUpperCase());
	}
	return str;
}

function getQueryVar(variable) {
	var variables = location.search.substr(1).split("&");
	for (var i in variables) {
		if (variables[i].split("=")[0] == variable) {
			return variables[i].split("=")[1];
		};
	}
	return false;
}

function toBool(val) {
	if (val) return true;
	return false;
}

/*function shift(str) {
	var keys = [
		[["`", "~"], ["1", "!"], ["2", "@"]
	];
}*/

// Array

function loopElements(nodeList, func) {
  nodeList = nodeListToArray(nodeList);
  for (var i in nodeList) {
	func(nodeList[i]);
  }
  return i;
}

// Math
function randint(min, max) {
	return Math.floor((max - min) * Math.random()) + min;
}

function choose(array) {
	return array[randint(0, array.length)];
}

function degToRad(deg) {
	return deg / 180 * Math.PI;
}

function radToDeg(rad) {
	return rad / Math.PI * 180;
}

// Function
function replaceInFunc(func, replaceValues) {
  var oldFunc = func.toString();

  var replacePair;
  for (var i in replaceValues) {
	replacePair = replaceValues[i];
	oldFunc = oldFunc.replace(replacePair[0], replacePair[1]);
  }

  return new Function(oldFunc.substring(oldFunc.indexOf("{") + 1, oldFunc.lastIndexOf("}")));
}

function callAsync(func) {
	setTimeout(func, 0);
}

// Object
function jSONP(url, callback, callbackName) {
  //Sets default for callbackName
  if (!callbackName) callbackName = "callback";

  //Create a <script> tag to get the JSON
  var scriptTag = document.createElement("script");
	
  url += "&" + callbackName + "=" + callback;
  scriptTag.setAttribute("src", url);
  scriptTag.setAttribute("id", "json_file");
	
  //Test if a JSON <script> tag has already been created, then replace it if it has been or append it if it has not
  var prevScriptTag = document.querySelector("#json_file");
	
  if (prevScriptTag) document.head.replaceChild(scriptTag, prevScriptTag);
	else document.head.appendChild(scriptTag);
}

// Bool
function xor(a, b) {
	a = toBool(a);
	b = toBool(b);
	return (( a || b ) && !( a && b ));
}

// XMLHttpRequest
function post(url, data, oRSC) {
	var request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/json");
	request.send(data);
	
	if (oRSC) request.onreadystatechange = oRSC;
}

// Event
function triggerEvent(element, eventName, details) {
	var event = new CustomEvent(eventName, details);
	element.dispatchEvent(event);
}

// Video
function isPlaying(video) {
	return (video.currentTime > 0 && !video.paused && !video.ended);
}