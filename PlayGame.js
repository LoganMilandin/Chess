// GLOBAL VARIABLES /////
let moves;
let currMove = null;
let moveInProgress = false;
let currPiece = null;
let currMoves = null;
class moveList {
	constructor() {
		this.front = null;
		this.back = null;
		this.size = 0;
	}
	
	add(move) {
		let thisMove = move;
		if (this.size === 0) {
			this.front = thisMove;
		} else if (this.size === 1){
			this.front.next = thisMove;
			thisMove.prev = this.front;
		} else {
			this.back.next = thisMove;
			thisMove.prev = this.back;
		}
		this.back = thisMove;
		this.size++;
	}
	
	removeLast() {
		if (this.size > 0) {
			if (this.size > 1) {
				this.back = this.back.prev;
				this.back.next = null;
			} else {
				this.front = null;
				this.back = null;
			}
			this.size--;
		}
	}
}
class move {
	constructor(moveNum, startSquare) {
		this.moveNum = moveNum;
		this.startSquare = startSquare;
		this.endSquare = null;
		this.prev = null;
		this.next = null;
	}
	isLegal(endSquare, availableSquares) {
		let result = false;
		console.log(endSquare.piece.x);
		console.log(endSquare.piece.y);
		for (let i = 0; i < availableSquares.length; i++) {
			if (endSquare.piece.x === availableSquares[i][0] && endSquare.piece.y === availableSquares[i][1]) {
				result = true;
			}
		}
		return result;
	}
}

canvas.addEventListener('click', event => {
	var indices = findClickedSquareIndices(currentX, currentY);
	var clickedSquare = squares[indices[0]][indices[1]];
	if (!moveInProgress && mouse.hasPiece) {
		currMove = new move(moves.size + 1, clickedSquare);
		moveInProgress = true;
		currMoves = mouse.piece.availableMoves;
	} else {
		console.log(clickedSquare);
		if (clickedSquare != currMove.startSquare && 
			currMove.isLegal(clickedSquare, currMoves)) {
			console.log('working');
			currMove.endSquare = clickedSquare;
			moves.add(currMove);
			currMove = null;
			moveInProgress = false;
			console.log(moves);
		}
	}
})


$(document).ready(function() {
	moves = new moveList();
});