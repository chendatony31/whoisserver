var io = require('socket.io').listen(3000);
io.on('connection', function(socket){
	console.log("user connect");
	socket.emit('news', { msg: '你已经连接上服务器！' });
	
    socket.on('send message', function (data) {
		socket.emit('show message', data);
        console.log(data);
    });
	socket.on('disconnect', function(){
		console.log('user disconnected');
  });
});