var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
var Square = function(xpos, ypos) {
	this.x = xpos;
	this.y = ypos;
	this.width = canvas.clientWidth / 8;
	this.height = this.width;
	this.draw = function() {
		context.beginPath();
		context.rect(this.x, this.y, this.width, this.height);
		context.fillStyle = 'black';
		console.log("calling");
		context.strokeStyle = 'red';
		context.stroke();
	}
}
//var testSquare = new Square(250, 250);
//testSquare.draw()
context.beginPath();
context.fillRect(50, 50, 50, 50);
context.strokeStyle = 'red';
context.stroke();