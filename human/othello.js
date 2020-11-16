var blackBackground;
var discLayer;
var canMoveLayer;
const gap = 2; //khoảng cách padding mỗi ô cờ
const sizeChess = 48; //kích thước chess
var turn = 1; //1 quân đen đi trước, 2 quân trắng đi trước
var gameOver = false;

var blackChessLabel;
var whiteChessLabel;
var newGame;

let checkSwapBlack = false;
let checkSwapWhite = false;

// 1 quân đen, 2 quân trắng
var discs = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 2, 1, 0, 0, 0],
	[0, 0, 0, 1, 2, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
];

var discsCache = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 2, 1, 0, 0, 0],
	[0, 0, 0, 1, 2, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
];

const marginTop = 50;
const marginLeft = 270;

window.onload = function () {
	blackBackground = document.getElementById("blackBackground");
	blackBackground.style.width = `${sizeChess * 8 + gap * 9}px`;
	blackBackground.style.height = `${sizeChess * 8 + gap * 9}px`;
	blackBackground.style.top = `${marginTop}px`;
	blackBackground.style.left = `${marginLeft}px`;

	discLayer = document.getElementById("discLayer");
	canMoveLayer = document.getElementById("canMoveLayer");
	blackChessLabel = document.getElementById("black");
	whiteChessLabel = document.getElementById("white");

	newGame = document.getElementById("new-game-human");
	newGame.addEventListener("click", function () {
		for (var row = 0; row < 8; row++) {
			for (var column = 0; column < 8; column++) {
				discs[row][column] = discsCache[row][column];
			}
		}
		turn = 1;
		drawGreenSquares();
		drawDiscs();
		drawCanMoveLayer();
		
	});

	drawGreenSquares();
	drawDiscs();
	drawCanMoveLayer();
};

//Vẽ bàn cờ
function drawGreenSquares() {
	//greenSquare vẽ từng ô vuông màu xanh
	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			var greenSquare = document.createElement("div");
			greenSquare.style.position = "absolute";
			greenSquare.style.width = `${sizeChess}px`;
			greenSquare.style.height = `${sizeChess}px`;
			greenSquare.style.backgroundColor = "#ECF1F3";
			greenSquare.style.left = `${(sizeChess + gap) * column + gap}px`;
			greenSquare.style.top = `${(sizeChess + gap) * row + gap}px`;
			greenSquare.setAttribute(
				"onclick",
				"clickSquare(" + row + "," + column + ")"
			);
			blackBackground.appendChild(greenSquare);
		}
	}
}

function clickSquare(row, column) {
	//Nếu đã đi rồi giá trị khác 0 thì không đi được nữa
	// if (gameOver) return;

	if (discs[row][column] != 0) return;

	if (canClickSpot(turn, row, column) == true) {
		var affectedDiscs = getAffectedDiscs(turn, row, column);
		flipDiscs(affectedDiscs);
		discs[row][column] = turn;

		if (turn == 1 && canMove(2)) turn = 2;
		else if (turn == 2 && canMove(1)) turn = 1;

		// if (canMove(1) == false && canMove(2) == false) {
		// 	alert("Game over");
		// 	gameOver = true;
		// }

		drawDiscs();
		drawCanMoveLayer();
		reDrawScore();
	}
}

function drawCanMoveLayer() {
	canMoveLayer.innerHTML = "";
	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			var value = discs[row][column];
			if (value == 0 && canClickSpot(turn, row, column)) {
				var hint = document.createElement("div");
				hint.style.position = "absolute";
				hint.style.width = `${sizeChess}px`;
				hint.style.height = `${sizeChess}px`;
				hint.style.left = `${(sizeChess + gap) * column + gap + marginLeft}px`;
				hint.style.top = `${(sizeChess + gap) * row + gap + marginTop}px`;
				hint.style.zIndex = 10;
				hint.style.display = "flex";
				hint.style.alignItems = "center";
				hint.style.justifyContent = "center";
				hint.setAttribute("onclick", "clickSquare(" + row + "," + column + ")");

				var dotHint = document.createElement("div");
				dotHint.style.height = "10px";
				dotHint.style.width = "10px";
				dotHint.style.borderRadius = "50%";
				if (turn == 1) {
					dotHint.style.backgroundColor = "black";
					hint.appendChild(dotHint);
				}
				if (turn == 2) {
					dotHint.style.backgroundColor = "white";
					dotHint.style.border = "1px solid black";
					hint.appendChild(dotHint);
				}
				canMoveLayer.appendChild(hint);
			}
		}
	}
}

