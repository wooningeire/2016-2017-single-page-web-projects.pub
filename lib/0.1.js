function Custom(base) {
  var b = base;
  
  // Array
  if (Array.isArray(b)) {
    
    b.choose = function() {
      return this[Math.randint(0, this.length)];
    };
    
  }
  
  // Function
  else if (typeof b == "function") {
  
    b.replace = function(values) {
      var oldFunc = this.toString();

      var replacePair;
      for (var i in values) {
        replacePair = values[i];
        oldFunc = oldFunc.replace(replacePair[0], replacePair[1]);
      }

      return new Function(oldFunc.substring(oldFunc.indexOf("{") + 1, oldFunc.lastIndexOf("}")));
    };
    
    b.async = function() {
      setTimeout(this, 0);
    };
    
  }

  // String
  else if (typeof b == "string") {
  
    b.isUpperCase = function() {
      if (this.length !== 1)
        throw new Error("maximum length is one character");
      return this === this.toUpperCase();
    };

    b.isLowerCase = function() {
      if (this.length !== 1)
        throw new Error("maximum length is one character");
      return this == this.toLowerCase();
    };

    b.switchCase = function() {
      var letter;
      var n = this;
      
      for (var i in str) {
        letter = this[i];
        if (C(letter).isUpperCase()) n = C(n).insert(C(letter).toLowerCase(), i);
        if (C(letter).isLowerCase()) n = C(n).insert(C(letter).toUpperCase(), i);
      }
      
      return n;
    };

    b.insert = function(str, i) {
      return this.substring(0, i) + str + this.substr(i + str1.length);
    };
    
    b.contains = function(str) {
      if (this.indexOf(str) > -1)
        return true;
      return false;
    };
    
    b.clearWhitespace = function() {
      return this.replace(/[	 ]/g, "");
    };
    
  }

  // Object
  
  b.toBool = function() {
    if (this) return true;
    return false;
  };
  
  return b;
}

var C = Custom;

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

// Number
function isNumber(val) {
  return (typeof (val = parseInt(val)) == "number" && !isNaN(val));
}

// Object
function jSONP(url, callback, callbackName) {
  //Sets default for callbackName
  if (!callbackName)
    callbackName = "callback";

  //Create a <script> tag to get the JSON
  var scriptTag = document.createElement("script");
    
  url += "&" + callbackName + "=" + callback;
  scriptTag.setAttribute("src", url);
  scriptTag.setAttribute("id", "json_file");
    
  //Test if a JSON <script> tag has already been created, then replace it if it has been or append it if it has not
  var prevScriptTag = document.querySelector("#json_file");
	
  if (prevScriptTag)
    document.head.replaceChild(scriptTag, prevScriptTag);
	else
    document.head.appendChild(scriptTag);
}

function getQueryVar(variable) {
	var variables = location.search.substr(1).split("&");
	for (var i in variables) {
		if (variables[i].split("=")[0] == variable)
			return variables[i].split("=")[1];
	}
	return false;
}

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
	
	if (oRSC)
    request.onreadystatechange = oRSC;
}

// Color
function Color(color, forceHTML) {
  console.warn("Use the RGBColor, HSLColor, HexColor, and HTMLColor constructors to generate full color objects.");
  
  if (typeof color != "string")
    throw new TypeError(color + " is not a string");
  
  if (!forceHTML) {
    var components;
    
    color = color.replace(/[  ]/g, "");
    
    // RGB
    if ((color.startsWith("rgb(") || color.startsWith("rgba(")) && color.endsWith(")")) {
    };
  }
}
Color.prototype.getRep = function(format) {
  if (!format) {
    format = this.format;
  }
  
  if (format == "rgb") {
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
  } else if (format == "rgba") {
    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  } else if (format == "hexadecimal") {
    return "#" + this.rHex + this.gHex + this.bHex;
  }
  
  return false;
};

