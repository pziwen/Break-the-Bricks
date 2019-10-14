function $(id) {
    return  document.getElementById(id);
}
function rand(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
//打砖块构造函数
function BtB() {
    this.box = $("box");//容器
    this.list = document.getElementsByTagName("li");//砖块
    this.bubble = $("bubble");//小球
    this.board = $("board");//挡板
    //小球运动方向
    this.fx = 1;//横向
    this.fy = -1;//纵向
    //挡板位置初值
    this.bx = 0;
    this.by = 0;
    this.num = 0;//挡板挡球计数
    this.score = 0;//得分数
    this.count = 0;//计时
    this.time = null;//游戏时间
}

//砖块
BtB.prototype.init = function () {
    for (var i=0;i<this.list.length;i++){
        this.list[i].style.backgroundColor = "rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";
        var x =this.bx*this.list[0].offsetWidth;
        var y =this.by;
        this.list[i].style.left = x +"px";
        this.list[i].style.top = y +"px";
        this.bx++;
        if ((i+1)%10 == 0){
            this.bx = 0;
            this.by += this.list[0].offsetHeight;
        }
    }
};

//挡板运动
BtB.prototype.keydown = function () {
     var that = this;
     document.onkeydown = function (e) {
         var e = e || event;
         if (e.keyCode == 37){
             if (that.board.offsetLeft>0){
                 that.board.style.left = that.board.offsetLeft - 20 + "px" ;
             }else {
                 that.board.style.left = 0 + "px" ;
             }
         }
         if (e.keyCode == 39){
             if ((that.board.offsetLeft+that.board.offsetWidth)<(that.box.offsetWidth-20)){
                 that.board.style.left = that.board.offsetLeft + 20 + "px" ;
             }else {
                 that.board.style.left = that.box.offsetWidth-that.board.offsetWidth;
             }
         }
     }
};

//小球运动
BtB.prototype.move = function () {
    var timer = null;
    var that = this;
    timer = setInterval(function () {
        that.bubble.style.left = that.bubble.offsetLeft + that.fx +"px";
        that.bubble.style.top = that.bubble.offsetTop + that.fy +"px";

        //与边框碰撞
        if (that.bubble.offsetLeft<=0 || (that.bubble.offsetLeft+that.bubble.offsetWidth)>=that.box.offsetWidth){   //左右
            that.fx *= -1;
        }else if (that.bubble.offsetTop<=0){    //上
            that.fy *= -1;
        }else if ((that.bubble.offsetTop+that.bubble.offsetHeight)>=that.box.offsetHeight){     //下
            // that.box.appendChild(document.createTextNode("Game Over"));
            alert("Game Over");
            clearInterval(timer);
            clearInterval(this.time);
            $("state").innerHTML = "游戏结束";
        }

        //与挡板碰撞
        if ((that.bubble.offsetLeft+that.bubble.offsetWidth/2)>=that.board.offsetLeft &&
            (that.bubble.offsetLeft+that.bubble.offsetWidth/2)<=(that.board.offsetLeft+that.board.offsetWidth)) {
            if ((that.bubble.offsetTop+that.bubble.offsetHeight)==that.board.offsetTop) {
                that.fy *= -1;
                that.num++;
                $("num").innerHTML = that.num;
            }
        }

        //与砖块碰撞
        for (var i=0;i<that.list.length;i++){
            //上下
            if ((that.bubble.offsetLeft+that.bubble.offsetWidth/2)>=that.list[i].offsetLeft &&
                (that.bubble.offsetLeft+that.bubble.offsetWidth/2)<=(that.list[i].offsetLeft+that.list[i].offsetWidth)){
                if (that.bubble.offsetTop<=(that.list[i].offsetTop+that.list[i].offsetHeight) &&
                    (that.bubble.offsetTop+that.bubble.offsetHeight>=that.list[i].offsetTop)) {
                    that.fy *= -1;
                    that.list[i].style.display = "none";
                    that.score++;
                    $("score").innerHTML = that.score;
                }

            }
            //左右
            if ((that.bubble.offsetTop<=(that.list[i].offsetTop+that.list[i].offsetHeight) &&
                (that.bubble.offsetTop+that.bubble.offsetHeight)>=that.list[i].offsetTop)){
                if ((that.bubble.offsetLeft+that.bubble.offsetWidth/2)>=that.list[i].offsetLeft &&
                    (that.bubble.offsetLeft+that.bubble.offsetWidth/2)<=(that.list[i].offsetLeft+that.list[i].offsetWidth)) {
                    that.fx *= -1;
                    that.list[i].style.display = "none";
                    that.score++;
                    $("score").innerHTML = that.score;
                }
            }
        }
    },5);
};

//游戏时间
BtB.prototype.gettime = function () {
    var that = this;
    that.time = setInterval(function () {
        that.count++;
        var M = parseInt(that.count / 60) % 60;
        var S = that.count % 60;
        if (M<10){M = "0"+M;}
        if (S<10){S = "0"+S;}
        $("time").innerHTML = M+":"+S;
    },1000);
};