function canMove(id) {
	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			if (canClickSpot(id, row, column)) {
				return true;
			}
		}
	}
	return false;
}

function reDrawScore() {
	var chessWhite = 0;
	var chessBlack = 0;

	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			var value = discs[row][column];
			if (value == 1) chessBlack += 1;
			else if (value == 2) chessWhite += 1;
		}
	}

	blackChessLabel.innerHTML = "Black: " + chessBlack;
	whiteChessLabel.innerHTML = "Black: " + chessWhite;
	checkSwapChess();
}

function checkSwapChess() {
	endGame();

	let numberCheck = 0;
	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			var value = discs[row][column];
			if (value == 0 && canClickSpot(turn, row, column)) {
				numberCheck += 1;
			}
		}
	}

	console.log(gameOver);
	if (gameOver == false) {
		if (numberCheck == 0) {
			let chessSwap = "";
			if (turn == 1) {
				turn = 2;
				chessSwap = "White";
				checkSwapBlack = true;
				drawCanMoveLayer();
				setTimeout(() => {
					alert(`${chessSwap} continue ! `);
				}, 100);
			} else if (turn == 2) {
				turn = 1;
				chessSwap = "Black";
				checkSwapWhite = true;
				drawCanMoveLayer();
				setTimeout(() => {
					alert(`${chessSwap} continue ! `);
				}, 100);
			}
		}
	}
}

function endGame() {
	if (checkSwapBlack && checkSwapWhite) {
		gameOver = true;
		setTimeout(() => {
			alert("Game over");
			location.reload();
		}, 100);
	}

	let countFillBroad = 0;
	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			var value = discs[row][column];
			if (value != 0) {
				countFillBroad += 1;
			}
		}
	}

	if (countFillBroad == 64) {
		gameOver = true;
		setTimeout(() => {
			alert("Game over");
			location.reload();
		}, 100);
	}
}

function canClickSpot(id, row, column) {
	var affectedDiscs = getAffectedDiscs(id, row, column);
	if (affectedDiscs.length == 0) return false;
	else return true;
}

