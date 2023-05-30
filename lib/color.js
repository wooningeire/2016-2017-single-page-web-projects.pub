

// Color
function Color(rep) {
  if (this === window) {
    return new Color(rep);
  }
    
  if (!rep) rep = "#000000";
  
  rep = rep.replace(/[	 ]/g, "");
  this.rep = rep;
  
  // differentiating color formats
  function getCVList(color) {
    return color.getColorValues().split(",").splice(0, 4);
  }
  
  function getRGBColorList(color) {
    var cs = getCVList(color);
    
    for (var i = 0; i < 3; i++) {
      var c = parseInt(cs[i]);
    
      if (!isNumber(c) || c < 0) c = 0;
      else if (c > 255) c = 255;
      
      cs[i] = c;
    }
  
    return cs;
  };
  
  function getHSLColorList(color) {
    
    function percentToNum(n) {
      return n.substring(0, n.length - 1) / 100;
    }
    
    var cs = getCVList(color);
      
    for (var i = 0; i < 3; i++) {
      var c = cs[i];
      
      if (i >= 1) {
        c = percentToNum(c);
        if (!isNumber(c) || c < 0) c = 0;
        else if (c > 1) c = 1;
      }
      
      c = parseFloat(c);
      cs[i] = c;
    }
  
    return cs;
  };

  function decToHex(val) {
    val = parseInt(val).toString(16);
    if (val.length < 2) val = "0" + val;
  
    return val;
  }
  
  var cs;

  // parsing
  
  if (this.isHex()) {
    // convert hexadecimals to processable decimals
    var t = this.getColorValues();
    
    if (t.length != 4) {
      t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2];
    }
    
    this.rep = 
      "rgb(" + 
      parseInt(t.substring(0, 2), 16) + "," + 
      parseInt(t.substring(2, 4), 16) + "," + 
      parseInt(t.substring(4), 16) + ")";
    
    cs = getRGBColorList(this).splice(0, 3);
    
    // assign rgb values
    this.r = cs[0];
    this.g = cs[1];
    this.b = cs[2];
    this.a = undefined;
    
    // assign hsl values
    
    this.l = (cs[0] + cs[1] + cs[2]) / 3;
    
    this.rgbRep = "rgb(" + cs[0] + "," + cs[1] + "," + cs[2] + ")";
    
    // convert back to hexadecimals
    cs[0] = decToHex(cs[0]);
    cs[1] = decToHex(cs[1]);
    cs[2] = decToHex(cs[2]);
  
    this.rep = "#" + cs[0] + cs[1] + cs[2];
  
    // assign hex values
    this.rHex = cs[0];
    this.gHex = cs[1];
    this.bHex = cs[2];
    
    this.repHex = this.rep;
  }
  
  else if (this.isRGB()) {
    cs = getRGBColorList(this);
  
    if (!cs[3]) this.rep = "rgb(" + cs[0] + "," + cs[1] + "," + cs[2] + ")"; // if alpha
    else { // if no alpha
      if (cs[3] < 0) cs[3] = 0;
      else if (!isNumber(cs[3]) || cs[3] > 1) cs[3] = 1;
    
      this.rep = "cs(" + cs[0] + "," + cs[1] + "," + cs[2] + "," + cs[3] + ")";
    }
  
    // assign cs values
    this.r = cs[0];
    this.g = cs[1];
    this.b = cs[2];
    this.a = cs[3];
    
    // assign hsla values
    
    this.l = (cs[0] + cs[1] + cs[2]) / 3;
    
    this.repRGB = this.rep;
    
    // assign hex values
    this.rHex = decToHex(cs[0]);
    this.gHex = decToHex(cs[1]);
    this.bHex = decToHex(cs[2]);
  }
  
  else if (this.isHSL()) {
    cs = getHSLColorList(this);
  
    if (!cs[3]) this.rep = "hsl(" + cs[0] + "," + (cs[1] * 100) + "%," + (cs[2] * 100) + "%)"; // if alpha
    else { // if no alpha
      if (cs[3] < 0) cs[3] = 0;
      else if (!isNumber(cs[3]) || cs[3] > 1) cs[3] = 1;
    
      this.rep = "cs(" + cs[0] + "," + (cs[1] * 100) + "%," + (cs[2] * 100) + "%," + cs[3] + ")";
    }
  
    // assign rgba values
    this.h = cs[0];
    this.s = cs[1];
    this.l = cs[2];
    this.a = cs[3];
    
    this.repHSL = this.rep;
  }
}

Color.prototype.getColorValues = function() {
  if (this.isRGB() || this.isHSL()) {
    return this.rep.substring(this.rep.indexOf("(") + 1, this.rep.lastIndexOf(")"));
  } else return this.rep.substring(1);
};

 // format tests
Color.prototype.isHex = function() {
  return this.getFormat().startsWith("hex");
};
Color.prototype.isRGB = function() {
  return this.getFormat().startsWith("rgb");
};
Color.prototype.isHSL = function() {
  return this.getFormat().startsWith("hsl");
};

Color.prototype.getFormat = function() {
       if (this.rep.startsWith("#"))     return "hexadecimal";
  else if (this.rep.startsWith("rgb("))  return "rgb";
  else if (this.rep.startsWith("rgba(")) return "rgba";
  else if (this.rep.startsWith("hsl("))  return "hsl";
  else if (this.rep.startsWith("hsla(")) return "hsla";
  else                                   return "html";
};