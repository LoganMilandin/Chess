//////GLOBAL VARIABLE DECLARATIONS/////////////////////
let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
const BOARD_WIDTH = canvas.width;
let squares; //USE [column][row] INDEXING TO ACCESS ARRAY SQUARES
let pieces;

//SUPERCLASS DECLARATIONS/////////////////////////
class Piece {
	constructor(x, y, team, type) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.team = team;
		this.isClicked = false;
	}
	draw() {
		context.fillStyle = '#ff0000';
		if (this.isClicked) {
			var boardWidth = window.innerHeight * .8;
			var leftEdgeOfBoard = window.innerWidth / 2 - boardWidth / 2;
			var rightEdgeOfBoard = window.innerWidth / 2 + boardWidth / 2;
			var topOfBoard = window.innerHeight / 2 - boardWidth / 2;
			var bottomOfBoard = window.innerHeight / 2 + boardWidth / 2;
			var xVal = (mouse.x - leftEdgeOfBoard) / boardWidth * 8;
			var yVal = (mouse.y - topOfBoard) / boardWidth * 8;
			console.log(xVal);
			
			context.fillRect(xVal * BOARD_WIDTH / 8 - BOARD_WIDTH / 32, yVal * BOARD_WIDTH / 8 - BOARD_WIDTH / 32, BOARD_WIDTH / 16, BOARD_WIDTH / 16);
		}
		else {
			context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 16, BOARD_WIDTH / 16);
		}
	}
}

class Square {
	constructor() {
		this.piece = null;
	}
	isOccupied() {
		return this.piece != null;
	}
	
}





//PIECE SUBCLASS DECLARATIONS///////////////////////////////////////
class Bishop extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
}

class King extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
}

class Knight extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
}

class Pawn extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	
}

class Queen extends Piece {
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	
}

class Rook extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	
}






/////CLICK AND DRAG IMPLEMENTATION////////////////////////////////////////////////////
var mouse = {
		x: undefined,
		y: undefined,
		hasPiece: false,
		piece: null
}

canvas.addEventListener('mousemove', event => {
	mouse.x = event.x;
	mouse.y = event.y;
})
canvas.addEventListener('click', event => {
	currentX = mouse.x;
	currentY = mouse.y;
	var indices = findClickedSquareIndices(currentX, currentY);
	var clickedSquare = squares[indices[0]][indices[1]];
	if (mouse.hasPiece) {
		if (clickedSquare.piece == null) {
			mouse.piece.x = indices[0];
			mouse.piece.y = indices[1];
			clickedSquare.piece = mouse.piece;
			clickedSquare.piece.isClicked = false;
			mouse.piece = null;
			mouse.hasPiece = false;
		}
	}
	else {
		if (clickedSquare.piece != null) {
			clickedSquare.piece.isClicked = true;
			mouse.piece = clickedSquare.piece;
			mouse.hasPiece = true;
			clickedSquare.piece = null;
		}
		
	}
	
	
	

})
function findClickedSquareIndices(currentX, currentY) {
	var middleX = window.innerWidth / 2;
	var middleY = window.innerHeight / 2;
	var boardWidth = window.innerHeight * .8;
	var leftEdgeOfBoard = middleX - boardWidth / 2;
	var rightEdgeOfBoard = middleX + boardWidth / 2;
	var topOfBoard = middleY - boardWidth / 2;
	var bottomOfBoard = middleY + boardWidth / 2;
	
	
	
	
	var columnClicked = 0;
	for (var i = leftEdgeOfBoard + boardWidth / 16; i < rightEdgeOfBoard; i += boardWidth / 8) {
		if (currentX > (i - boardWidth / 16) && currentX < (i + boardWidth / 16)) {
			break;
		}
		else{
			columnClicked++;
		}
	}
	
	
	var rowClicked = 0;
	for (var i = topOfBoard + boardWidth / 16; i < bottomOfBoard; i += boardWidth / 8) {
		if (currentY > (i - boardWidth / 16) && currentY < (i + boardWidth / 16)) {
			break;
		}
		else{
			rowClicked++;
		}
	}
	return [columnClicked, rowClicked];
}



