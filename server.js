var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

io.on('connection', function(socket){
  console.log('a user connected');

  // Actions for a 'disconnect' event (when client's socket is closed)
  socket.on('disconnect', function(){
    var message = { 
      message: "An user has disconnected from the server.",
      color: "#000",
      time: moment().format('LT')
    };
    io.emit("user:leave", message);
    console.log('user disconnected');
  });

  // Actions for a 'user-leave' event
  socket.on('user-leave', function(color){
    var message = {
      message: "An user has leave from the server.",
      color: color,
      time: moment().format('LT')
    };
    io.emit("user:leave", message);
    console.log('user leave');
  });

  // Actions for a 'user-join' event
  socket.on('user-join', function(color){
    var message = {
      message: "An user has join to the server.",
      color: color,
      time: moment().format('LT')
    };
    io.emit("user:join", message);
    console.log('user join', message);
  });

  // Actions for a 'user-typing' event
  socket.on('user-typing', function(color){
    var message = {
      message: "User is typing a message.",
      color: color
    };
    socket.broadcast.emit("user:typing", message);
  });

  // Actions for a 'user-message' event
  socket.on("user-message", function(msg){
    msg.time = moment().format('LT');
    console.log('user send a message', msg);
    io.emit("user:message", msg);
  });


});

app.set('port', 5000);


// Serve static files
// app.get('/', function(req, res) {
//   console.log('Yolo zindagi');
// });

http.listen(app.get('port'), function(){
  console.log('Express chat server on port ' + app.get('port'));
});