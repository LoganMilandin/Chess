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
				canMoveTo = true;
			}
		});
		return canMoveTo;
	}
	drawAvailableMoves() {
		context.fillStyle = 'rgba(40, 200, 0, .4)';
		this.availableMoves.forEach(indexPair => {
			if (!(indexPair[0] == this.x && indexPair[1] == this.y)) {
				context.fillRect(indexPair[0] * BOARD_WIDTH / 8, indexPair[1] * BOARD_WIDTH / 8, BOARD_WIDTH / 8, BOARD_WIDTH / 8);
			}
		});
	}
	draw(imageSource) {
		if (this.isClicked) {
			var boardWidth = window.innerHeight * .8;
			var leftEdgeOfBoard = window.innerWidth / 2 - boardWidth / 2;
			var rightEdgeOfBoard = window.innerWidth / 2 + boardWidth / 2;
			var topOfBoard = window.innerHeight / 2 - boardWidth / 2;
			var bottomOfBoard = window.innerHeight / 2 + boardWidth / 2;
			var xVal = (mouse.x - leftEdgeOfBoard) / boardWidth * 8;
			var yVal = (mouse.y - topOfBoard) / boardWidth * 8;
			var drawing = new Image();
			drawing.src = imageSource;
			context.drawImage(drawing, xVal * BOARD_WIDTH / 8 - BOARD_WIDTH * 3 / 64, yVal * BOARD_WIDTH / 8 - BOARD_WIDTH * 3 / 64, BOARD_WIDTH * 3 / 32, BOARD_WIDTH * 3 / 32);

		}
		else {
			var drawing = new Image();
			drawing.src = imageSource;
			context.drawImage(drawing, this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 64, this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 64, BOARD_WIDTH * 3 / 32, BOARD_WIDTH * 3 / 32);
		}
	}
}

class Square {
	constructor(x, y) {
		this.piece = null;
		this.x = x;
		this.y = y;
	}
	isOccupied() {
		return this.piece != null;
	}
	isThreatened(team) {
		function checkLane(square, direction, team) {
			if (square.isOccupied()) {
				if (direction < 4) {
					if ((square.piece.type === 'rook' || square.piece.type === 'queen') && square.piece.team != team) {
						console.log(team);
						console.log(square.x + ', ' + square.y + ': ' + square.piece.team + square.piece.type);
						return false;
					}
				} else {
					if ((square.piece.type === 'bishop' || square.piece.type === 'queen') && square.piece.team != team) {
						console.log(team);
						console.log('X, ' + square.piece.team + square.piece.type);
						return false;
					}
				}
				return true;
			}
			switch (direction) {
				case 0:
				case 4:
				case 7:
					if (square.y < 1)
						return true;
				case 1:
				case 4:
				case 5:
					if (square.x > 6)
						return true;
				case 2:
				case 5:
				case 6:
					if (square.y > 6)
						return true;
				case 3:
				case 6:
				case 7:
					if (square.x < 1)
						return true;
			}
			switch (direction) {
				case 0: return checkLane(squares[square.x][square.y - 1], direction, team);
				case 1: return checkLane(squares[square.x + 1][square.y], direction, team);
				case 2: return checkLane(squares[square.x][square.y + 1], direction, team);
				case 3: return checkLane(squares[square.x - 1][square.y], direction, team);
				case 4: return checkLane(squares[square.x + 1][square.y - 1], direction, team);
				case 5: return checkLane(squares[square.x + 1][square.y + 1], direction, team);
				case 6: return checkLane(squares[square.x - 1][square.y + 1], direction, team);
				case 7: return checkLane(squares[square.x - 1][square.y - 1], direction, team);
			}
		}
		for (let i = 0; i < 8; i++) {
			if(!checkLane(squares[this.x][this.y], i, team)) {
				return true;
			}
		}
		return false;
	}
}