//GAME INITIALIZATION/////////////////////////////////
function drawBoard() {
	context.fillStyle = "#000";
	context.fillRect(0, 0, BOARD_WIDTH, BOARD_WIDTH);
	context.fillStyle = '#fff';
	for(i = 0; i < 4; i++) {
		for(j = 0; j < 4; j++) {
			context.fillRect(i * BOARD_WIDTH / 4, j * BOARD_WIDTH / 4, BOARD_WIDTH / 8, BOARD_WIDTH / 8);
			context.fillRect(i * BOARD_WIDTH / 4 + BOARD_WIDTH / 8, j * BOARD_WIDTH / 4 + BOARD_WIDTH / 8, BOARD_WIDTH / 8, BOARD_WIDTH / 8);
		}
	}
}

function initializePieces() {
	let pieces = [];
	pieces.push(b1 = new Rook(0, 0, 'black', 'rook'));
	pieces.push(b2 = new Knight(1, 0, 'black', 'knight'));
	pieces.push(b3 = new Bishop(2, 0, 'black', 'bishop'));
	pieces.push(b4 = new Queen(3, 0, 'black', 'queen'));
	pieces.push(b5 = new King(4, 0, 'black', 'king'));
	pieces.push(b6 = new Bishop(5, 0, 'black', 'bishop'));
	pieces.push(b7 = new Knight(6, 0, 'black', 'knight'));
	pieces.push(b8 = new Rook(7, 0, 'black', 'rook'));
	pieces.push(b9 = new Pawn(0, 1, 'black', 'pawn'));
	pieces.push(b10 = new Pawn(1, 1, 'black', 'pawn'));
	pieces.push(b11 = new Pawn(2, 1, 'black', 'pawn'));
	pieces.push(b12 = new Pawn(3, 1, 'black', 'pawn'));
	pieces.push(b13 = new Pawn(4, 1, 'black', 'pawn'));
	pieces.push(b14 = new Pawn(5, 1, 'black', 'pawn'));
	pieces.push(b15 = new Pawn(6, 1, 'black', 'pawn'));
	pieces.push(b16 = new Pawn(7, 1, 'black', 'pawn'));
	
	pieces.push(w1 = new Rook(0, 7, 'white', 'rook'));
	pieces.push(w2 = new Knight(1, 7, 'white', 'knight'));
	pieces.push(w3 = new Bishop(2, 7, 'white', 'bishop'));
	pieces.push(w4 = new Queen(3, 7, 'white', 'queen'));
	pieces.push(w5 = new King(4, 7, 'white', 'king'));
	pieces.push(w6 = new Bishop(5, 7, 'white', 'bishop'));
	pieces.push(w7 = new Knight(6, 7, 'white', 'knight'));
	pieces.push(w8 = new Rook(7, 7, 'white', 'rook'));
	pieces.push(w9 = new Pawn(0, 6, 'white', 'pawn'));
	pieces.push(w10 = new Pawn(1, 6, 'white', 'pawn'));
	pieces.push(w11 = new Pawn(2, 6, 'white', 'pawn'));
	pieces.push(w12 = new Pawn(3, 6, 'white', 'pawn'));
	pieces.push(w13 = new Pawn(4, 6, 'white', 'pawn'));
	pieces.push(w14 = new Pawn(5, 6, 'white', 'pawn'));
	pieces.push(w15 = new Pawn(6, 6, 'white', 'pawn'));
	pieces.push(w16 = new Pawn(7, 6, 'white', 'pawn'));
	return pieces;
}

function initializeSquares() {
	let squares = [[], [], [], [], [], [], [], []];
	squares.forEach(subArray => {
		for (var i = 0; i < 8; i++) {
			subArray.push(new Square());
		}
	});
	return squares;
}
function drawFrame() {
	drawBoard();
	pieces.forEach(piece => piece.draw());
}
function startGame() {
	pieces = initializePieces();
	squares = initializeSquares();
	pieces.forEach(thisPiece => {
		squares[thisPiece.x][thisPiece.y].piece = thisPiece;
	});
	squares.forEach(s => {
		s.forEach(a => {
		});
	});
	//begin animation loop here
	animate();
}
function animate() {
	requestAnimationFrame(animate);
	drawFrame();
	//console.log(b1.isClicked + "   " + mouse.hasPiece + "    " + mouse.piece + "    " + squares[0][0].piece);
}

$(document).ready(function() {
	startGame();
});

