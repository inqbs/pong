
//	공
var ball_list = [];
var b_speed = 40;

//	플레이어, 적 좌표
var p_x; var p_y;
var p_h = 500;
var enemy;
var mvm = 0;

//	스코어
var score_p = 0;	//	내 스코어
var score_e = 0; // 적 스코어

//	내부 판정용
var canvas;
var ctx;
var main_font = 'imagine_fontregular';
var game_time = 0;
var playing = false;

window.onload = function(){
	canvas = document.getElementById('game-canv');
	ctx = canvas.getContext('2d');
	
	var screen_ratio = 2000 / canvas.offsetWidth; //	화면크기 계산하는 것
	
	canvas.onmousemove = function(e){
		p_x = e.offsetX * screen_ratio;
		p_y = e.offsetY * screen_ratio;
	}
	
	gamePlay();
	
	//	시작버튼 눌렀을때 게임 시작
	document.getElementById('startBtn').onclick = function(){
		document.getElementById('mainMenu').classList.remove('is-visible');
		document.getElementById('mainMenu').classList.add('is-disable');
		canvas.classList.add('is-visible');
		gamePlay();
	}
	
}

function gamePlay(){
//	playing = true;
	
	enemy = {
		y: 1000,
		dimention: Math.floor(Math.random()*2000),
		mode: false
	};
	
	
	generateBall();
	enemyThink();

	setInterval(enemyThink, 1500);
	setInterval(enemyMove, 20);
	setInterval(moveBall, 20);
	setInterval(draw, 20);
}

function draw(){
	ctx.fillStyle = '#000';
	ctx.fillRect(0,0, 2000, 2000);
	
	ctx.globalAlpha = 0.3;
	ctx.textAlign = 'center';
	ctx.font = 'bold 30rem '+main_font;
	ctx.fillStyle = '#fff';
	ctx.fillText(score_p, 500, 1100);
	ctx.fillText(score_e, 1500, 1100);
	
	ctx.globalAlpha = 1;
	ctx.fillStyle = '#fff';
	ctx.fillRect(100, p_y-p_h/2, 10, p_h);
	ctx.fillRect(1900, enemy.y-500/2, 10, 500);
	
//	ctx.fillRect(960, 960, 80, 80);
	
	ctx.fillStyle = '#fff';
	for(var i=0; i<ball_list.length; i++)
		ctx.fillRect(ball_list[i].x-40, ball_list[i].y-40, 80, 80);
		
//	for(var i in ball_list){
//		ctx.fillRect(i.x-40, i.y-40, 80, 80);
//	}
}

function generateBall(){
	if(ball_list.length==0){
		var b = {
			x: 1040,
			y: 1040,
			t_x:0,
			t_y:0
		}
		b = setBallSpeed(b);
		ball_list.push(b);
  }
}

function setBallSpeed(b){
	do{
		b.t_x = Math.floor(Math.random()*b_speed-b_speed/2);
		b.t_y = Math.floor(Math.random()*b_speed-b_speed/2);
	}while( Math.abs(b.t_x) < 8 || Math.abs(b.t_y) < 8)
	return b;
}

function moveBall(){
	for(var i=0; i<ball_list.length; i++){
		var b = ball_list[i];
		
		var p_flag = (100 <= b.x-40 &&  b.x-40 <= 120) && (p_y - p_h/2 <= b.y && b.y <= p_y + p_h/2);
		var e_flag = (1900 <= b.x+40 &&  b.x+40 <= 1920) && (enemy.y - 250 <= b.y && b.y <= enemy.y +250);
		
		if(p_flag){
			b.t_x *= -1;
			enemyThink();
		}else if(e_flag){
			b.t_x *= -1;
			enemy.mode = false;
		}else if((-40 < b.x && b.x <2040 ) && (b.y<=40 || b.y>=2000-40)){
			b.t_y *= -1;
		}else if(b.x < 0){
			//	상대방 점수 +1
			score_e++;
			ball_list.splice(i, 1);
			setTimeout(generateBall, 3000);
			enemy.mode = false;
			continue;
		}else if(b.x > 2000){
			score_p++;
			ball_list.splice(i, 1);
			setTimeout(generateBall, 3000);
			enemy.mode = false;
			continue;
		}
		b.x += b.t_x;
		b.y += b.t_y;
	}
	
}

function enemyThink(){
	for(var i=0; i<ball_list.length; i++){
		var b = ball_list[i];
		if(enemy.mode)	enemy.dimention = b.y - 250;
		else enemy.dimention = Math.floor(Math.random()*2000);
	}
	
	if(enemy.dimention<0) enemy.dimention = 0;
	
	if(enemy.mode && Math.abs(enemy.y - 250 - enemy.dimention)> 1000 ){
		if(enemy.y - 250 - enemy.dimention>0) mvm = -20 - Math.random()*10;
		else mvm = 30 + Math.random()*10;
	}else if(enemy.y - 250 > enemy.dimention){
		mvm = -25;
	}else{
		mvm = 25;
	}
}

function enemyMove(){
	if(enemy.y - 250<=0 || enemy.y+250 >= 2000){
		if(enemy.y <= 250) enemy.y = 270;
		else enemy.y = 1740;
		enemyThink();
	}else if(enemy.y - 250 == enemy.dimention){
		enemyThink();
	}
	for(var i=0; i<ball_list.length; i++){
		var b = ball_list[i];
		if(b.x > 1600 && !enemy.mode ){
			//&& Math.random()*100 > 90
			enemy.mode = true;
			enemyThink();
		}else if(b.x<1600){
			enemy.mode = false;
		}
	}
	enemy.y += mvm;
	console.log(enemy.y + ":" + enemy.dimention + ":" + enemy.mode);
}