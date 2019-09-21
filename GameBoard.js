//////GLOBAL VARIABLE DECLARATIONS/////////////////////
var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
const BOARD_WIDTH = canvas.width;
var squares; //USE [column][row] INDEXING TO ACCESS ARRAY SQUARES
var deadPieces = [];
var pieces;
var pieceDict; 
var isPromoting = false;
var promotingPiece = null;
var whitePromoMenu = document.getElementById('whitePromotion');
var blackPromoMenu = document.getElementById('blackPromotion');

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

        let seenSquares = [[]];
		this.availableMoves.push([this.x, this.y])
        seenSquares = this.bishHelper(squaresToCheck1, seenSquares);
        seenSquares = this.bishHelper(squaresToCheck2, seenSquares);
        seenSquares = this.bishHelper(squaresToCheck3, seenSquares);
        seenSquares = this.bishHelper(squaresToCheck4, seenSquares);
		return seenSquares;
    }
    bishHelper(squares1, seenSquares) {
		let result = seenSquares;
		let blocked = false;
		let blockedByKing = false;
        for (let i = 0; i < squares1.length; i++) {
			if (squares1[i][0] > -1 && squares1[i][0] < 8 && squares1[i][1] > -1 && squares1[i][1] < 8) {
                if (squares[squares1[i][0]][squares1[i][1]].isOccupied() && !blocked) {
                    if (squares[squares1[i][0]][squares1[i][1]].piece.team != this.team) {
                        this.availableMoves.push(squares1[i]);
                    }
					result.push(squares1[i]);
					blocked = true;
					if (squares[squares1[i][0]][squares1[i][1]].piece.type === 'king' && 
						squares[squares1[i][0]][squares1[i][1]].piece.team != this.team) {
							blockedByKing = true;
					}
                } else if (!blocked){
                    this.availableMoves.push(squares1[i]);
					result.push(squares1[i]);
                } else if (blockedByKing) {
					result.push(squares1[i]);
				}
            }
		}
		return result;
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
		let start = performance.now();
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
		squaresToCheck.forEach(square => {
			if (square[0] > -1 && square[0] < 8 && square[1] > -1 && square[1] < 8) {
				let mySquare = squares[square[0]][square[1]];
				if (this.noThreat(square, this.team) && ((mySquare.isOccupied() && mySquare.piece.team != this.team) 
					|| (!mySquare.isOccupied()))) {
					this.availableMoves.push(square);
				}
			}
		})
		let finalTime = performance.now() - start;
		//console.log(finalTime);
	}
	noThreat(square, team) {
		return (!this.pawnThreat(square, team) && !this.rookThreat(square, team) && !this.knightThreat(square, team)
				&& !this.bishopThreat(square, team) && !this.queenThreat(square, team) && !this.kingThreat(square, team));
	}
	pawnThreat(square, team) {
		if (team === -1) {
			if (square[0] - 1 > -1 && square[1] - 1 > -1) {
				let pawnSquare = squares[square[0]-1][square[1]-1];
				if (pawnSquare.piece != null) {
					if (pawnSquare.piece.type === "pawn" && pawnSquare.piece.team === 1) {
						return true;
					}
				}
			}
			if (square[0] + 1 < 8 && square[1] - 1 > -1) {
				let pawnSquare = squares[square[0]+1][square[1]-1];
				if (pawnSquare.piece != null) {
					if (pawnSquare.piece.type === "pawn" && pawnSquare.piece.team === 1) {
						return true;
					}
				}
			}
		} else {
			if (square[0] - 1 > -1 && square[1] + 1 < 8) {
				let pawnSquare = squares[square[0]-1][square[1]+1];
				if (pawnSquare.piece != null) {
					if (pawnSquare.piece.type === "pawn" && pawnSquare.piece.team === -1) {
						return true;
					}
				}
			}
			if (square[0] + 1 < 8 && square[1] + 1 < 8) {
				let pawnSquare = squares[square[0]+1][square[1]+1];
				if (pawnSquare.piece != null) {
					if (pawnSquare.piece.type === "pawn" && pawnSquare.piece.team === -1) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	rookThreat(square, team) {
		return this.threatHelper(square, team, 'rook');
	}
	
	knightThreat(square, team) {
		return this.threatHelper(square, team, 'knight');
	}
	
	bishopThreat(square, team) {
		return this.threatHelper(square, team, 'bishop');
	}
	
	queenThreat(square, team) {
		return this.threatHelper(square, team, 'queen');
	}
	
	kingThreat(square, team) {
		let squaresToCheck = [
			[square[0], square[1] - 1],
			[square[0] + 1, square[1] - 1],
			[square[0] + 1, square[13]],
			[square[0] + 1, square[1] + 1],
			[square[0], square[1] + 1],
			[square[0] - 1, square[1] + 1],
			[square[0] - 1, square[1]],
			[square[0] - 1, square[1] - 1],
		];
		
		for(let i = 0; i < squaresToCheck.length; i++) {
			if (squaresToCheck[i][0] > -1 && squaresToCheck[i][0] < 8 && 
				squaresToCheck[i][1] > -1 && squaresToCheck[i][1] < 8) {
				let mySquare = squares[squaresToCheck[i][0]][squaresToCheck[i][1]];
				if (mySquare.isOccupied()) {
					if (mySquare.piece.type === 'king' && mySquare.piece.team != team) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	threatHelper(square, team, pieceType) {
		let threat = false;
		pieces.forEach(piece => {
			if (!threat && piece.type === pieceType && piece.team != team) {
				let coveredSquares = piece.findAvailableMoves();
				coveredSquares.forEach(coveredSquare => {
					if (coveredSquare[0] === square[0] && coveredSquare[1] === square[1]) {
						threat = true;
					}
				})
			}
		})
		return threat;
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
		let seenSquares = [];
		squaresToCheck.forEach(square => {
			if (square[0] > -1 && square[0] < 8 && square[1] > -1 && square[1] < 8) {
				if (squares[square[0]][square[1]].isOccupied()) {
					if (squares[square[0]][square[1]].piece.team != this.team) {
						this.availableMoves.push(square);
					}
				} else {
					this.availableMoves.push(square);
				}
				seenSquares.push(square);
			}
		})
		this.availableMoves.push([this.x, this.y]);
		return seenSquares;
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
		if (this.y > 0 && this.y < 7 && squares[this.x][this.y + this.team].piece == null) {
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
		let seenSquares = [[]];
		this.availableMoves.push([this.x, this.y])
        seenSquares = this.queenHelper(squaresToCheck1, seenSquares);
        seenSquares = this.queenHelper(squaresToCheck2, seenSquares);
        seenSquares = this.queenHelper(squaresToCheck3, seenSquares);
        seenSquares = this.queenHelper(squaresToCheck4, seenSquares);
        seenSquares = this.queenHelper(squaresToCheck5, seenSquares);
        seenSquares = this.queenHelper(squaresToCheck6, seenSquares);
        seenSquares = this.queenHelper(squaresToCheck7, seenSquares);
        seenSquares = this.queenHelper(squaresToCheck8, seenSquares);
		return seenSquares;
    }
    queenHelper(squares1, seenSquares) {
		let result = seenSquares;
		let blocked = false;
		let blockedByKing = false;
        for (let i = 0; i < squares1.length; i++) {
			if (squares1[i][0] > -1 && squares1[i][0] < 8 && squares1[i][1] > -1 && squares1[i][1] < 8) {
                if (squares[squares1[i][0]][squares1[i][1]].isOccupied() && !blocked) {
                    if (squares[squares1[i][0]][squares1[i][1]].piece.team != this.team) {
                        this.availableMoves.push(squares1[i]);
                    }
					result.push(squares1[i]);
					blocked = true;
					if (squares[squares1[i][0]][squares1[i][1]].piece.type === 'king' && 
						squares[squares1[i][0]][squares1[i][1]].piece.team != this.team) {
							blockedByKing = true;
					}
                } else if (!blocked){
                    this.availableMoves.push(squares1[i]);
					result.push(squares1[i]);
                } else if (blockedByKing) {
					result.push(squares1[i]);
				}
            }
		}
		return result;
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

        let seenSquares = [];
		this.availableMoves.push([this.x, this.y])
        seenSquares = this.rookHelper(squaresToCheck1, seenSquares);
        seenSquares = this.rookHelper(squaresToCheck2, seenSquares);
        seenSquares = this.rookHelper(squaresToCheck3, seenSquares);
        seenSquares = this.rookHelper(squaresToCheck4, seenSquares);
		return seenSquares;
    }

    rookHelper(squares1, seenSquares) {
		let result = seenSquares;
		let blocked = false;
		let blockedByKing = false;
        for (let i = 0; i < squares1.length; i++) {
			if (squares1[i][0] > -1 && squares1[i][0] < 8 && squares1[i][1] > -1 && squares1[i][1] < 8) {
                if (squares[squares1[i][0]][squares1[i][1]].isOccupied() && !blocked) {
                    if (squares[squares1[i][0]][squares1[i][1]].piece.team != this.team) {
                        this.availableMoves.push(squares1[i]);
                    }
					result.push(squares1[i]);
					blocked = true;
					if (squares[squares1[i][0]][squares1[i][1]].piece.type === 'king' && 
						squares[squares1[i][0]][squares1[i][1]].piece.team != this.team) {
							blockedByKing = true;
					}
                } else if (!blocked){
                    this.availableMoves.push(squares1[i]);
					result.push(squares1[i]);
                } else if (blockedByKing) {
					result.push(squares1[i]);
				}
            }
		}
		return result;
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
	console.log(indices);
	var clickedSquare = squares[indices[0]][indices[1]];
	if (mouse.hasPiece && !isPromoting) {
		console.log("hi");
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
			//PIECE PROMOTING
			
			//
			if (indices[1] == 0 && clickedSquare.piece.type == 'pawn' && clickedSquare.piece.hasMoved) {
				whitePromoMenu.style.display = "inline";
				isPromoting = true;
				promotingPiece = clickedSquare.piece;
				//console.log(whitePromoMenu.style.display);
			}
			if (indices[1] == 7 && clickedSquare.piece.type == 'pawn' && clickedSquare.piece.hasMoved) {
				blackPromoMenu.style.display = "inline";
				isPromoting = true;
				promotingPiece = clickedSquare.piece;
				//console.log(whitePromoMenu.style.display);
			}
		}
	}
	else if (!mouse.hasPiece && !isPromoting){
		if (clickedSquare.piece != null) {
			clickedSquare.piece.isClicked = true;
			console.log(clickedSquare.piece);
			clickedSquare.piece.findAvailableMoves();
			mouse.piece = clickedSquare.piece;
			mouse.hasPiece = true;
			clickedSquare.piece = null;
		}
		
	}
	else if (isPromoting) {
		
	}
	
})
function promotePiece(team, type) {
	
	let promoteTo;
	
	switch(type) {
		case 'rook':
			promoteTo = new Rook(promotingPiece.x, promotingPiece.y, team, type);
			break;
		case 'knight':
			promoteTo = new Knight(promotingPiece.x, promotingPiece.y, team, type);
			break;
		case 'bishop':
			promoteTo = new Bishop(promotingPiece.x, promotingPiece.y, team, type);
			break;
		case 'queen':
			promoteTo = new Queen(promotingPiece.x, promotingPiece.y, team, type);
			break;
		case 'pawn':
			promoteTo = new Pawn(promotingPiece.x, promotingPiece.y, team, type);
			break;
	}

	pieces.push(promoteTo);
	pieces.splice(pieces.indexOf(promotingPiece), 1);
	squares[promotingPiece.x][promotingPiece.y].piece = promoteTo;
	isPromoting = false;
	promotingPiece = null;
	whitePromoMenu.style.display = 'none';
	blackPromoMenu.style.display = 'none';
	
}
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
	context.fillStyle = "#555";
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