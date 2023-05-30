// Array
Array.prototype.choose = function () {
	return this[Math.randint(0, this.length)];
};

// Function
Function.prototype.replace = function (values) {
 var oldFunc = this.toString();

 var replacePair;
 for (var i in values) {
  replacePair = values[i];
  oldFunc = oldFunc.replace(replacePair[0], replacePair[1]);
 }

 return new Function(oldFunc.substring(oldFunc.indexOf("{") + 1, oldFunc.lastIndexOf("}")));
};

Function.prototype.async = function () {
	setTimeout(this, 0);
};

// Math
Math.randint = function (min, max) {
	return Math.floor((max - min) * Math.random()) + min;
};

Math.degToRad = function (deg) {
	return deg / 180 * Math.PI;
};

Math.radToDeg = function (rad) {
	return rad / Math.PI * 180;
};

// Node
Node.prototype.triggerEvent = function(name, details) {
	var event = new CustomEvent(name, details);
	this.dispatchEvent(event);
};

Node.prototype.childNumber = function() {
  var i = 0;
  var element = this;
  
  while (element !== null) {
    if (element.tagName) i++;
    element = element.previousSibling;
  }
  
  return i - 1;
};

Node.prototype.getStyle = function() {
  return this.currentStyle || getComputedStyle(this);
};

// NodeList
NodeList.prototype.toArray = function () {
	return [].slice.call(this);
};

NodeList.prototype.apply = function (func) {
 for (var i = 0; i < this.length; i++) {
  func(this[i]);
 }
 return i;
};

// Object
Object.prototype.toBool = function () {
	if (this) return true;
	return false;
};

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

// String
String.prototype.isUpperCase = function () {
 if (this.length !== 1) throw new Error("maximum length is one character");
	return this === this.toUpperCase();
};

String.prototype.isLowerCase = function () {
 if (this.length !== 1) throw new Error("maximum length is one character");
	return this == this.toLowerCase();
};

String.prototype.insert = function (str, i) {
 return this.substring(0, i) + str + this.substr(i + str1.length);
};

String.prototype.switchCase = function () {
	var letter;
 var n = this;
	for (var i in str) {
		letter = this[i];
		if (letter.isUpperCase()) n = n.insert(letter.toLowerCase(), i);
		if (letter.isLowerCase()) n = n.insert(letter.toUpperCase(), i);
	}
	return n;
};

function getQueryVar(variable) {
	var variables = location.search.substr(1).split("&");
	for (var i in variables) {
		if (variables[i].split("=")[0] == variable) {
			return variables[i].split("=")[1];
		};
	}
	return false;
}

/*function shift(str) {
	var keys = [
		[["`", "~"], ["1", "!"], ["2", "@"]
	];
}*/

// Video
function isPlaying(video) {
	return (video.currentTime > 0 && !video.paused && !video.ended);
}

// XMLHttpRequest
function post(url, data, oRSC) {
	var request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/json");
	request.send(data);
	
	if (oRSC) request.onreadystatechange = oRSC;
}