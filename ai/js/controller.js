var turnMoveAI = document.getElementById("turn");
const csize = 50;
var cut_off = 5;
var board = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, -1, 0, 0, 0],
  [0, 0, 0, -1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
const evaluation = [
  [99, -8, 8, 6, 6, 8, -8, 99],
  [-8, -24, -4, -3, -3, -4, -24, -8],
  [8, -4, 7, 4, 4, 7, -4, 8],
  [6, -3, 4, 0, 0, 4, -3, 6],
  [6, -3, 4, 0, 0, 4, -3, 6],
  [8, -4, 7, 4, 4, 7, -4, 8],
  [-8, -24, -4, -3, -3, -4, -24, -8],
  [99, -8, 8, 6, 6, 8, -8, 99],
];
var over = false; //is game over
var player = -1; // 1 or -1
var first_click = true;

initial_board();
var canvas = document.getElementById("myCanvas");
canvas.addEventListener("click", on_canvas_click, false);

// document.onmousemove = mouse_move;

function count_board() {
  var black = 0;
  var white = 0;
  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      if (board[x][y] === 1) white += 1;
      if (board[x][y] === -1) black += 1;
    }
  }
  document.getElementById("BLACK").innerHTML = black.toString();
  document.getElementById("WHITE").innerHTML = white.toString();
}

function on_canvas_click(ev) {
  var rect = canvas.getBoundingClientRect();
  var y = ev.clientX - rect.left - csize;
  var x = ev.clientY - rect.top - csize;
  x = Math.floor(x / csize);
  y = Math.floor(y / csize);
  if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
    if (check_move(x, y)) {
      if (first_click) {
        first_click = false;
        initial_board();
      }
      update_board(x, y, true);
      player = -player;
      turnMoveAI.innerHTML =
        player === 1 ? "Computer move (White)" : "Person move (Black)";
      setTimeout(function () {
        if (check_game_over()) {
          return;
        }
        var opt = alpha_beta_search(board);
        update_board(opt["X"], opt["Y"], true);
        count_board();
        player = -player;
        check_game_over();
        turnMoveAI.innerHTML =
          player === 1 ? "Computer move (White)" : "Person move (Black)";
      }, 500);
    }
  }
}

function initial_board() {
  board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  player = -1;
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(csize, csize, csize * 8, csize * 8);
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      ctx.strokeRect(csize * (i + 1), csize * (j + 1), csize, csize);
      if (board[i][j] === 1) draw_circle(i, j, 1);
      if (board[i][j] === -1) draw_circle(i, j, -1);
    }
  }
  // if (first_click) start_guide();
  document.getElementById("BLACK").innerHTML = "2";
  document.getElementById("WHITE").innerHTML = "2";
}

function start_guide() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(50 * (3 + 1) + 25, 50 * (2 + 1) + 25, 18, 0, Math.PI * 2, true);
  ctx.fillStyle = "#DDDDDD";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(50 * (2 + 1) + 25, 50 * (3 + 1) + 25, 18, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(50 * (4 + 1) + 25, 50 * (5 + 1) + 25, 18, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(50 * (5 + 1) + 25, 50 * (4 + 1) + 25, 18, 0, Math.PI * 2, true);
  ctx.fill();

  // Quadratric curves
  ctx.beginPath();
  ctx.moveTo(190 + 75, 50 + 25);

  ctx.quadraticCurveTo(190 + 25, 50 + 25, 190 + 25, 50 + 62.5);
  ctx.quadraticCurveTo(190 + 25, 50 + 100, 190 + 50, 50 + 100);
  ctx.quadraticCurveTo(190 + 50, 50 + 120, 190 + 30, 50 + 125);
  ctx.quadraticCurveTo(190 + 60, 50 + 120, 190 + 65, 50 + 100);
  ctx.quadraticCurveTo(190 + 125, 50 + 100, 190 + 125, 50 + 62.5);
  ctx.quadraticCurveTo(190 + 125, 50 + 25, 190 + 75, 50 + 25);
  ctx.stroke();
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.font = "20px serif";
  ctx.fillText("Start here", 225, 125);
}

// called by update_board
function draw_circle(x, y, player) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(50 * (y + 1) + 25, 50 * (x + 1) + 25, 18, 0, Math.PI * 2, true);
  if (player === 1) {
    ctx.stroke();
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  } else if (player === -1) {
    ctx.fillStyle = "#191919";
    ctx.fill();
  }
}

