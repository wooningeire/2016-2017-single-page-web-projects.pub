/* Drawing board and brush setup */

var ca = document.querySelector("canvas");
var c = ca.getContext("2d");

// define size of canvas

function caResize() {
  ca.width = document.body.scrollWidth - 75;
  ca.height = document.body.scrollHeight;
};
caResize();

// define history
var verHist = [];
var ver = 0;

// detect clicks and lifts
ca.onmousedown = function(e) {
  if (e.button === 0) { // left mouse
    // draw at point
    brush.draw(e);
    ca.addEventListener("mousemove", brush.draw);
  }
};
ca.onmouseup = function() {
  ca.removeEventListener("mousemove", brush.draw);

  prevP = {
    x: -1,
    y: -1
  };

  addToHist();
};

function addToHist() {
  // add to hist
  if (ver < verHist.length) { // if version and history entries do not match
    verHist.splice(ver, verHist.length - ver);
  }
  verHist.push(c.getImageData(0, 0, ca.width, ca.height));
  ver++;
};
addToHist();

// initialize coords of previous points (for connect mode)
var prevP = {
    x: -1,
    y: -1
  },
  p = {
    x: -1,
    y: -1
  };

// brush
function Brush(shape, compositeMode, connect, d) {
  if (!compositeMode) compositeMode = "source-over";
  
  this.d = d;
  this.compositeMode = compositeMode;

  var r = d / 2;

  var point;

  // define functions for each shape
  var pointFuncs = {
    square: function(e, p) {
      c.fillRect(p.x - Math.ceil(r), p.y - Math.ceil(r), d, d);
    },

    circle: function(e, p) {
      c.beginPath();
      c.arc(p.x, p.y, r, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
  };

  point = pointFuncs[shape];

  // connect points
  this.draw = function(e) {
    // set composite operation
    c.globalCompositeOperation = compositeMode;
    
    // get coordinates of point
    var p = {
      x: e.pageX,
      y: e.pageY
    };
    
    // set point
    c.lineWidth = 1;
    point(e, p);

    // connect points
    c.lineJoin = "round";
    c.lineCap = "round";
    if (prevP.x > -1 && prevP.y > -1 && connect) {
      c.lineWidth = d;
      c.beginPath();
      c.moveTo(prevP.x, prevP.y);
      c.lineTo(p.x, p.y);
      c.stroke();
    }

    // set previous point
    prevP = p;
  };
}

console.info("%c[INITIALIZATION]%c Done! Ready to function.", "font-weight: 700; color: #aaa;", "font-weight: initial; color: initial;");
var brush = new Brush("circle", false, true, 4);

/* Page design and function */

// disabled buttons
document.querySelectorAll("button[disabled]").apply(function(element) {
  element.title = "This button is currently diabled.";
});

// svg styles
document.querySelectorAll(".settings-tabs svg *").apply(function(element) {
  element.setAttribute("stroke", "#000");
  element.setAttribute("stroke-linecap", "round");
  element.setAttribute("stroke-linejoin", "round");
});
document.querySelectorAll(".settings-selection *").apply(function(element) {
  element.setAttribute("stroke", "#fc4");
  element.setAttribute("stroke-width", "6");
});

// brush shape clicks
document.querySelectorAll(".settings-svgradio").apply(function(element) {
  element.onclick = function() {
    document.querySelector("[data-selected]").removeAttribute("data-selected");
    element.setAttribute("data-selected", true);

    document.querySelector(".settings-selection").style.marginLeft = (40 * (element.childNumber() - 1) + 3) + "px";
  };
});

// composite operations
var compositeModes = [
  "source-over", "source-in", "source-out", "source-atop",
  "destination-over", "destination-in", "destination-out", "destination-atop",
  "lighter", "copy", "xor", "multiply", "screen", "overlay", "darken",
  "lighten", "color-dodge", "color-burn", "hard-light", "soft-light",
  "difference", "exclusion", "hue", "saturation", "color", "luminosity"
];
for (var i in compositeModes) {
  var l = document.createElement("li");
  var r = document.createElement("input");
  
  r.setAttribute("type", "radio");
  r.setAttribute("name", "brushcomposition");
  r.setAttribute("value", compositeModes[i]);
  if (i == 0) r.setAttribute("checked", "true");
  
  l.appendChild(r);
  l.innerHTML += compositeModes[i];
  document.querySelector(".settings-brushcomposition ul").appendChild(l);
}

// brush update on settings change
function updateBrush() {
  var bD = document.querySelector(".brushdiameter");

  if (bD.value < 0) bD.value = 0;
  brush = new Brush(
    document.querySelector(".settings-brushshape [data-selected]").getAttribute("name"),
    document.querySelector("[name=\"brushcomposition\"]:checked").value,
    true,
    bD.value
  );
};
updateBrush();
document.querySelector(".settings").onchange = updateBrush;
document.querySelector(".settings").onclick = updateBrush;

// transition to settings menu
var settings = document.querySelector(".settings-container");
document.querySelector(".button-closemenu").onclick = function() {
  settings.style.cssText =
    "right: -300px;" +
    "box-shadow: none;";

  document.querySelector(".settings-tabs ul").style.marginTop = "-75px";
};
document.querySelector(".button-editbrush").onclick = function() {
  settings.style.cssText =
    "right: 0;" +
    "box-shadow: 0 0 20px rgba(0, 0, 0, .4);";

  document.querySelector(".settings-tabs ul").style.marginTop = "0";
};

// key combinations
document.onkeydown = function(e) {
  if (e.ctrlKey) {
         if (e.keyCode === 89) redo();
    else if (e.keyCode === 90) undo();
  }
};

function redo(e) {
  if (ver < verHist.length) {
    ver++;
    c.putImageData(verHist[ver - 1], 0, 0);
  }
};
document.querySelector(".button-undo").onclick = undo;

function undo(e) {
  if (ver > 1) {
    ver--;
    c.putImageData(verHist[ver - 1], 0, 0);
  };
};
document.querySelector(".button-redo").onclick = redo;
