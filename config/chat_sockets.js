module.exports.chatSockets=function(socketServer){
    let io=require('socket.io')(socketServer);
    // console.log('io',io);
    io.sockets.on('connection',function(socket){
        // console.log('socket:',socket);
        
        console.log('new connection recieved',socket.id);
        socket.on('disconnect',function(){
            console.log('socket disconnected!');

        });
        
        //recieving a request of joining the chat room
        socket.on('join_room',function(data){
            console.log('joining request rec.',data);
            //sockets.join(room_name) add client to room.
            socket.join(data.chatroom);
            //sending the acknowledgement that user is connected
            io.in(data.chatroom).emit('user_joined',data);

        });

        // detect send_message and broadcast to everyone in the room
        socket.on('send_message',function(data){
            console.log(data.message);
        
            io.in(data.chatroom).emit('receive_message',data);
        });

        //receiving a request for broadcasting
        socket.on('typing',function(data){
            //sending broadcasting to other users
            socket.broadcast.emit('typing',data)
        })

        //receiving a request for broadcasting nothing
        socket.on('stop_typing',function(data){
            //sending broadcasting to other users
            socket.broadcast.emit('stop_typing',data)
        })

    });

}