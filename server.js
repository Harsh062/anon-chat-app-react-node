const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');
const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('A user got connected to the server');

  // Actions for a 'disconnect' event (when client's socket is closed)
  socket.on('disconnect', function(){
    const message = { 
      message: "A user has disconnected from the server.",
      color: "#000",
      time: moment().format('LT')
    };
    io.emit("user:leave", message);
    console.log('user disconnected');
  });

  // Actions for a 'user-leave' event
  socket.on('user-leave', function(color){
    const message = {
      message: "A user has left the coversation",
      color: color,
      time: moment().format('LT')
    };
    io.emit("user:leave", message);
    console.log('user left');
  });

  // Actions for a 'user-join' event
  socket.on('user-join', function(color){
    const message = {
      message: "A user has joined the conversation.",
      color: color,
      time: moment().format('LT')
    };
    io.emit("user:join", message);
    console.log('user joined', message);
  });

  // Actions for a 'user-typing' event
  socket.on('user-typing', function(color){
    const message = {
      message: "User is typing a message...",
      color: color
    };
    socket.broadcast.emit("user:typing", message);
  });

  // Actions for a 'user-message' event
  socket.on("user-message", function(msg){
    msg.time = moment().format('LT');
    console.log('A user sent a message', msg);
    io.emit("user:message", msg);
  });


});

http.listen(PORT, () => {
  console.log('Express chat server on port ' + PORT);
});