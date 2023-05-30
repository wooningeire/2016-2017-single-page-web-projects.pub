// Initialize canvas

var canvas = document.querySelector(".game");
var c = canvas.getContext("2d");

var tileWidth = 75;
var dim = [
  canvas.width / tileWidth,
  canvas.height / tileWidth
];

// Produce board representation
var rep = [
  [0, 0, 0, 0, 1, 0, 0, 0]
];
for (var i = 0; i < 7; i++) {
  rep.push(JSON.parse(JSON.stringify(rep[0])));
}

var board = new GameBoard(rep, [0, 4]);

const TILETYPES = [
  new TileType("solid", "#841"), //0
  new TileType("air",   "transparent"), //1
  new TileType("water", "rgba(0, 70, 190, .6)") //2
];

var waterLocations = [];

// Fill board
function fillBoard() {
  c.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before filling
  
  for (var j in board.rep) { // y
    for (var i in board.rep[j]) { // x
      c.fillStyle = TILETYPES[board.rep[j][i]].color; // get the color of a tile type based on the board representation
      c.fillRect(tileWidth * i, tileWidth * j, tileWidth, tileWidth);
    }
  }
}
setInterval(fillBoard, 100);

// GameBoard constructor
function GameBoard(rep, start) {
  this.rep = rep; // 2d array showing board types
  this.start = start; // where water flow starts
}

// TileType constructor
function TileType(name, color) {
  this.name = name;
  this.color = color;
}

// Begin water flow
board.rep[board.start[0]][board.start[1]] = 2;
waterLocations.push(board.start);

function flow() {
  var loc;
  var orths;
  for (var i in waterLocations) {
    loc = waterLocations[i];
    orths = [
      undefined, // down
      board.rep[loc[0]][loc[1] + 1], // left
      undefined, // up
      board.rep[loc[0]][loc[1] - 1]  // right
    ];
    
    if (board.rep[loc[0] - 1]) orths[0] = board.rep[loc[0] - 1][loc[1]]; // down
    if (board.rep[loc[0] + 1]) orths[0] = board.rep[loc[0] + 1][loc[1]]; // up
  
    if (orths[0] === 1) {
      board.rep[loc[0] + 1][loc[1]] = 2;
      waterLocations.push([loc[0], loc[1] - 1]);
    }
  }
}

setInterval(flow, 500);