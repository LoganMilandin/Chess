
let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
let mouseX;
let mouseY;
canvas.addEventListener('mousemove', () => {
	mouseX = event.clientX;
	mouseY = event.clientY;
});
const BOARD_WIDTH = canvas.width;

class bishop {
	constructor(x, y, team) {
		this.type = 'bishop';
		this.x = x;
		this.y = y;
		this.team = team;
	}
	
	draw() {
		context.fillStyle = '#ff0000';
		context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 16, BOARD_WIDTH / 16);
	}
}

class king {
	constructor(x, y, team) {
		this.type = 'king';
		this.x = x;
		this.y = y;
		this.team = team;
		this.hasMoved = false;
	}
	
	draw() {
		context.fillStyle = '#ff0000';
		context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 16, BOARD_WIDTH / 16);
	}
}

class knight {
	constructor(x, y, team) {
		this.type = 'knight';
		this.x = x;
		this.y = y;
		this.team = team;
	}
	
	draw() {
		context.fillStyle = '#ff0000';
		context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 16, BOARD_WIDTH / 16);
	}
}

class pawn {
	constructor(x, y, team) {
		this.type = 'pawn';
		this.x = x;
		this.y = y;
		this.team = team;
		this.hasMoved = false;
	}
	
	draw() {
		context.fillStyle = '#ff0000';
		context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 16, BOARD_WIDTH / 16);
	}
}

class queen {
	constructor(x, y, team) {
		this.type = 'queen';
		this.x = x;
		this.y = y;
		this.team = team;
	}
	
	draw() {
		context.fillStyle = '#ff0000';
		context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 16, BOARD_WIDTH / 16);
	}
}

class rook {
	constructor(x, y, team) {
		this.type = 'rook';
		this.x = x;
		this.y = y;
		this.team = team;
		this.hasMoved = false;
	}
	
	draw() {
		context.fillStyle = '#ff0000';
		context.fillRect(this.x * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, this.y * BOARD_WIDTH / 8 + BOARD_WIDTH / 32, BOARD_WIDTH / 16, BOARD_WIDTH / 16);
	}
}

function drawGame() {
	context.fillStyle = '#fff';
	for(i = 0; i < 4; i++) {
		for(j = 0; j < 4; j++) {
			context.fillRect(i * BOARD_WIDTH / 4, j * BOARD_WIDTH / 4, BOARD_WIDTH / 8, BOARD_WIDTH / 8);
			context.fillRect(i * BOARD_WIDTH / 4 + BOARD_WIDTH / 8, j * BOARD_WIDTH / 4 + BOARD_WIDTH / 8, BOARD_WIDTH / 8, BOARD_WIDTH / 8);
		}
	}
}

function gameLoop(pieces) {
	drawGame();
	pieces.forEach(piece => piece.draw());
	console.log(mouseX);
}

function startGame() {
	let pieces = [];
	pieces.push(b1 = new rook(0, 0, 'black'));
	pieces.push(b2 = new knight(1, 0, 'black'));
	pieces.push(b3 = new bishop(2, 0, 'black'));
	pieces.push(b4 = new queen(3, 0, 'black'));
	pieces.push(b5 = new king(4, 0, 'black'));
	pieces.push(b6 = new bishop(5, 0, 'black'));
	pieces.push(b7 = new knight(6, 0, 'black'));
	pieces.push(b8 = new rook(7, 0, 'black'));
	pieces.push(b9 = new pawn(0, 1, 'black'));
	pieces.push(b10 = new pawn(1, 1, 'black'));
	pieces.push(b11 = new pawn(2, 1, 'black'));
	pieces.push(b12 = new pawn(3, 1, 'black'));
	pieces.push(b13 = new pawn(4, 1, 'black'));
	pieces.push(b14 = new pawn(5, 1, 'black'));
	pieces.push(b15 = new pawn(6, 1, 'black'));
	pieces.push(b16 = new pawn(7, 1, 'black'));
	
	pieces.push(w1 = new rook(0, 7, 'white'));
	pieces.push(w2 = new knight(1, 7, 'white'));
	pieces.push(w3 = new bishop(2, 7, 'white'));
	pieces.push(w4 = new queen(3, 7, 'white'));
	pieces.push(w5 = new king(4, 7, 'white'));
	pieces.push(w6 = new bishop(5, 7, 'white'));
	pieces.push(w7 = new knight(6, 7, 'white'));
	pieces.push(w8 = new rook(7, 7, 'white'));
	pieces.push(w9 = new pawn(0, 6, 'white'));
	pieces.push(w10 = new pawn(1, 6, 'white'));
	pieces.push(w11 = new pawn(2, 6, 'white'));
	pieces.push(w12 = new pawn(3, 6, 'white'));
	pieces.push(w13 = new pawn(4, 6, 'white'));
	pieces.push(w14 = new pawn(5, 6, 'white'));
	pieces.push(w15 = new pawn(6, 6, 'white'));
	pieces.push(w16 = new pawn(7, 6, 'white'));
	
	//pieces.forEach(piece => console.log(piece.team + ' ' + piece.type + ' (' + piece.x + ', ' + piece.y + ')'));
	gameLoop(pieces);
}

startGame();