function RGBColor(r, g, b, a) {
  var components;
  var format;
  
  function verifyComponents(components) {
    for (var i in components) {
      var c = parseFloat(components[i]);
      
      // verify if number
      if (isNaN(c)) {
        c = 0;
      } else {
        if (i < 3) {
          c = parseInt(c);
          
          if (c > 255)
            c = 255;
          else if (c < 0)
            c = 0;
          
        } else {
          if (c > 1)
            c = 1;
          else if (c < 0)
            c = 0;
          
        }
      }
      
      components[i] = c;
    }
    
    return components;
  }
  
  if (typeof r == "string") {
    
    if ((!r.startsWith("rgb(") && !r.startsWith("rgba(")) || !r.endsWith(")")) {
      throw new TypeError("\"" + r + "\" is a string but does not represent a color in RGB or RGBA format");
    } else {
    
      // extract color components from RGB
      components = r.substring(r.indexOf("(") + 1, r.lastIndexOf(")")).split(",");
      
      components = verifyComponents(components);
      
      if (r.startsWith("rgb(")) {
        components = components.splice(0, 3);
        format = "rgb";
      } else {
        components = components.splice(0, 4);
        format = "rgba";
      }
    }
    
  } else {
    if (!a)
      format = "rgb";
    else
      format = "rgba";
    
    components = verifyComponents([r, g, b, a]);
  }
  
  this.format = format;
      
  this.r = components[0];
  this.g = components[1];
  this.b = components[2];
      
  if (components[3])
    this.a = components[3];
  else
    this.a = 1;
  
}
RGBColor.prototype = Object.create(Color.prototype);

function HexColor(r, g, b) {
  var components;
  
  if (r.startsWith("#") && r.length >= 4) {
    if (r.length != 7) {
      let x = r.substring(1);
      
      r = "#" + x[0] + x[0] + x[1] + x[1] + x[2] + x[2];
    }
    
    components = [
      r.substring(1, 3),
      r.substring(3, 5),
      r.substring(5)
    ];
    
    for (var i in x) {
      x[i] = parseInt(x[i], 16);
      
      if (isNaN(x[i]))
        x[i] = 0;
    }
    
    var c = new RGBColor(x[0], x[1], x[2]);
      
    Object.assign(this, c);
    this.format = "hexadecimal";
  } else {
    components = [r, g, b];
  }
  
  for (var i in components) {
    components[i] = parseInt(components[i], 16);
    
    if (isNaN(components[i]))
      components[i] = 0;
  }
    
  var c = new RGBColor(components[0], components[1], components[2]);
  
  Object.assign(this, c);
  this.format = "hexadecimal";
  
  this.rHex = decToHex(this.r);
  this.gHex = decToHex(this.g);
  this.bHex = decToHex(this.b);

  delete this.r;
  delete this.g;
  delete this.b;
}
HexColor.prototype = Object.create(Color.prototype);

function HSLColor(h, s, l, a) {
  var components;
  var format;
  
  function verifyComponents(components) {
    for (var i in components) {
      var c = parseFloat(components[i]);
      
      // verify if number
      if (isNaN(c)) {
        c = 0;
      } else if (i > 0) {
          
        if (c > 1)
          c = 1;
        else if (c < 0)
          c = 0;
          
      }
      
      components[i] = c;
    }
    
    return components;
  }
  
  if (typeof r == "string") {
    
    if ((!r.startsWith("hsl(") && !r.startsWith("hsla(")) || !r.endsWith(")")) {
      throw new TypeError("\"" + r + "\" is a string but does not represent a color in HSL or HSLA format");
    } else {
    
      // extract color components from RGB
      components = r.substring(r.indexOf("(") + 1, r.lastIndexOf(")")).split(",");
      
      components = verifyComponents(components);
      
      if (r.startsWith("hsl(")) {
        components = components.splice(0, 3);
        format = "hsl";
      } else {
        components = components.splice(0, 4);
        format = "hsla";
      }
    }
    
  } else {
    if (!a)
      format = "hsl";
    else
      format = "hsla";
    
    components = verifyComponents([h, s, l, a]);
  }
      
  this.h = components[0];
  this.s = components[1];
  this.l = components[2];
      
  if (components[3])
    this.a = components[3];
  else
    this.a = 1;
      
  this.format = format;
}
HSLColor.prototype = Object.create(Color.prototype);
      
function decToHex(n) {
  n = n.toString(16);
  
  if (n.length < 2)
    n = "0" + n;
   
  return n;
}