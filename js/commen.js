function Game() {
	this.timer = 30; //每一次有多少时间	
	this.titleNumber = 5; //总共有多少题
	this.color = [//总共有6总颜色10进制
			[35, 179, 183],
			[245, 78, 94],
 			[154, 213, 62],
			[224, 152, 67],
 			[135, 100, 224],
			[220, 209, 88]
		     ];
	this.selectLi = null; //选择了哪一个方块
	this.oGameList = null;
	this.answerNumber = 0; //计录答了多少题
	this.rightNumber = 0; //计录答对了多少题
	this.answerRightError = true; // 是答错了false 还是答对了true;  	
	this.ranomN = null; //每一次 不一样的色块 位置不一样
	this.ranomNColor = null; //每一次不一样色块 颜色 
	this.recordingNumber = 2; // 下一关加1
	this.aNumber = 0; //每一关加2 得到是否是进行一关
	this.aOpacity = 50; //初始化不同颜色
	this.timerNumber = 30//倒计时间 时间是变化的
	this.timerF = null; //定时器 

	this.lasterOpacity = null; //计录最后一次　透明
	this.c = null;
}

//随机一个数字
Game.prototype.ranomNumber = function(max) {
	var _this = this;
	
   	var Range = (max - 1) - 0;
    	var Rand = Math.random();
  
	return (0 + Math.round(Rand * Range));
}

//不同颜色
Game.prototype.opacityNumber = function() {
	var _this = this;
	
	var aNewColor = [];	

	var color =  _this.color[_this.ranomNColor];

	if(_this.answerNumber >=  _this.titleNumber * (_this.titleNumber + 1)) {
		for(var i = 0; i < color.length; i++) {
			aNewColor.push(color[i] + _this.lasterOpacity);		
		}
		return aNewColor;	
	} else {
		for(var i = 0; i < color.length; i++) {
			aNewColor.push(color[i] + _this.aOpacity);		
		}
		_this.lasterOpacity = _this.aOpacity;
		return aNewColor;	
	}

}

//跳转页面
Game.prototype.openPage = function(colseTimer) {
	var _this = this;

	setTimeout(function() {
		//window.location.href ="result.html?=" + _this.rightNumber;
	}, colseTimer);	
	
	clearInterval(_this.timerF);		
	$("#progressBarComplete").stop();
}


//倒计间
Game.prototype.timerN = function() {
	var _this = this;
	var progressBarComplete = $("#progressBarComplete");

	_this.timerF = setInterval(function() {
		if(_this.timerNumber == 0) {
			clearInterval(_this.timerF);
		
			$(".pop-window").addClass("dialog dialog--open");	
			$(".pop-window-cont").addClass("dialog__content");	
			$("#popContText").html("时间到 （ >_< ）");
		
			_this.openPage(1500);	
	
		} else {
			$("#countdownTimer").html(--_this.timerNumber + "S");
		}		
	}, 1000);
	

	progressBarComplete.animate({
			width: "0"
		}, _this.timer * 1000, "linear", function() {
			
		} 
	);
}


//创建色块
Game.prototype.newColorBlock = function() {
	var _this = this;

	var newLiF = function() {
		//每次的背景

		_this.ranomN = _this.ranomNumber(_this.recordingNumber * _this.recordingNumber);
		_this.ranomNColor = _this.ranomNumber(_this.color.length);
	
		var blockW = (268/_this.recordingNumber) - 1;
	
		for(var i = 0; i < _this.recordingNumber * _this.recordingNumber; i++) {
			var newLi = null;
			if(i != _this.ranomN) {
				newLi = "<li style='width:" + blockW  +"px; height:" + blockW  +"px;'>"+
						"<div class='block-color' style='background-color:rgba("+ _this.color[_this.ranomNColor] +",1) ;'></div>" +
					"</li>"; 
			} else {
				newLi = "<li style='width:" + blockW  +"px; height:" + blockW  +"px;'>"+
						"<div class='block-color' style='background-color:rgba("+ _this.opacityNumber()  + ",1) ;'></div>" +
					"</li>"; 
			}
				
			_this.oGameList.append(newLi);
		}


		if(_this.answerNumber > 1) {
			_this.color.push(_this.c[0]);
		}
	}

	newLiF();

	_this.select(newLiF);
}

//选择
Game.prototype.select = function(newLiF) {
	var _this = this;

	var oLi = $("#gameList li");

	var a = 2;
	var b = 3;
	var c = 2;

	$("#gameList").on("click", function() {
		//是为人兼容 ipad  iphone  safari jquery live 不能点击  我也不知道为什么这样写
		//当然有第二总方法  就是在<li onclick=""></li> 直接放在元素上
		//还可以试一下jquery 的其他绑定事件 或 原生 javascript 绑定事件   可能有用  没有试过
	});

	$("#gameList li").live("click", function() {
		_this.aOpacity = parseInt((_this.aOpacity -(_this.aOpacity / c )));


		//选择正确 或不正确
		if($(this).index() == _this.ranomN) {
			_this.rightNumber++;
			
			_this.answerNumber++;	
			
			_this.c = _this.color.splice(_this.ranomNColor, 1);//记录上一次
		

			$("#numberText").html(_this.answerNumber);	

		} else {
			$(".pop-window").addClass("dialog dialog--open");	
			$(".pop-window-cont").addClass("dialog__content");	
			$("#popContText").html("Game Over（ㄒoㄒ）");

			_this.openPage(1500);	
			
			return;
		}

		/*if(_this.answerNumber == _this.titleNumber * (_this.titleNumber + 1)) {
			$(".pop-window").addClass("dialog dialog--open");	
			$(".pop-window-cont").addClass("dialog__content");	
			$("#popContText").html("恭喜你全部答对");
			
			_this.openPage(1500);	
			return;
		}*/

		//每道题目切换
		if(_this.answerNumber == (c)) {
			_this.recordingNumber++;

			c = a * b;
			a++;
			b++;  	

			_this.aOpacity =  43 - c;	

			//得新加载时间 进度条
			/*_this.timerNumber = _this.timer;
			$("#progressBarComplete").stop();

			$("#progressBarComplete").css("width", "256px");	

			$("#progressBarComplete").animate({
					width: "0"
				}, _this.timer * 1000, "linear", function() {
					
				} 
			);*/
		}

		_this.ranomN = _this.ranomNumber(_this.numberBlock);
		_this.ranomNColor = _this.ranomNumber(_this.color.length);

		$("#gameList li").remove();
		
		newLiF();

	});
}


//执行
Game.prototype.init = function() {
	var _this = this;

	$("#countdownTimer").html(_this.timer + "S");

	_this.oGameList = $("#gameList");

	_this.newColorBlock();
	
	_this.timerN();

}

var game = new Game();