function getAffectedDiscs(id, row, column) {
	var affectedDiscs = [];

	//to the right
	var couldBeAffected = [];
	var columnIterator = column;
	while (columnIterator < 7) {
		columnIterator += 1;
		var valueSpot = discs[row][columnIterator];
		if (valueSpot == 0 || valueSpot == id) {
			if (valueSpot == id) {
				affectedDiscs = affectedDiscs.concat(couldBeAffected);
			}
			break;
		} else {
			var discLocation = {
				row: row,
				column: columnIterator,
			};
			couldBeAffected.push(discLocation);
		}
	}

	//to the left
	var couldBeAffected = [];
	var columnIterator = column;
	while (columnIterator > 0) {
		columnIterator -= 1;
		var valueSpot = discs[row][columnIterator];
		if (valueSpot == 0 || valueSpot == id) {
			if (valueSpot == id) {
				affectedDiscs = affectedDiscs.concat(couldBeAffected);
			}
			break;
		} else {
			var discLocation = {
				row: row,
				column: columnIterator,
			};
			couldBeAffected.push(discLocation);
		}
	}

	//above
	var couldBeAffected = [];
	var rowIterator = row;
	while (rowIterator > 0) {
		rowIterator -= 1;
		var valueSpot = discs[rowIterator][column];
		if (valueSpot == 0 || valueSpot == id) {
			if (valueSpot == id) {
				affectedDiscs = affectedDiscs.concat(couldBeAffected);
			}
			break;
		} else {
			var discLocation = {
				row: rowIterator,
				column: column,
			};
			couldBeAffected.push(discLocation);
		}
	}

	//below
	var couldBeAffected = [];
	var rowIterator = row;
	while (rowIterator < 7) {
		rowIterator += 1;
		var valueSpot = discs[rowIterator][column];
		if (valueSpot == 0 || valueSpot == id) {
			if (valueSpot == id) {
				affectedDiscs = affectedDiscs.concat(couldBeAffected);
			}
			break;
		} else {
			var discLocation = {
				row: rowIterator,
				column: column,
			};
			couldBeAffected.push(discLocation);
		}
	}

	//down right
	var couldBeAffected = [];
	var rowIterator = row;
	var columnIterator = column;
	while (rowIterator < 7 && columnIterator < 7) {
		rowIterator += 1;
		columnIterator += 1;
		var valueSpot = discs[rowIterator][columnIterator];
		if (valueSpot == 0 || valueSpot == id) {
			if (valueSpot == id) {
				affectedDiscs = affectedDiscs.concat(couldBeAffected);
			}
			break;
		} else {
			var discLocation = {
				row: rowIterator,
				column: columnIterator,
			};
			couldBeAffected.push(discLocation);
		}
	}

	//down left
	var couldBeAffected = [];
	var rowIterator = row;
	var columnIterator = column;
	while (rowIterator < 7 && columnIterator > 0) {
		rowIterator += 1;
		columnIterator -= 1;
		var valueSpot = discs[rowIterator][columnIterator];
		if (valueSpot == 0 || valueSpot == id) {
			if (valueSpot == id) {
				affectedDiscs = affectedDiscs.concat(couldBeAffected);
			}
			break;
		} else {
			var discLocation = {
				row: rowIterator,
				column: columnIterator,
			};
			couldBeAffected.push(discLocation);
		}
	}

	//up left
	var couldBeAffected = [];
	var rowIterator = row;
	var columnIterator = column;
	while (rowIterator > 0 && columnIterator > 0) {
		rowIterator -= 1;
		columnIterator -= 1;
		var valueSpot = discs[rowIterator][columnIterator];
		if (valueSpot == 0 || valueSpot == id) {
			if (valueSpot == id) {
				affectedDiscs = affectedDiscs.concat(couldBeAffected);
			}
			break;
		} else {
			var discLocation = {
				row: rowIterator,
				column: columnIterator,
			};
			couldBeAffected.push(discLocation);
		}
	}

	//up right
	var couldBeAffected = [];
	var rowIterator = row;
	var columnIterator = column;
	while (rowIterator > 0 && columnIterator < 7) {
		rowIterator -= 1;
		columnIterator += 1;
		var valueSpot = discs[rowIterator][columnIterator];
		if (valueSpot == 0 || valueSpot == id) {
			if (valueSpot == id) {
				affectedDiscs = affectedDiscs.concat(couldBeAffected);
			}
			break;
		} else {
			var discLocation = {
				row: rowIterator,
				column: columnIterator,
			};
			couldBeAffected.push(discLocation);
		}
	}

	return affectedDiscs;
}

function flipDiscs(affectedDiscs) {
	for (var i = 0; i < affectedDiscs.length; i++) {
		var spot = affectedDiscs[i];
		if (discs[spot.row][spot.column] == 1) {
			discs[spot.row][spot.column] = 2;
		} else {
			discs[spot.row][spot.column] = 1;
		}
	}

	if (turn == 1) checkSwapBlack = false;
	if (turn == 2) checkSwapWhite = false;
}

//Vẽ quân cờ
function drawDiscs() {
	discLayer.innerHTML = "";
	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			var value = discs[row][column];
			if (value == 0) {
			} else {
				var disc = document.createElement("div");
				disc.style.position = "absolute";
				disc.style.width = `${sizeChess - 12}px`;
				disc.style.height = `${sizeChess - 12}px`;
				disc.style.margin = "auto auto";
				disc.style.left = `${
					(sizeChess + gap) * column + gap + 6 + marginLeft
				}px`;
				disc.style.top = `${(sizeChess + gap) * row + gap + 6 + marginTop}px`;
				disc.style.borderRadius = "50%";
				if (value == 1) {
					disc.style.backgroundColor = "black";
				}
				if (value == 2) {
					disc.style.backgroundColor = "white";
					disc.style.border = "1px solid black";
				}
				discLayer.appendChild(disc);
			}
		}
	}
}