//PIECE SUBCLASS DECLARATIONS///////////////////////////////////////
class Bishop extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	draw() {
		if (this.team == 1) {
			super.draw('blackBishop.png');
		}
		else {
			super.draw('whiteBishop.png');
		}
	}
    findAvailableMoves() {
        let squaresToCheck1 = [];
        let squaresToCheck2 = [];
        let squaresToCheck3 = [];
        let squaresToCheck4 = [];
        for (var i = 1; i < 8; i++) {
            squaresToCheck1.push([this.x + i, this.y + i]);
            squaresToCheck2.push([this.x - i, this.y - i]);
            squaresToCheck3.push([this.x - i, this.y + i]);
            squaresToCheck4.push([this.x + i, this.y - i]);
        }

        this.bishHelper(false, squaresToCheck1);
        this.bishHelper(false, squaresToCheck2);
        this.bishHelper(false, squaresToCheck3);
        this.bishHelper(false, squaresToCheck4);
        this.availableMoves.push([this.x, this.y]);
    }
    bishHelper(blocked, squares1) {
        squares1.forEach(square => {
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

class King extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	draw() {
		if (this.team == 1) {
			super.draw('blackKing.png');
		}
		else {
			super.draw('whiteKing.png');
		}
	}
	findAvailableMoves() {
		console.log('\n\nchecking for King moves...');
		this.availableMoves.push([[this.x], [this.y]]);
		let squaresToCheck = [
			[this.x, this.y - 1],
			[this.x + 1, this.y - 1],
			[this.x + 1, this.y],
			[this.x + 1, this.y + 1],
			[this.x, this.y + 1],
			[this.x - 1, this.y + 1],
			[this.x - 1, this.y],
			[this.x - 1, this.y - 1],
			
		];
		squaresToCheck.forEach((square) => {
			if (square[0] < 0 || square[1] < 0 || square[0] > 7 || square[1] > 7) {
				console.log('dne');
				return;
			}else if (squares[square[0]][square[1]].isOccupied()) {
				console.log('full');
				return;
			} else if (!squares[square[0]][square[1]].isThreatened(this.team)) {
				console.log('safe');
				this.availableMoves.push(square);
			}
		});
		
	}
}

class Knight extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
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
		this.availableMoves.push([this.x, this.y]);
	}
	draw() {
		if (this.team == 1) {
			super.draw('blackKnight.png');
		}
		else {
			super.draw('whiteKnight.png');
		}
	}
}

