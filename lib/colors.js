function custom(b) {
  if (Array.isArray(b)) {
    b.choose = function() {
      return this[randint(0, this.length)];
    };
    b.average = function() {
      var total = 0;
      for (var i = 0; i < this.length; i++)
        total += this[i];
      
      return moveInRange(total / this.length, 0);
    };
  }
  return b;
}

function randint(min, max) {
  return Math.floor((max - min) * Math.random()) + min;
}

function degToRad(deg) {
  return deg / 180 * Math.PI;
}

function radToDeg(rad) {
  return rad / Math.PI * 180;
}

function nodeToImg(node, onload) {
  var nodeCopy = node.cloneNode(true);
  if (!nodeCopy.getAttribute("xmlns"))
    nodeCopy.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

  var html = 
    "<svg xmlns=\"http://www.w3.org/2000/svg\"><foreignObject width=\"100%\" height=\"100%\">" +
    nodeCopy.outerHTML +
    "</foreignObject></svg>"; console.log(html);

  var img = new Image();
  var blob = new Blob([html], {type: "image/svg+xml"});
  var url = URL || webkitURL;
  var src = url.createObjectURL(blob);

  if (onload)
    img.onload = function() {
      onload(img);
      url.revokeObjectURL(src);
    };
  img.src = src;

  return img;
}

function moveInRange(num, min, max, defaultMax) {
  if ((isNaN(num) && !defaultMax) || num < min)
    num = min;
  else if (isNaN(num) || num > max)
    num = max;
  return num;
}

const HEXPERCENT = 1 / 51 * 20;

function Color(r, g, b, a) {
  if (this === window)
    return new Color(r, g, b, a);
  
  var components = [r, g, b, a];
  for (var i in [r, g, b])
    components[i] = moveInRange(parseInt(components[i]), 0, 255);
  components[3] = moveInRange(parseFloat(components[3]), 0, 255, true);

  this.r = components[0];
  this.g = components[1];
  this.b = components[2];
  this.a = components[3];
}

Color.fromRGB = function(r, g, b, a) {
  return new Color(r, g, b, a);
};
Color.fromHex = function(r, g, b, a) {
  var components = [r, g, b, a];
  for (var i in components)
    components[i] = parseInt(components[i], 16);

  r = components[0];
  g = components[1];
  b = components[2];
  a = components[3];

  return new Color(r, g, b, a);
};
Color.fromHSL = function(h, s, l, a) {
  h = Math.abs(h) % 360;
  s = moveInRange(s, 0, 255) / 255;
  l = moveInRange(l, 0, 255) / 255;

  var c = s * (1 - Math.abs(2 * l -1));
  var x = c * (1 - Math.abs(h / 60 % 2 - 1));

  var primes;
  if (h < 60)
    primes = [c, x, 0];
  else if (h >= 60 && h < 120)
    primes = [x, c, 0];
  else if (h >= 120 && h < 180)
    primes = [0, c, x];
  else if (h >= 180 && h < 240)
    primes = [0, x, c];
  else if (h >= 240 && h < 300)
    primes = [x, 0, c];
  else
    primes = [c, 0, x];

  var m = l - c / 2;
  var r = (primes[0] + m) * 255
  var g = (primes[1] + m) * 255
  var b = (primes[2] + m) * 255

  return new Color(r, g, b, a);
};
Color.fromName = function(name) {
  var element = document.createElement("font");
  element.color = name;
  document.body.appendChild(element);
  var color = getComputedStyle(element).color;
  document.body.removeChild(element);

  return Color.fromFormatted(color);
};

Color.fromFormatted = function(base) {
  if (!base)
    base = "";

  if ((base.indexOf("rgb(") === 0 || base.indexOf("rgba(") === 0) && base.lastIndexOf(")") === base.length - 1) {
    let c = base.substring(base.indexOf("(") + 1, base.lastIndexOf(")")).split(",");
    return Color.fromRGB(c[0], c[1], c[2], c[3]);
  } else if (base.indexOf("#") === 0) {
    base = base.substring(1);
    let c;
    if (base.length === 3)
      c = [base[0] + base[0], base[1] + base[1], base[2] + base[2], "ff"];
    else if (base.length === 4)
      c = [base[0] + base[0], base[1] + base[1], base[2] + base[2], base[3] + base[3]];
    else
      c = [base.substring(0, 2), base.substring(2, 4), base.substring(4, 6), base.substring(6, 8)];
    return Color.fromHex(c[0], c[1], c[2], c[3]);
  } else {
    return Color.fromName(base);
  }
};

