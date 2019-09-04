//////GLOBAL VARIABLE DECLARATIONS/////////////////////
let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
const BOARD_WIDTH = canvas.width;
let squares; //USE [column][row] INDEXING TO ACCESS ARRAY SQUARES
let pieces;
let deadPieces = [];

//SUPERCLASS DECLARATIONS/////////////////////////
class Piece {
	//for easy directionality in the find available moves methods, the black team will have team value 1 and the white team will have team value -1
	constructor(x, y, team, type) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.startingX = x;
		this.startingY = y;
		this.team = team;
		this.isClicked = false;
		this.availableMoves = [];
	}
	canMoveTo(x, y) {
		var canMoveTo = false;
		this.availableMoves.forEach(indexPair => {
			if (indexPair[0] == x && indexPair[1] == y) {
				console.log("return true");
				canMoveTo = true;
			}
		});
		return canMoveTo;
	}
	drawAvailableMoves() {
		context.fillStyle = '#c7f5a6';
		this.availableMoves.forEach(indexPair => {
			//console.log(indexPair);
			if (!(indexPair[0] == this.x && indexPair[1] == this.y)) {
				context.fillRect(indexPair[0] * BOARD_WIDTH / 8, indexPair[1] * BOARD_WIDTH / 8, BOARD_WIDTH / 8, BOARD_WIDTH / 8);
			}
		});
	}
	draw() {
		if (this.team == 1) {
			context.fillStyle = 'blue';
		}
		else {
			context.fillStyle = 'red';
		}
		if (this.isClicked) {
			var boardWidth = window.innerHeight * .8;
			var leftEdgeOfBoard = window.innerWidth / 2 - boardWidth / 2;
			var rightEdgeOfBoard = window.innerWidth / 2 + boardWidth / 2;
			var topOfBoard = window.innerHeight / 2 - boardWidth / 2;
			var bottomOfBoard = window.innerHeight / 2 + boardWidth / 2;
			var xVal = (mouse.x - leftEdgeOfBoard) / boardWidth * 8;
			var yVal = (mouse.y - topOfBoard) / boardWidth * 8;
			
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
	draw() {
	    super.draw();
        context.fillStyle = 'yellow';
        context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32 ,
        this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 32, BOARD_WIDTH / 32);
	}
}

class King extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	draw() {
        super.draw();
        context.fillStyle = 'white';
        context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32 ,
        this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 32, BOARD_WIDTH / 32);
    }
}

class Knight extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	draw() {
        super.draw();
        context.fillStyle = 'purple';
        context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32 ,
        this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 32, BOARD_WIDTH / 32);
    }
	findAvailableMoves() {
		let squaresToCheck = [[this.x + 2, this.y + 1],
							  [this.x + 2, this.y - 1],
							  [this.x + 1, this.y + 2],
							  [this.x + 1, this.y - 2],
							  [this.x - 2, this.y + 1],
							  [this.x - 2, this.y - 1],
							  [this.x - 1, this.y + 2],
							  [this.x - 1, this.y - 2]
		];
		squaresToCheck.forEach(square => {
			if (square[0] > -1 && square[0] < 8 && square[1] > -1 && square[1] < 8) {
				if (squares[square[0]][square[1]].isOccupied()) {

					if (squares[square[0]][square[1]].piece.team != this.team) {
						this.availableMoves.push(square);
					}
				} else {
					this.availableMoves.push(square);
				}
			}
		})
	}
}

class Pawn extends Piece{
	constructor(x, y, team, type, color) {
		super(x, y, team, type, color);
		this.hasMoved = false;
	}
	findAvailableAttacks() {
		var attack1 = null;
		var attackSquare1 = null;
		var attack2 = null;
		var attackSquare2 = null;
		if (this.x < 7) {
			attack1 = [this.x + 1, this.y + this.team];
			attackSquare1 = squares[attack1[0]][attack1[1]];
		}
		if (this.x > 0) {
			attack2 = [this.x - 1, this.y + this.team];
			attackSquare2 = squares[attack2[0]][attack2[1]];
		}
		
		if (attackSquare1 != null && attackSquare1.piece != null && attackSquare1.piece.team != this.team) {
			this.availableMoves.push(attack1);
		}
		if (attackSquare2 != null && attackSquare2.piece != null && attackSquare2.piece.team != this.team) {
			this.availableMoves.push(attack2);
		}
		
	}
	findAvailableMoves() {
		this.findAvailableAttacks();
		//if the square directly in front of the pawn is clear
		if (squares[this.x][this.y + this.team].piece == null) {
			this.availableMoves.push([this.x, this.y + this.team]);
			if (!this.hasMoved && squares[this.x][this.y + 2 * this.team].piece == null) {
				this.availableMoves.push([this.x, this.y + 2 * this.team]);
			}
		}
		this.availableMoves.push([this.x, this.y]);
	}
}
class Queen extends Piece {
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
    draw() {
        super.draw();
        context.fillStyle = 'black';
        context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32 ,
        this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 32, BOARD_WIDTH / 32);
    }
	
}