// Check whether the move is valid
// return: True/False
function check_move(x, y) {
  if (board[x][y] !== 0) return false;
  const drcts = {
    u: [-1, 0],
    d: [1, 0],
    l: [0, -1],
    r: [0, 1],
    ru: [-1, 1],
    ld: [-1, -1],
    rd: [1, 1],
    lu: [1, -1],
  };
  for (var d in drcts) {
    if (check_by_direction(x, y, drcts[d][0], drcts[d][1]) === true)
      return true;
  }
  return false;
}

function check_by_direction(x, y, dx, dy) {
  x = x + dx;
  y = y + dy;
  if (x >= 8 || x < 0 || y >= 8 || y < 0) return false;
  if (board[x][y] === player || board[x][y] === 0) return false;
  x = x + dx;
  y = y + dy;
  while (x >= 0 && x < 8 && y >= 0 && y < 8) {
    if (board[x][y] === player) return true;
    if (board[x][y] === 0) return false;
    x = x + dx;
    y = y + dy;
  }
  return false;
}

// Update the board
function update_board(x, y, draw) {
  board[x][y] = player;
  if (draw === true) draw_circle(x, y, player);
  const drcts = {
    u: [-1, 0],
    d: [1, 0],
    l: [0, -1],
    r: [0, 1],
    ru: [-1, 1],
    ld: [-1, -1],
    rd: [1, 1],
    lu: [1, -1],
  };
  for (var d in drcts) {
    if (check_by_direction(x, y, drcts[d][0], drcts[d][1]) === true)
      update_by_direction(x, y, drcts[d][0], drcts[d][1], draw);
  }
}

function update_by_direction(x, y, dx, dy, draw) {
  x = x + dx;
  y = y + dy;
  while (x >= 0 && x < 8 && y >= 0 && y < 8) {
    if (board[x][y] !== player) {
      board[x][y] = player;
      if (draw === true) draw_circle(x, y, player);
      x = x + dx;
      y = y + dy;
    } else {
      break;
    }
  }
}

var opt = { X: null, Y: null, V: null };

// return act with max utility
function alpha_beta_search() {
  opt = { X: null, Y: null, V: null };
  max_value(-1000, 1000, 0);
  var x = 1;
  return opt;
}

// return a ultility value
function max_value(alpha, beta, depth) {
  var acts = actions();
  if (acts === [] || depth >= cut_off)
    // terminal test
    return utility();
  var v = -1000;
  for (var idx = 0; idx < acts.length; idx++) {
    var a = acts[idx];
    var copy = deepcopy(board);
    update_board(a["X"], a["Y"], false);
    player = -player;
    v = Math.max(v, min_value(alpha, beta, depth + 1));
    if (depth === 0 && (opt["V"] === null || opt["V"] < v)) {
      opt["V"] = v;
      opt["X"] = a["X"];
      opt["Y"] = a["Y"];
    }
    board = deepcopy(copy); // recover state
    player = -player;
    if (v >= beta)
      // pruning
      return v;
    alpha = Math.max(alpha, v);
  }
  return v;
}

// return a ultility value
function min_value(alpha, beta, depth) {
  var acts = actions();
  if (acts === [] || depth >= cut_off)
    // terminal test
    return utility();
  var v = 1000;
  for (var idx = 0; idx < acts.length; idx++) {
    var a = acts[idx];
    var copy = deepcopy(board);
    update_board(a["X"], a["Y"], false);
    player = -player;
    v = Math.min(v, max_value(alpha, beta, depth + 1));
    board = deepcopy(copy); // recover state
    player = -player;
    if (v <= alpha)
      // pruning
      return v;
    beta = Math.min(beta, v);
  }
  return v;
}

function utility() {
  var ans = 0;
  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      ans += board[x][y] * evaluation[x][y];
    }
  }
  return ans;
}

// return valid actions at state
function actions() {
  var acts = [];
  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      if (check_move(x, y)) acts.push({ X: x, Y: y });
    }
  }
  return acts;
}

function check_game_over() {
  var acts = actions();
  if (acts.length !== 0) return false;
  var point = 0;
  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      point += board[x][y];
    }
  }

  if (point > 0) {
    if (confirm("You lose. Do you want to start a new game?")) initial_board();
  } else {
    if (confirm("You WIN. Do you want to start a new game?")) initial_board();
  }
  return true;
}

function deepcopy(obj) {
  var out = [],
    i = 0,
    len = obj.length;
  for (; i < len; i++) {
    if (obj[i] instanceof Array) {
      out[i] = deepcopy(obj[i]);
    } else out[i] = obj[i];
  }
  return out;
}
