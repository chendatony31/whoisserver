var io = require('socket.io').listen(3000);
var userNum = 0;
var userList = [];
var userListJson ={};


io.sockets.on('connection', function(socket){
	//游戏构造函数
function Game(gamers){
	this.gamerList = gamers;
	this.gameOn = false;
	this.gamerNum = gamers.length;
	this.gamerPoker = {}
}
Game.prototype = {
	init:function(){
		this.gameOn = true;
		this.dealing(this.gamerNum);
	},
	//发牌
	dealing:function(gamerNum){
		var poker = new Poker();
		poker.shuffling();
		console.log("这次的玩家有" + userList)
		switch(gamerNum){
			case 1:
				for(i=0;i<1;i++){
					var index = i*6;
					console.log( poker.pokers.slice(i*6,i*6+6));
					this.gamerPoker[this.gamerList[i]] = poker.pokers.slice(i*6,i*6+6);
				}
				for(client in io.sockets.connected ){
					var clientId = io.sockets.connected[client].id
					io.sockets.connected[client].emit('send poker', this.gamerPoker[clientId]);
				}
				break;
			case 2:
				for(i=0;i<2;i++){
					var index = i*6;
					console.log( poker.pokers.slice(i*6,i*6+6));
					this.gamerPoker[this.gamerList[i]] = poker.pokers.slice(i*6,i*6+6);
				}
				for(client in io.sockets.connected ){
					var clientId = io.sockets.connected[client].id
					io.sockets.connected[client].emit('send poker',this.gamerPoker[clientId]);
				}
				break;
			case 3:
				for(i=0;i<3;i++){
					var index = i*8;
					console.log( poker.pokers.slice(i*8,i*8+8));
					this.gamerPoker[this.gamerList[i]] = poker.pokers.slice(i*8,i*8+8);
				}
				break;
			case 4:
				for(i=0;i<4;i++){
					var index = i*6;
					console.log( poker.pokers.slice(i*6,i*6+6));
					this.gamerPoker[this.gamerList[i]] = poker.pokers.slice(i*6,i*6+6);
				}
				break;
			default:
				break;
		}
	}
}
//扑克构造函数
function Poker(){
	this.pokers=[1,2,3,4,5,6,7,11,12,13,14,15,16,17,21,22,23,24,25,26,27,31,32,33,34,35,36,37];
}
//洗牌
Poker.prototype={
	shuffling : function(){
		this.pokers.sort(function(){
			return Math.random()>0.5?-1:1; 
		});
	}
}
	var addedUser = false;
	//监听游戏开始
	socket.on('game start', function(){
		
		var game = new Game(userList);
		game.init();
	});
	//监听用户登录登出
	socket.on('user login', function(nickName){
		if(nickName=='Tony'){
			socket.emit('host joined');
		}
		console.log(nickName + " 进来了");
		userList.push(nickName);
		socket.id=nickName;
		socket.client.id = nickName;
		socket.userName = nickName;
		addedUser = true;
		userListJson = {users : userList};
		io.sockets.emit('note user login', userListJson);
		userNum++
		console.log(userNum + '名用户在线');
	});
	//监听接收消息
    socket.on('send message', function (data) {
		io.sockets.emit('show message', data);
        console.log(data);
    });
	//断开连接
	socket.on('disconnect', function(){
		if(addedUser){
			for(i=0;i<userList.length;i++){
				if(userList[i]==socket.userName){
					console.log( socket.userName +'登出， 现在还有' + --userNum + '名用户');
					userList.splice(i,1);
					io.sockets.emit('note user login', userListJson);
					break;
				}
			}
		}
	});
});