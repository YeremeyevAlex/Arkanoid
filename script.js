const time = document.getElementById("time");
let game = {
	elem: document.getElementById("game"),
	w: 1000,
	h: 600,
	color: "#777",
	show: function() {
		this.elem.style.width = this.w + "px";
		this.elem.style.height = this.h + "px";
		this.elem.style.background = this.color;
	}
				
}
let ball = new function() {
	this.elem = document.getElementById("ball");
	this.x = .1;
	this.y = game.h / 2;
	this.dx = 5;
	this.dy = -6;
	this.r = 10;
	this.h = 2 * this.r;
	this.w = 2 * this.r;
	this.color = "red";
	this.move = function(){
		this.x += this.dx;
		this.y += this.dy;
	}
	this.show = function(){					
		this.elem.style.width = this.w + "px";
		this.elem.style.height = this.h + "px";
		this.elem.style.borderRadius = this.r + "px";
		this.elem.style.left = this.x + "px";
		this.elem.style.top = this.y + "px";
		this.elem.style.background = this.color;
	}
}
let bar = new function() {
	this.elem = document.getElementById("bar");
	this.w = 150;
	this.h = 10;
	this.x = 0;
	this.br = 5;
	this.dx = 10;
	this.color = "blue";
	this.y = game.h - 2 * this.h;
	this.show = function() {					
		this.elem.style.width = this.w + "px";
		this.elem.style.height = this.h + "px";
		this.elem.style.left = this.x + "px";
		this.elem.style.top = this.y + "px";
		this.elem.style.borderRadius = this.br + "px";
		this.elem.style.background = this.color;
	}
}			
let bricks = {
	arr: [],
	row: 3,
	col: 6,
	margin: 10,
	create: function() {
		for(i=0; i < this.row; i++){
			for(j=0; j < this.col; j++){
				this.arr.push( new Brick(i, j) );
			}
		}
	},
	show: function() {
		for(i = 0; i < this.arr.length; i++){
			let brick = this.arr[i];
			if(brick.status == 1) brick.show();
			else brick.hide();
		}
	}
}
let countdown = {
	start: new Date()
};
			
function Brick(i, j){
	let blok = document.createElement("div");
	blok.setAttribute("id", "b" + i + j);
	game.elem.appendChild(blok);
	this.elem = document.getElementById("b" + i + j);
	this.w = (game.w - (bricks.col + 1) * bricks.margin) / bricks.col;								
	this.h = this.w / 4;
	this.x = (j + 1) * bricks.margin + j * this.w;
	this.y = (i + 1) * bricks.margin + i * this.h;
	this.br = 4;
	this.color = "orange";
	this.status = 1;
	this.show = function(){
		this.elem.style.width = this.w + "px";
		this.elem.style.height = this.h + "px";
		this.elem.style.left = this.x + "px";
		this.elem.style.top = this.y + "px";
		this.elem.style.borderRadius = this.br + "px";
		this.elem.style.background = this.color;
	}
	this.hide = function() {
		this.elem.style.display = "none";
	}
}
			
game.show();
bricks.create();
bricks.show();
start();
bar.show();
ball.y = bar.y - 2.01 * ball.r;
let timer = setInterval(ballMove, 40);
document.onkeydown = barMove;
			
function ballMove() {
	let counter = 0;
	countdown.present = new Date();
	time.innerHTML = 80 - Math.floor((countdown.present - countdown.start)/1000);
	if(ball.x <= 0 || ball.x >= game.w - 2 * ball.r) ball.dx *= -1;
	if(ball.y <= 0 || collision(ball, bar)) ball.dy *= -1;
	else if(ball.y >= game.h - 2 * ball.r) gameOver("lost");

	for(i = 0; i < bricks.arr.length; i++) {
		let brick = bricks.arr[i];
		if (brick.status == 1 && collision(ball, brick)){
			brick.status = 0;
			ball.dy *= -1.05;
			ball.dx *= 1.05;
		}
		if(brick.status == 0) counter++;
	}
	if(counter == bricks.arr.length) gameOver("win");
				
	ball.move();
	ball.show();
	bricks.show();
}
			
function barMove(e) {
	if(e.keyCode == 37 && bar.x > 0) bar.x -= bar.dx;
	else if(e.keyCode == 39 && bar.x + bar.w < game.w) bar.x += bar.dx;				
					
	bar.show();
}
			
function collision(obj1, obj2) {
	return (obj1.y <= obj2.y + obj2.h &&
			obj1.y + obj1.h >= obj2.y &&
			obj1.x + obj1.w >= obj2.x &&
			obj1.x <= obj2.x + obj2.w);
}
			
function start() {
	bar.x = rand(0, game.w - bar.w);
	let sign = (rand(0, 1))? -1:1;
	ball.dx = sign * rand(40, 60)/10;
	bar.dy = rand(40, 60)/10;
	ball.x = bar.x + bar.w / 2 - ball.r;
}
			
function gameOver(msg) {
	if(msg == "win") message = "ПОЗДРАВЛЯЮ. ВЫ ВЫИГРАЛИ";
	else message = "КОНЕЦ ИГРЫ. ВЫ ПРОИГРАЛИ";
	clearInterval(timer);
	alert(message);
}
			
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}