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

var players = {}; // opponent: scoket.id of the opponent, symbol = "X" | "O", socket: player's socket
var unmatched;

// When a client connects
io.on("connection", function(socket) {
    let id = socket.id;

    console.log("New client connected. ID: ", socket.id);
    clients[socket.id] = socket;

    socket.on("disconnect", () => {// Bind event for that socket (player)
        console.log("Client disconnected. ID: ", socket.id);
        delete clients[socket.id];
        socket.broadcast.emit("clientdisconnect", id);
    });

    join(socket); // Fill 'players' data structure

    if (opponentOf(socket)) { // If the current player has an opponent the game can begin
        socket.emit("game.begin", { // Send the game.begin event to the player
            symbol: players[socket.id].symbol
        });

        opponentOf(socket).emit("game.begin", { // Send the game.begin event to the opponent
            symbol: players[opponentOf(socket).id].symbol 
        });
    }


    // Event for when any player makes a move
    socket.on("make.move", function(data) {
        if (!opponentOf(socket)) {
            // This shouldn't be possible since if a player doens't have an opponent the game board is disabled
            return;
        }

        // Validation of the moves can be done here

        socket.emit("move.made", data); // Emit for the player who made the move
        opponentOf(socket).emit("move.made", data); // Emit for the opponent
    });

    // Event to inform player that the opponent left
    socket.on("disconnect", function() {
        if (opponentOf(socket)) {
        opponentOf(socket).emit("opponent.left");
        }
    });
});


function join(socket) {
    players[socket.id] = {
        opponent: unmatched,
        symbol: "X",
        socket: socket
    };

    // If 'unmatched' is defined it contains the socket.id of the player who was waiting for an opponent
    // then, the current socket is player #2
    if (unmatched) { 
        players[socket.id].symbol = "O";
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else { //If 'unmatched' is not define it means the player (current socket) is waiting for an opponent (player #1)
        unmatched = socket.id;
    }
}

function opponentOf(socket) {
    if (!players[socket.id].opponent) {
        return;
    }
    return players[players[socket.id].opponent].socket;
}

//PS Socket.io Connection-
/*io.on('connection', (socket) => {
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
        socket.broadcast.to(parameterData.roomName).emit('counter', data);
        //io.to(parameterData.roomName).emit('counter', data);
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
    //console.log("New socket connection:" + socket.id);
//});



/*io.sockets.in("room1").emit('counter', () => {
    count++;
    io. emit('counter', count);   
});*/