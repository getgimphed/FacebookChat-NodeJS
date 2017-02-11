module.exports = function(io,rooms){
  var chatrooms = io.of('/roomlist').on('connection',function(socket){
    console.log('Server Connection Established !');
    socket.emit('roomUpdate', JSON.stringify(rooms));

    socket.on('newRoom',function(data){
      rooms.push(data);
      console.log(rooms);
      socket.broadcast.emit('roomUpdate', JSON.stringify(rooms));
      socket.emit('roomUpdate', JSON.stringify(rooms));
    });
  });
}