Color.prototype.format = function(type) {
  function decToHex(b) {
    b = b.toString(16);
    if (b.length < 2)
      b = "0" + b;
    return b;
  }

  switch(type) {
    case "rgb":
      return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    case "hex":
      return "#" + decToHex(this.r) + decToHex(this.g) + decToHex(this.b);
    case "hex8":
      return "#" + decToHex(this.r) + decToHex(this.g) + decToHex(this.b) + decToHex(this.a);
    case "hsl":
      return "hsl(" + this.getHue() + "," + (this.getSaturation() * HEXPERCENT) + "%," + (this.getLightness() * HEXPERCENT) + "%)";
    case "hsla":
      return "hsla(" + this.getHue() + "," + (this.getSaturation() * HEXPERCENT) + "%," + (this.getLightness() * HEXPERCENT) + "%," + (this.a / 255) + ")";
    default:
      return "rgba(" + this.r + "," + this.g + "," + this.b + "," + (this.a / 255) + ")";
  }
};

Color.prototype.getHue = function() {
  var h;

  if (this.r >= this.g && this.g >= this.b)
    h = 60 * (this.g - this.b) / (this.r - this.b);
  else if (this.g > this.r && this.r >= this.b)
    h = 60 * (2 - (this.r - this.b) / (this.g - this.b));
  else if (this.g >= this.b && this.b > this.r)
    h = 60 * (2 + (this.b - this.r) / (this.g - this.r));
  else if (this.b > this.g && this.g > this.r)
    h = 60 * (4 - (this.g - this.r) / (this.b - this.r));
  else if (this.b > this.r && this.r >= this.g)
    h = 60 * (4 + (this.r - this.g) / (this.b - this.g));
  else if (this.r >= this.b && this.b > this.g)
    h = 60 * (6 - (this.b - this.g) / (this.r - this.g));

  return isNaN(h) ? 0 : h;
};
Color.prototype.getSaturation = function() {
  var min = Math.min(this.r / 255, this.g / 255, this.b / 255);
  var max = Math.max(this.r / 255, this.g / 255, this.b / 255);

  if (max == min)
    return 0;
  else {
    var d = max - min;
    return this.getLightness() > 255 / 2 ? d / (2 - max - min) * 255 : d / (max + min) * 255;
  }
};
Color.prototype.getLightness = function(perception) {
  if (perception)
    return ((3 * this.r + 4 * this.g + this.b) >>> 3);
  else
    return (Math.max(this.r, this.g, this.b) + Math.min(this.r, this.g, this.b)) / 2;
};

Color.prototype.invert = function(percent) {
  percent = moveInRange(percent, 0, 1, true);
  
  var r = moveInRange(percent * (255 - this.r), 0, 255);
  var g = moveInRange(percent * (255 - this.g), 0, 255);
  var b = moveInRange(percent * (255 - this.b), 0, 255);

  return new Color(r, g, b, this.a);
};
Color.prototype.grayscale = function() {
  var avg = moveInRange(Math.round((this.r + this.g + this.b) / 3), 0, 255);
  var r = avg;
  var g = avg;
  var b = avg;

  return new Color(r, g, b, this.a);
};
Color.prototype.sepia = function() {
  var l = this.getLightness(true);
  var r = moveInRange(l + 40, 0, 255);
  var g = moveInRange(l + 20, 0, 255);
  var b = moveInRange(l - 20, 0, 255);

  return new Color(r, g, b, this.a);
};

Color.prototype.overlay = function(color, blendMode) {
  var aPercent = color.a / 255;
  
  switch(blendMode) {
    case "add":
      return new Color(this.r + color.r * aPercent, this.g + color.g * aPercent, this.b + color.b * aPercent, this.a);
    case "subtract":
      return new Color(this.r - color.r * aPercent, this.g - color.g * aPercent, this.b - color.b * aPercent, this.a);
    default:
      return new Color(
     // (this.r * (255 - color.a) + color.r * color.a) / 255
        color.a * (-this.r + color.r) / 255 + this.r,
        color.a * (-this.r + color.r) / 255 + this.r,
        color.a * (-this.r + color.r) / 255 + this.r,
        this.a
      );
  }
};

Color.prototype.shiftHue = function(deg) {
  if (isNaN(deg))
    return this;

  return Color.fromHSL(this.getHue() + deg, this.getSaturation(), this.getLightness());
};
Color.prototype.saturate = function(num) {
  if (isNaN(num))
    return this;

  return Color.fromHSL(this.getHue(), this.getSaturation() + num, this.getLightness());
};
Color.prototype.lighten = function(num) {
  if (isNaN(num))
    return this;

  return Color.fromHSL(this.getHue(), this.getSaturation(), this.getLightness() + num);
};