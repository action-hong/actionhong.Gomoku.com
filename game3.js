//初始化数据
var flag;//1，为黑棋，0为白旗
var models = [];
//初始化棋盘
var c=document.getElementById("myCanvas");
var q=document.getElementById("qizi");
var qipan = document.getElementById("qipan");
var cxt=c.getContext("2d");//画棋盘
var cxt_qizi = q.getContext("2d");//画棋子
var img1 = new Image();
var img2 = new Image();
var dir = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];//八个方向(-1,0)(-1,1)(0,1)(1,1)(1,0)(1,-1)(0,-1)(-1,-1);
var step;

//栈的链表表示，用于放置每一步棋
function Stack () {
     // body... 
     this.top = null;
     this.size = 0; 
}
//栈的一些基本方法
Stack.prototype = {
    constructor : Stack,
    push:function (data) {
         /* body... */ 
         var node = {
            data: data,
            next: null
         };

         node.next = this.top;
         this.top = node;
         this.size++;
    },
    peek:function () {
         /* body... */
         //返回上一步的数据
         return this.top === null ? null : this.top.data; 
    },
    pop : function () {
    	 //弹出上一步数据
         if(this.top === null) return null;
         var out = this.top;
         this.top = this.top.next;
         if(this.size !== 0) this.size--;
         return out.data; 
    },
    clear : function (argument) {
    	 //清空栈
    	 this.top = null;
    	 this.size = 0;
    },

    dispalayAll : function () {
         //展示所有步骤的下棋顺序，倒序 
         if(this.top == null) return null;

         var arr = [];
         var current = this.top;

         for (var i = 0; i < this.size; i++) {
            arr[i] = current.data;
            current = current.next;
         }
         return arr;

    }
};
var stack = new Stack();


//新一局游戏
var newGame = function () {
	 flag = 1;
	 for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			models[i][j] = 0;
		}
	 }
	 cxt_qizi.clearRect(20,20,580,580);//清空棋子
	 stack.clear();//清空栈
}

//画棋盘
var drawLine = function () {
	for (var i = 0; i < 15; i++) {
			cxt.moveTo(40*i+20, 20);
			cxt.lineTo(40*i+20,580);
			cxt.moveTo(20, 40*i+20);
			cxt.lineTo(580,40*i+20);
		}
	cxt.stroke();

	//画点(120,120) (440,120) (120,440) (440,440) (280,280);
	var fivePoints = [[140,140],[460,140],[140,460],[460,460],[300,300]];
	for (var i = 0; i < fivePoints.length; i++) {
		var x = fivePoints[i][0];
		var y = fivePoints[i][1];
		cxt.beginPath();
		cxt.arc(x,y,5,0,Math.PI*2,true);
		cxt.closePath();
		cxt.fill();
	}
}

//检查是否有5子连接
var checkWin = function(x,y){
    for (var i = 0; i < dir.length; i++) {
        if(checkChain(x,y,dir[i][0],dir[i][1]))
            return true;
    }
    return false;
};

//八个方向的x0,y0分别为(-1,0)(-1,1)(0,1)(1,1)(1,0)(1,-1)(0,-1)(-1,-1);
var checkChain = function (x,y,x0,y0) {
	//他妈y0写成yo，在哪傻改半天，就是不知道去用chrome打断点看啊看  擦擦才才啊啊从擦擦
     /* body... */ 
     var temp = models[x][y];//点击的格子，是属于哪一方的
     var x1 = x;
     var y1 = y;
     for (var i = 1; i < 5; i++) {
        //太巧妙了哈哈哈哈哈
        x1 += x0;
        y1 += y0;
        if((x1*y1) < 0 || x1===15 || y1===15 || models[x1][y1] !== temp)//前面3个条件检查越界，立即break掉
            break;
        if(i === 4){
            return 1;
        } 
    }
    return 0;
}


window.onload = function (argument) {
	 
	drawLine();//划线

	//重新开始游戏
    var newGameBt = document.getElementById("new");    
    newGameBt.onclick = function () {
         /* body... */ 
         newGame();
    }

    //悔棋
    var reGretBt = document.getElementById("regret");
    reGretBt.onclick = function () {
         /* 悔棋*/ 
         var arr = stack.pop();
         var i = arr[0];
         var j = arr[1];
         if(arr !== null){
            models[i][j] = 0;
            flag = arr[2];//回到上一步的人
            cxt_qizi.clearRect(i*40,j*40,40,40);//清空棋子
         }
    }


	 /* body... */ 
	 for (var i = 0; i < 15; i++) {
	 	models[i] = [];
	 }

	 img1.src = "images/stone_b1.png";
	 img2.src = "images/stone_w2.png";
	 newGame();


	 //点击棋盘，落子
	qipan.onclick = function (e) {
		 /* body... */ 
		 var x0 = Math.floor((e.clientX-8)/40);
		 var y0 = Math.floor((e.clientY-8)/40);
		 var dis = document.getElementById("dis");
		 if(models[x0][y0]===0){
			 models[x0][y0] = flag + 1;
			 stack.push([x0,y0,flag]); 
			 if(flag){
			 	cxt_qizi.drawImage(img1,x0*40+8,y0*40+8,24,24);
			 	flag = 0;
			 }else{
			 	flag = 1;
			 	cxt_qizi.drawImage(img2,x0*40+8,y0*40+8,24,24);
			 }

			 if (checkWin(x0, y0)){
                if (flag)
                    alert("用白旗的选手胜利！");
                else
                    alert("用黑棋的选手胜利！");
                newGame();
            }

            // alert(stack.size);

            if(stack.size === 255){
            	alert("下满了，平局");
            	newGame();
            }
		}
	}
}