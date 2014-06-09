var io = require('socket.io').listen(3000);
var userNum = 0;
var userList = [];
var userListJson ={};
function Game(gamers){
	this.gamerList = gamers;
	this.gameOn = false;
	this.gamerNum = gamers.length;
}
Game.prototype = {
	init:function(){
		this.gameOn = true;
		this.dealing();
	},
	dealing:function(){
		var newPoker
	}
}
function Poker(){
	this.pokers=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
	this.prototype.Shuffling = function(){
		
	}
}
io.on('connection', function(socket){
	var addedUser = false;
	socket.on('user login', function(nickName){
		if(nickName=='Tony'){
			socket.emit('',)
		}
		console.log(nickName + " 进来了");
		userList.push(nickName);
		socket.userName = nickName;
		addedUser = true;
		userListJson = {users : userList};
		io.emit('note user login', userListJson);
		userNum++
		console.log(userNum + '名用户在线');
	});
    socket.on('send message', function (data) {
		io.emit('show message', data);
        console.log(data);
    });
	socket.on('disconnect', function(){
		if(addedUser){
			for(i=0;i<userList.length;i++){
				if(userList[i]==socket.userName){
					console.log( socket.userName +'登出， 现在还有' + --userNum + '名用户');
					userList.splice(i,1);
					io.emit('note user login', userListJson);
					break;
				}
			}
		}
	});
});