class Rook extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	draw() {
        super.draw();
        context.fillStyle = 'cyan';
        context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32 ,
        this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 32, BOARD_WIDTH / 32);
    }
    findAvailableMoves() {
        let squaresToCheck1 = [[this.x + 1, this.y],
                              [this.x + 2, this.y],
                              [this.x + 3, this.y],
                              [this.x + 4, this.y],
                              [this.x + 5, this.y],
                              [this.x + 6, this.y],
                              [this.x + 7, this.y]];
        let squaresToCheck2 = [[this.x - 1, this.y],
                              [this.x - 2, this.y],
                              [this.x - 3, this.y],
                              [this.x - 4, this.y],
                              [this.x - 5, this.y],
                              [this.x - 6, this.y],
                              [this.x - 7, this.y]];
        let squaresToCheck3 = [[this.x, this.y + 1],
                              [this.x, this.y + 2],
                              [this.x, this.y + 3],
                              [this.x, this.y + 4],
                              [this.x, this.y + 5],
                              [this.x, this.y + 6],
                              [this.x, this.y + 7]];
        let squaresToCheck4 = [[this.x, this.y - 1],
                              [this.x, this.y - 2],
                              [this.x, this.y - 3],
                              [this.x, this.y - 4],
                              [this.x, this.y - 5],
                              [this.x, this.y - 6],
                              [this.x, this.y - 7]];
        var blocked = false;
        squaresToCheck1.forEach(square => {
            if (square[0] > -1 && square[0] < 8 && square[1] > -1 && square[1] < 8 && !blocked) {
                if (squares[square[0]][square[1]].isOccupied()) {
                    if (squares[square[0]][square[1]].piece.team != this.team) {
                        this.availableMoves.push(square);
                    }
                    blocked = true;
                } else {
                    this.availableMoves.push(square);
                }
            }
        })
        blocked = false;
        squaresToCheck2.forEach(square => {
            if (square[0] > -1 && square[0] < 8 && square[1] > -1 && square[1] < 8 && !blocked) {
                if (squares[square[0]][square[1]].isOccupied()) {
                    if (squares[square[0]][square[1]].piece.team != this.team) {
                        this.availableMoves.push(square);
                    }
                    blocked = true;
                } else {
                    this.availableMoves.push(square);
                }
            }
        })
        blocked = false;
        squaresToCheck3.forEach(square => {
            if (square[0] > -1 && square[0] < 8 && square[1] > -1 && square[1] < 8 && !blocked) {
                if (squares[square[0]][square[1]].isOccupied()) {
                    if (squares[square[0]][square[1]].piece.team != this.team) {
                        this.availableMoves.push(square);
                    }
                    blocked = true;
                } else {
                    this.availableMoves.push(square);
                }
            }
        })
        blocked = false;
        squaresToCheck4.forEach(square => {
            if (square[0] > -1 && square[0] < 8 && square[1] > -1 && square[1] < 8 && !blocked) {
                if (squares[square[0]][square[1]].isOccupied()) {
                    if (squares[square[0]][square[1]].piece.team != this.team) {
                        this.availableMoves.push(square);
                    }
                    blocked = true;
                } else {
                    this.availableMoves.push(square);
                }
            }
        })
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
		console.log(clickedSquare.piece == null);
		console.log(mouse.piece.canMoveTo(indices[0], indices[1]));
		if ((clickedSquare.piece == null || clickedSquare.piece.team != mouse.piece.team) && mouse.piece.canMoveTo(indices[0], indices[1])) {
			console.log("working");
			if (indices[0] == mouse.piece.startingX && indices[1] == mouse.piece.startingY && mouse.piece.hasMoved == false) {
				mouse.piece.hasMoved = false;
			}
			else {
				mouse.piece.hasMoved = true;
			}
			//console.log(mouse.piece.hasMoved);
			mouse.piece.x = indices[0];
			mouse.piece.y = indices[1];
			if (clickedSquare.piece != null) {
				console.log(pieces.indexOf(clickedSquare.piece));
				deadPieces.push(pieces.splice(pieces.indexOf(clickedSquare.piece), 1));
				console.log(deadPieces);
			}
			clickedSquare.piece = mouse.piece;
			clickedSquare.piece.isClicked = false;
			clickedSquare.piece.availableMoves = [];
			mouse.piece = null;
			mouse.hasPiece = false;
		}
	}
	else {
		if (clickedSquare.piece != null) {
			clickedSquare.piece.isClicked = true;
			clickedSquare.piece.findAvailableMoves();
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
	pieces.push(b1 = new Rook(0, 0, 1, 'rook', 'red'));
	pieces.push(b2 = new Knight(1, 0, 1, 'knight', 'red'));
	pieces.push(b3 = new Bishop(2, 0, 1, 'bishop', 'red'));
	pieces.push(b4 = new Queen(3, 0, 1, 'queen', 'red'));
	pieces.push(b5 = new King(4, 0, 1, 'king', 'red'));
	pieces.push(b6 = new Bishop(5, 0, 1, 'bishop', 'red'));
	pieces.push(b7 = new Knight(6, 0, 1, 'knight', 'red'));
	pieces.push(b8 = new Rook(7, 0, 1, 'rook', 'red'));
	pieces.push(b9 = new Pawn(0, 1, 1, 'pawn', 'red'));
	pieces.push(b10 = new Pawn(1, 1, 1, 'pawn', 'red'));
	pieces.push(b11 = new Pawn(2, 1, 1, 'pawn', 'red'));
	pieces.push(b12 = new Pawn(3, 1, 1, 'pawn', 'red'));
	pieces.push(b13 = new Pawn(4, 1, 1, 'pawn', 'red'));
	pieces.push(b14 = new Pawn(5, 1, 1, 'pawn', 'red'));
	pieces.push(b15 = new Pawn(6, 1, 1, 'pawn', 'red'));
	pieces.push(b16 = new Pawn(7, 1, 1, 'pawn', 'red'));
	
	pieces.push(w1 = new Rook(0, 7, -1, 'rook', 'red'));
	pieces.push(w2 = new Knight(1, 7, -1, 'knight', 'red'));
	pieces.push(w3 = new Bishop(2, 7, -1, 'bishop', 'red'));
	pieces.push(w4 = new Queen(3, 7, -1, 'queen', 'red'));
	pieces.push(w5 = new King(4, 7, -1, 'king', 'red'));
	pieces.push(w6 = new Bishop(5, 7, -1, 'bishop', 'red'));
	pieces.push(w7 = new Knight(6, 7, -1, 'knight', 'red'));
	pieces.push(w8 = new Rook(7, 7, -1, 'rook', 'red'));
	pieces.push(w9 = new Pawn(0, 6, -1, 'pawn', 'red'));
	pieces.push(w10 = new Pawn(1, 6, -1, 'pawn', 'red'));
	pieces.push(w11 = new Pawn(2, 6, -1, 'pawn', 'red'));
	pieces.push(w12 = new Pawn(3, 6, -1, 'pawn', 'red'));
	pieces.push(w13 = new Pawn(4, 6, -1, 'pawn', 'red'));
	pieces.push(w14 = new Pawn(5, 6, -1, 'pawn', 'red'));
	pieces.push(w15 = new Pawn(6, 6, -1, 'pawn', 'red'));
	pieces.push(w16 = new Pawn(7, 6, -1, 'pawn', 'red'));
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
	if (mouse.hasPiece) {
		mouse.piece.drawAvailableMoves();
	}
	pieces.forEach(piece => piece.draw());
}

function startGame() {
	pieces = initializePieces();
	squares = initializeSquares();
	pieces.forEach(thisPiece => {
		squares[thisPiece.x][thisPiece.y].piece = thisPiece;
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