var io = require('socket.io').listen(3000);
var userNum = 0;
var userList = [];
var userListJson ={};
var usersId = {};
var gameOn = false;
var gamerNum ;
var gamerPoker = {};
var gameRound = 0;
var userIndex =0;
var userTurn;
var MURDER;
var PUBLISH;
var readyNum = 0;

io.sockets.on('connection', function(socket){

	function gameInit(){
		gameOn = true;
		MURDER = null;
		gamerNum = userList.length;
		dealing(gamerNum);
		gameStart();
	}
	//发牌
	function dealing(gamerNum){
		var poker = new Poker();
		poker.shuffling();
		console.log("这次的玩家有" + userList);
		
		switch(gamerNum){
			case 1:
				for(i=0;i<1;i++){
					var index = i*6;
					console.log( poker.pokers.slice(index,index+6));
					gamerPoker[userList[i]] = poker.pokers.slice(index,index+6);
					io.sockets.connected[usersId[userList[i]]].emit('send poker', {poker:gamerPoker[userList[i]],num:1});
				}
				
				break;
			case 2:
				console.log('2个玩家');
				for(i=0;i<2;i++){
					var index = i*12;
					console.log( poker.pokers.slice(i*12,i*12+12));
					gamerPoker[userList[i]] = poker.pokers.slice(i*12,i*12+12);
					io.sockets.connected[usersId[userList[i]]].emit('send poker', {poker:gamerPoker[userList[i]],num:2});
				}
				PUBLISH = poker.pokers.slice(24,27); 
				MURDER = poker.pokers[27];
				io.emit('public pokers', PUBLISH);
				console.log('公共牌' +PUBLISH +' 凶手 ' + MURDER );
				break;
			case 3:
				for(i=0;i<3;i++){
					var index = i*8;
					console.log( poker.pokers.slice(i*8,i*8+8));
					gamerPoker[userList[i]] = poker.pokers.slice(i*8,i*8+8);
					io.sockets.connected[usersId[userList[i]]].emit('send poker',{poker:gamerPoker[userList[i]],num:3});
				}
				PUBLISH = poker.pokers.slice(24,27); 
				MURDER = poker.pokers[27];
				io.emit('public pokers', PUBLISH);
				console.log('公共牌' +PUBLISH +' 凶手 ' + MURDER );
				break;
			case 4:
				for(i=0;i<4;i++){
					var index = i*6;
					console.log( poker.pokers.slice(i*6,i*6+6));
					gamerPoker[userList[i]] = poker.pokers.slice(i*6,i*6+6);
					io.sockets.connected[usersId[userList[i]]].emit('send poker', {poker:gamerPoker[userList[i]],num:4});
				}
				PUBLISH = poker.pokers.slice(24,27); 
				MURDER = poker.pokers[27];
				io.emit('public pokers', PUBLISH);
				console.log('公共牌' +PUBLISH +' 凶手 ' + MURDER );
				break;
			case 5:
				for(i=0;i<5;i++){
					var index = i*5;
					console.log(poker.pokers.slice(i*5,i*5+5));
					gamerPoker[userList[i]] = poker.pokers.slice(i*5,i*5+5);
					io.sockets.connected[usersId[userList[i]]].emit('send poker', {poker:gamerPoker[userList[i]],num:5});
				}
				PUBLISH = poker.pokers.slice(25,27); 
				MURDER = poker.pokers[27];
				io.emit('public pokers', PUBLISH);
				console.log('公共牌' +PUBLISH +' 凶手 ' + MURDER );
				break;
			case 6:
				for(i=0;i<6;i++){
					var index = i*4;
					console.log(poker.pokers.slice(i*4,i*4+4));
					gamerPoker[userList[i]] = poker.pokers.slice(i*4,i*4+4);
					io.sockets.connected[usersId[userList[i]]].emit('send poker', {poker:gamerPoker[userList[i]],num:6});
				}
				PUBLISH = poker.pokers.slice(24,27); 
				MURDER = poker.pokers[27];
				io.emit('public pokers', PUBLISH);
				console.log('公共牌' +PUBLISH +' 凶手 ' + MURDER );
				break;
			default:
				break;
		}
	}

	function gameStart(){

		userTurn = userList[userIndex];
		io.emit('whos turn', userTurn);
		
		
	}
	function nextTurn(){
		if(userIndex==gamerNum-1){
			userIndex = 0;
		}else{
			userIndex++
		}
		console.log('下一回合');
		userTurn = userList[userIndex];
		io.emit('whos turn', userTurn);
		
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
	socket.on('im ready',function(){
		console.log('someone is ready!' + readyNum);
		if(++readyNum==userList.length){
			io.emit('all is ready');
			gameInit();
		}
	});
	
	//监听用户登录登出
	socket.on('user login', function(nickName){
		if(nickName=='Tony'){
			socket.emit('host joined');
		}
		console.log(socket.id);
		usersId[nickName] = socket.id;
		console.log(nickName + " 进来了");
		userList.push(nickName);
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
	//监听用户要牌
	socket.on('user order',function(choice){
		console.log('用户要了'+ choice);
		socket.broadcast.emit('request poker', choice);
	});	
	//监听其他玩家给牌
	socket.on('delivered poker',function(data){
		console.log('传递扑克');
		
		io.sockets.connected[usersId[userList[userIndex]]].emit('accept poker', data);
	});
	//没有牌给
	socket.on('deliver nopoker',function(name){
		if(usersId[userList[userIndex]]){
			io.sockets.connected[usersId[userList[userIndex]]].emit('accept nopoker', name);
		}
	});
	//扔的第一张
	socket.on('drop firstPoker',function(poker){
		socket.broadcast.emit('one of three', {pokerid:poker,who:userTurn});
		nextTurn();
		console.log(userTurn + '扔了三张！');
	});
	//扔的其他，别人不知道，自己知道
	socket.on('drop otherPoker',function(pokers){
		socket.emit('others poker', pokers);
		
	});
	//只扔了一张
	socket.on('drop onePoker',function(poker){
		io.emit('only onePoker',{pokerid:poker,who:userTurn});
		nextTurn();
		console.log(userTurn + '扔了一张！');
	});
	
	//监听guess
	socket.on('guess',function(data){
		console.log('有人才了');
		console.log(data.pokerid);
		if(data.pokerid == MURDER ){
			io.emit('bingo',{who:data.who,pokerid:data.pokerid});
			var gameOn = false;
		}else{
			io.emit('guess failed', {who:data.who,pokerid:data.pokerid});
			for(i=0;i<userList.length;i++){
				if(userList[i]==data.who){
					userList.splice(i,1);
				}
			}
			gamerNum--;
			nextTurn();
		}
	});
	//手牌没了
	socket.on('show my pokers',function(data){
		socket.broadcast.emit('show its pokers', data);
	});
	//测试专用
	socket.on('test',function(){
		console.log('测试通过');
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