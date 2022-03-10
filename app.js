const express = require('express'); //requires express module
const socket = require('socket.io'); //requires socket.io nodule
const ts = require('fs');
const app = express();
var PORT = process.env. PORT || 3000; var PORT;
const server = app.listen(PORT); //tells to host server on localhost:3000
//Playing variables:
app.use(express.static('public')); //show static files in 'pub lic' directory
console. log('Server is running');
const io = socket(server);
var count = 0;
var turn = "X";
var xyCoordinates = ""

//PS Socket.io Connection-
io.on('connection', (socket) => {
    socket.on('create', function(room) {
        const room_data = JSON.parse(room)
        const roomName = room_data.roomName;
        
        count++;
        console.log(room_data);
        //io.emit('counter', room_data);   
        //io.emit('data', room_data);
        //io.emit('xyCoordinates')
        socket.join(`${roomName}`);
        //io.to(`${roomName}`).emit('counter', room_data);
        //socket.broadcast.to(`${roomName}`).emit('counter', room_data)
        // write new message of new user
        //io.to(`${roomName}`).emit('newUserToChatRoom');
    });

    socket.on('counter',function(data) {
        console.log("Data", data);
        const parameterData = JSON.parse(data);
        io.to(parameterData.roomName).emit('counter', data);
        console.log("Counter");
    });

    /*io.on('newMessage',function(data) {
        console.log('newMessage triggered')
    
        const messageData = JSON.parse(data)
        const messageContent = messageData.content
        const roomName = messageData.roomName
        console.log('message: ', messageContent);
        console.log(`[Room Number ${roomName}] : ${messageContent}`)
        // Just pass the data that has been passed from the writer socket
    
        const chatData = {
            messageContent : messageContent,
            roomName : roomName
        }
        console.log('JSON', JSON.stringify(chatData));
        socket.broadcast.to(`${roomName}`).emit('updateChat',JSON.stringify(chatData)) // Need to be parsed into Kotlin object in Kotlin
    })*/
    console.log("New socket connection:" + socket.id);
});



/*io.sockets.in("room1").emit('counter', () => {
    count++;
    io. emit('counter', count);   
});*/