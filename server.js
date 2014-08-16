var io = require('socket.io').listen(3000);
var userNum = 0;
var roomsDetailInfo=[];
var ROOMS = [];
//var userList = [];
//var userListJson ={};
//var usersId = {};
//var gameOn = false;
//var gamerList = [];
//var gamerNum ;
//var gamerPoker = {};
//var gameRound = 0;
//var userIndex =0;
//var userTurn;
//var MURDER;
//var PUBLISH;
//var readyNum = 0;
var allUserList = []
//var roomList = [];
var allNum = 0;


var game = io.of('/game');
game.on('connection', function(socket){
	//room构造函数
	function Room(roomid){
		this.roomId = roomid;
		this.userList=[];
		this.userId = {};
		this.gameOn=false;
		this.gamerList = [];
		this.gameNum = 0;
		this.gamerPoker = {};
		this.gameRound = 0;
		this.userIndex = 0;
		this.userTurn = 0;
		this.MURDER = null;
		this.PUBLISH = null;
		this.readyNum = 0;
	}
	Room.prototype ={
		gameInit:function(){
			this.gameOn = true;
			this.MURDER = null;
			for(i=0;i<this.userList.length;i++){
				this.gamerList[i] = this.userList[i];
			}
			this.gamerNum = this.gamerList.length;
			this.dealing(this.gamerNum);
			this.gameStart();
		},
		dealing:function(gamerNum){
			var poker = new Poker();
			poker.shuffling();
			console.log("这次的玩家有" + this.gamerList);
			switch(gamerNum){
				case 2:
					console.log('2个玩家');
					for(i=0;i<2;i++){
						var index = i*12;
						console.log( poker.pokers.slice(i*12,i*12+12));
						this.gamerPoker[this.gamerList[i]] = poker.pokers.slice(i*12,i*12+12);
							game.connected[this.userId[this.gamerList[i]]].emit('send poker', {poker:this.gamerPoker[this.gamerList[i]],num:2});
						}
					this.PUBLISH = poker.pokers.slice(24,27); 
					this.MURDER = poker.pokers[27];
					game.to(socket.ROOMNUM).emit('public pokers', this.PUBLISH);
					console.log('公共牌' + this.PUBLISH +' 凶手 ' + this.MURDER );
					break;
				case 3:
					for(i=0;i<3;i++){
						var index = i*8;
						console.log( poker.pokers.slice(i*8,i*8+8));
						this.gamerPoker[this.gamerList[i]] = poker.pokers.slice(i*8,i*8+8);
						game.connected[this.userId[this.gamerList[i]]].emit('send poker', {poker:this.gamerPoker[this.gamerList[i]],num:3});
					}
					this.PUBLISH = poker.pokers.slice(24,27); 
					this.MURDER = poker.pokers[27];
					game.to(socket.ROOMNUM).emit('public pokers', this.PUBLISH);
					console.log('公共牌' + this.PUBLISH +' 凶手 ' + this.MURDER );
					break;
				case 4:
					for(i=0;i<4;i++){
						var index = i*6;
						console.log( poker.pokers.slice(i*6,i*6+6));
						this.gamerPoker[this.gamerList[i]] = poker.pokers.slice(i*6,i*6+6);
						game.connected[this.userId[this.gamerList[i]]].emit('send poker', {poker:this.gamerPoker[this.gamerList[i]],num:4});
					}
					this.PUBLISH = poker.pokers.slice(24,27); 
					this.MURDER = poker.pokers[27];
					game.to(socket.ROOMNUM).emit('public pokers', this.PUBLISH);
					console.log('公共牌' + this.PUBLISH +' 凶手 ' + this.MURDER );
					break;
				case 5:
					for(i=0;i<5;i++){
						var index = i*5;
						console.log(poker.pokers.slice(i*5,i*5+5));
						this.gamerPoker[this.gamerList[i]] = poker.pokers.slice(i*5,i*5+5);
						game.connected[this.userId[this.gamerList[i]]].emit('send poker', {poker:this.gamerPoker[this.gamerList[i]],num:5});
					}
					this.PUBLISH = poker.pokers.slice(25,27); 
					this.MURDER = poker.pokers[27];
					game.to(socket.ROOMNUM).emit('public pokers', this.PUBLISH);
					console.log('公共牌' + this.PUBLISH +' 凶手 ' + this.MURDER );
					break;
				case 6:
					for(i=0;i<6;i++){
						var index = i*4;
						console.log(poker.pokers.slice(i*4,i*4+4));
						this.gamerPoker[this.gamerList[i]] = poker.pokers.slice(i*4,i*4+4);
						game.connected[this.userId[this.gamerList[i]]].emit('send poker', {poker:this.gamerPoker[this.gamerList[i]],num:6});
					}
					this.PUBLISH = poker.pokers.slice(24,27); 
					this.MURDER = poker.pokers[27];
					game.to(socket.ROOMNUM).emit('public pokers', this.PUBLISH);
					console.log('公共牌' + this.PUBLISH +' 凶手 ' + this.MURDER );
					break;
				default:
					break;
			}
		},
		gameStart:function(){
			console.log(this.userTurn + "," + this.gamerList[this.userIndex] );
			this.userTurn = this.gamerList[this.userIndex];
			console.log(socket.ROOMNAME);
			game.to(socket.ROOMNUM).emit('whos turn', this.userTurn);
		},
		nextTurn:function(){
			if(this.userIndex==this.gamerNum-1){
				this.userIndex = 0;
			}else{
				this.userIndex++
			}
			console.log('下一回合,轮到第' + this.userIndex );
			this.userTurn = this.gamerList[this.userIndex];
			game.to(socket.ROOMNUM).emit('whos turn', this.userTurn);
		}
	}
	//poker构造函数
	function Poker(){
		this.pokers=[1,2,3,4,5,6,7,11,12,13,14,15,16,17,21,22,23,24,25,26,27,31,32,33,34,35,36,37];
	}
	Poker.prototype = {
		//洗牌
		shuffling : function(){
			this.pokers.sort(function(){
				return Math.random()>0.5?-1:1; 
			});
		}
	}
	//连接成功
	socket.emit('server is Ok');

		
	
	var ADDEDUSER = false;
	
	
	//监测用户名
	socket.on('check nickName', function(nickName){
		var exist = false;
		for(i=0;i<allUserList.length;i++){
			if(nickName == allUserList[i]){
				exist=true;
				break;
			}
		}
		if(!exist){	
			//ADDEDUSER = true;
			//console.log('用户有：'+ userList);
			//userListJson = {users : userList};
			socket.emit('login okornot',true);
			//game.to(socket.ROOMNUM).emit('note user login', userListJson);
			//userNum++
			//readyNum = 0;
			//console.log(userNum + '名用户在线');
		}else{
			socket.emit('login okornot',false);
		}
	});
	//加入某个房间
	socket.on('user loginRoom' ,function(data){
		var roomNum = data[0];
		var roomName = "r"+roomNum;
		var nickName = data[1];
		var isRoomExist = false;
		for(i=0;i<ROOMS.length;i++){
			if(ROOMS[i] == roomName){
				isRoomExist=true;
				break;
			}
		}
		if(isRoomExist){
			socket.join(roomNum);
			socket.ADDEDUSER = true;
			roomName= "r"+roomNum;
			socket.ROOMNUM = roomNum;
			socket.ROOMNAME = roomName;
			socket.NICKNAME = nickName;
			console.log(roomName);
			ROOMS[roomName].userId[nickName] = socket.id;
			ROOMS[roomName].userList.push(nickName);
			allUserList.push(nickName);

			//玩家可以加入这个房间了
			console.log(nickName + " 进入了 房间"+ roomName );
			game.to(roomNum).emit('user inRoom', [roomNum,ROOMS[roomName].userList]);
		 }else{
		 	socket.emit('not this room');
		 }
		//roomList.push(roomNum);
		//console.log(roomList);
	});
	//创建新房间
	socket.on('create new room',function(nickName){
		var roomNum;
		var roomName;
		if(ROOMS.length == 0){
			roomNum=0;
		}else {
			var hasSpace = false;
			for(var i=0;i<ROOMS.length;i++){
				roomName = "r"+i;
				if(ROOMS[i] != roomName){ roomNum = i; hasSpace = true;  break;}
			}
			if(!hasSpace){
			 	roomNum = ROOMS.length;
			}
		}

		socket.join(roomNum);
		socket.ADDEDUSER = true;
		roomName= "r"+roomNum;
		socket.ROOMNUM = roomNum;
		socket.ROOMNAME = roomName;
		socket.NICKNAME = nickName;
		console.log(roomName);
		ROOMS.push(roomName);
		ROOMS[roomName] = new Room(roomNum);

		ROOMS[roomName].userId[nickName] = socket.id;
		ROOMS[roomName].userList.push(nickName);
		allUserList.push(nickName);
		console.log(nickName + " 进入了 房间"+ roomName );

		socket.emit('user inRoom', [roomNum,ROOMS[roomName].userList]);

	});
	//监听用户准备
	socket.on('im ready',function(){
		ROOMS[socket.ROOMNAME].readyNum ++;
		console.log('someone is ready!' + ROOMS[socket.ROOMNAME].readyNum +" " + ROOMS[socket.ROOMNAME].userList.length);
		if(ROOMS[socket.ROOMNAME].readyNum==ROOMS[socket.ROOMNAME].userList.length && ROOMS[socket.ROOMNAME].readyNum > 1){
			game.to(socket.ROOMNUM).emit('all is ready');
			console.log(ROOMS[socket.ROOMNAME]);
			ROOMS[socket.ROOMNAME].gameInit();
			ROOMS[socket.ROOMNAME].readyNum = 0;
		}
	});
	//监听用户要牌
	socket.on('user order',function(choice){
		console.log('用户要了'+ choice);
		socket.broadcast.to(socket.ROOMNUM).emit('request poker', choice);
	});	
	//监听其他玩家给牌
	socket.on('delivered poker',function(data){
		console.log('传递扑克');
		
		game.connected[ROOMS[socket.ROOMNAME].userId[ROOMS[socket.ROOMNAME].gamerList[ROOMS[socket.ROOMNAME].userIndex]]].emit('accept poker', data);
	});
	//没有牌给
	socket.on('deliver nopoker',function(name){
		//if(ROOMS[socket.ROOMNAME].userId[ROOMS[socket.ROOMNAME].gamerList[ROOMS[socket.ROOMNAME].userIndex]]){
			game.connected[ROOMS[socket.ROOMNAME].userId[ROOMS[socket.ROOMNAME].gamerList[ROOMS[socket.ROOMNAME].userIndex]]].emit('accept nopoker', name);
		//}
	});
	//扔的第一张
	socket.on('drop firstPoker',function(poker){
		socket.broadcast.to(socket.ROOMNUM).emit('one of three', {pokerid:poker,who:ROOMS[socket.ROOMNAME].userTurn});
		ROOMS[socket.ROOMNAME].nextTurn();
		console.log(ROOMS[socket.ROOMNAME].userTurn + '扔了三张！');
	});
	//扔的其他，别人不知道，自己知道
	socket.on('drop otherPoker',function(pokers){
		socket.emit('others poker', pokers);
		
	});
	//只扔了一张
	socket.on('drop onePoker',function(poker){
		game.to(socket.ROOMNUM).emit('only onePoker',{pokerid:poker,who:ROOMS[socket.ROOMNAME].userTurn});
		ROOMS[socket.ROOMNAME].nextTurn();
		console.log(ROOMS[socket.ROOMNAME].userTurn + '扔了一张！');
	});
	
	//监听guess
	socket.on('guess',function(data){
		console.log('有人才了');
		console.log(data.pokerid);
		if(data.pokerid == ROOMS[socket.ROOMNAME].MURDER ){
			game.to(socket.ROOMNUM).emit('bingo',{who:data.who,pokerid:data.pokerid});
			ROOMS[socket.ROOMNAME].gameOn = false;
			ROOMS[socket.ROOMNAME].gamerPoker ={};
			ROOMS[socket.ROOMNAME].gamerNum = 0;
			ROOMS[socket.ROOMNAME].readyNum = 0;
			
		}else{
			game.to(socket.ROOMNUM).emit('guess failed', {who:data.who,pokerid:data.pokerid});
			for(i=0;i<ROOMS[socket.ROOMNAME].gamerList.length;i++){
				if(ROOMS[socket.ROOMNAME].gamerList[i]==data.who){
					ROOMS[socket.ROOMNAME].gamerList.splice(i,1);
				}
			}
			ROOMS[socket.ROOMNAME].gamerNum--;
			if(ROOMS[socket.ROOMNAME].gamerNum==1){
				ROOMS[socket.ROOMNAME].gameOn = false;
				ROOMS[socket.ROOMNAME].gamerPoker ={};
				ROOMS[socket.ROOMNAME].gamerNum = 0;
				ROOMS[socket.ROOMNAME].readyNum = 0;
				game.to(socket.ROOMNUM).emit('game over');
			}else{
				ROOMS[socket.ROOMNAME].userIndex--;
				ROOMS[socket.ROOMNAME].nextTurn();
			}
		}
	});
	//手牌没了
	socket.on('show my pokers',function(data){
		socket.broadcast.to(socket.ROOMNUM).emit('show its pokers', data);
	});
	//测试专用
	/*socket.on('test',function(){
		console.log('测试通过');
	});
	监听接收消息
    socket.on('send message', function (data) {
		game.to(socket.ROOMNUM).emit('show message', data);
        console.log(data);
    });*/
	
	//断开连接
	socket.on('disconnect', function(){
		if(socket.ADDEDUSER){
			for(var i=0;i<ROOMS[socket.ROOMNAME].userList.length;i++){
				if(ROOMS[socket.ROOMNAME].userList[i]==socket.NICKNAME){
					console.log( socket.NICKNAME +'登出');
					ROOMS[socket.ROOMNAME].userList.splice(i,1);
					game.to(socket.ROOMNUM).emit('note user loginout', ROOMS[socket.ROOMNAME].userList);
					ROOMS[socket.ROOMNAME].readyNum = 0;
					console.log(ROOMS[socket.ROOMNAME].userList.length);
					if(ROOMS[socket.ROOMNAME].userList.length == 0){
						console.log(ROOMS.length + ',' + socket.ROOMNAME);
						for(i=0;i<ROOMS.length; i++	){
							console.log('room'+ i + ":" + ROOMS[i] + ",");
							if(ROOMS[i] == socket.ROOMNAME){
								console.log('删除了房间'+ ROOMS[socket.ROOMNAME]);
								ROOMS.splice(i,1);
								break;
							}
						}
					}
					//console.log('准备人数:'+ROOMS[socket.ROOMNAME].readyNum);
					break;
				}
			}
			for(i=0;i<allUserList.length;i++){
				if(allUserList[i] == socket.NICKNAME){
					allUserList.splice(i,1);
					break;
				}
			}

			console.log(allUserList);
		}
	});
});