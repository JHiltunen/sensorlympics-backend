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

io.on('connection', (socket) => {
    socket.on('create', function(room) {
        const tic_tac_toe_data = JSON.parse(room)
        socket.broadcast.emit('counter', tic_tac_toe_data);
    });
    console.log("New socket connection:" + socket.id);
});