class Pawn extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
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
	draw() {
		if (this.team == 1) {
			super.draw('blackPawn.png');
		}
		else {
			super.draw('whitePawn.png');
		}
	}
}
class Queen extends Piece {
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	draw() {
		if (this.team == 1) {
			super.draw('blackQueen.png');
		}
		else {
			super.draw('whiteQueen.png');
		}
	}
    findAvailableMoves() {
        let squaresToCheck1 = [];
        let squaresToCheck2 = [];
        let squaresToCheck3 = [];
        let squaresToCheck4 = [];
        let squaresToCheck5 = [];
        let squaresToCheck6 = [];
        let squaresToCheck7 = [];
        let squaresToCheck8 = [];
        for (var i = 1; i < 8; i++) {
            squaresToCheck1.push([this.x + i, this.y + i]);
            squaresToCheck2.push([this.x - i, this.y - i]);
            squaresToCheck3.push([this.x - i, this.y + i]);
            squaresToCheck4.push([this.x + i, this.y - i]);
            squaresToCheck5.push([this.x + i, this.y]);
            squaresToCheck6.push([this.x - i, this.y]);
            squaresToCheck7.push([this.x, this.y + i]);
            squaresToCheck8.push([this.x, this.y - i]);

        }

        this.queenHelper(false, squaresToCheck1);
        this.queenHelper(false, squaresToCheck2);
        this.queenHelper(false, squaresToCheck3);
        this.queenHelper(false, squaresToCheck4);
        this.queenHelper(false, squaresToCheck5);
        this.queenHelper(false, squaresToCheck6);
        this.queenHelper(false, squaresToCheck7);
        this.queenHelper(false, squaresToCheck8);
        this.availableMoves.push([this.x, this.y]);
    }
    queenHelper(blocked, squares1) {
        squares1.forEach(square => {
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

class Rook extends Piece{
	constructor(x, y, team, type) {
		super(x, y, team, type);
	}
	draw() {
		if (this.team == 1) {
			super.draw('blackRook.png');
		}
		else {
			super.draw('whiteRook.png');
		}
	}
	findAvailableMoves() {
        let squaresToCheck1 = [];
        let squaresToCheck2 = [];
        let squaresToCheck3 = [];
        let squaresToCheck4 = [];
        for (var i = 1; i < 8; i++) {
            squaresToCheck1.push([this.x + i, this.y]);
            squaresToCheck2.push([this.x - i, this.y]);
            squaresToCheck3.push([this.x, this.y + i]);
            squaresToCheck4.push([this.x, this.y - i]);
        }

        this.rookHelper(false, squaresToCheck1);
        this.rookHelper(false, squaresToCheck2);
        this.rookHelper(false, squaresToCheck3);
        this.rookHelper(false, squaresToCheck4);
        this.availableMoves.push([this.x, this.y]);
    }

    rookHelper(blocked, squares1) {
        squares1.forEach(square => {
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
		if ((clickedSquare.piece == null || clickedSquare.piece.team != mouse.piece.team) && mouse.piece.canMoveTo(indices[0], indices[1])) {
			if (indices[0] == mouse.piece.startingX && indices[1] == mouse.piece.startingY && mouse.piece.hasMoved == false) {
				mouse.piece.hasMoved = false;
			}
			else {
				mouse.piece.hasMoved = true;
			}
			mouse.piece.x = indices[0];
			mouse.piece.y = indices[1];
			if (clickedSquare.piece != null) {
				deadPieces.push(pieces.splice(pieces.indexOf(clickedSquare.piece), 1));
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
	context.fillStyle = "#252525";
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
	pieces.push(b1 = new Rook(0, 0, 1, 'rook'));
	pieces.push(b2 = new Knight(1, 0, 1, 'knight'));
	pieces.push(b3 = new Bishop(2, 0, 1, 'bishop'));
	pieces.push(b4 = new Queen(3, 0, 1, 'queen'));
	pieces.push(b5 = new King(4, 0, 1, 'king'));
	pieces.push(b6 = new Bishop(5, 0, 1, 'bishop'));
	pieces.push(b7 = new Knight(6, 0, 1, 'knight'));
	pieces.push(b8 = new Rook(7, 0, 1, 'rook'));
	pieces.push(b9 = new Pawn(0, 1, 1, 'pawn'));
	pieces.push(b10 = new Pawn(1, 1, 1, 'pawn'));
	pieces.push(b11 = new Pawn(2, 1, 1, 'pawn'));
	pieces.push(b12 = new Pawn(3, 1, 1, 'pawn'));
	pieces.push(b13 = new Pawn(4, 1, 1, 'pawn'));
	pieces.push(b14 = new Pawn(5, 1, 1, 'pawn'));
	pieces.push(b15 = new Pawn(6, 1, 1, 'pawn'));
	pieces.push(b16 = new Pawn(7, 1, 1, 'pawn'));
	
	pieces.push(w1 = new Rook(0, 7, -1, 'rook'));
	pieces.push(w2 = new Knight(1, 7, -1, 'knight'));
	pieces.push(w3 = new Bishop(2, 7, -1, 'bishop'));
	pieces.push(w4 = new Queen(3, 7, -1, 'queen'));
	pieces.push(w5 = new King(4, 7, -1, 'king'));
	pieces.push(w6 = new Bishop(5, 7, -1, 'bishop'));
	pieces.push(w7 = new Knight(6, 7, -1, 'knight'));
	pieces.push(w8 = new Rook(7, 7, -1, 'rook'));
	pieces.push(w9 = new Pawn(0, 6, -1, 'pawn'));
	pieces.push(w10 = new Pawn(1, 6, -1, 'pawn'));
	pieces.push(w11 = new Pawn(2, 6, -1, 'pawn'));
	pieces.push(w12 = new Pawn(3, 6, -1, 'pawn'));
	pieces.push(w13 = new Pawn(4, 6, -1, 'pawn'));
	pieces.push(w14 = new Pawn(5, 6, -1, 'pawn'));
	pieces.push(w15 = new Pawn(6, 6, -1, 'pawn'));
	pieces.push(w16 = new Pawn(7, 6, -1, 'pawn'));
	return pieces;
}

function initializeSquares() {
	let squares = [[], [], [], [], [], [], [], []];
	squares.forEach(subArray => {
		for (var i = 0; i < 8; i++) {
			subArray.push(new Square(squares.indexOf(subArray), i));
		}
	});
	return squares;
}

function drawFrame() {
	drawBoard();
	if (mouse.hasPiece) {
		mouse.piece.drawAvailableMoves();
	}
	pieces.forEach(piece => piece.draw("Chess_ndt60.png"));
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
}

$(document).ready(function() {
	startGame();
});