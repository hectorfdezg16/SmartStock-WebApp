//this is the file that it starts my app

//to commit
//file that it starts my app
import dotenv from 'dotenv';
dotenv.config();

import app from './server';
import database from './database';
var server = require('http').Server(app);
const options= {   
    transports: ["websocket"],
       cors: {     origin: "*",
            methods: ["GET", "POST"]} };


let io = require('socket.io')(server,options);


//const io = new Server(server);

io.on('connection', (socket: any) => {
    console.log("Socket listening with id: "+socket.id);

    socket.on('escribiendo',(chatID: any) =>{
        socket.to(chatID).emit('escribiendo',chatID);
    });
    socket.on('newmsg',(data: any) =>{
        console.log(data);
        console.log(data.room);
        socket.to(data.room).emit('newmsg', data);
        console.log("se ha enviado mensaje");
    });
    //actually disconnects automatically: do not remove "porsiacaso"
    socket.on('disconnect', (data: any) => {
        socket.to(data).disconnect();
        console.log("Disconnected chat with id: "+socket.id);
    });
    socket.on('joinrooms', (rooms: any) =>{
        socket.join(rooms);
        console.log(rooms);
        console.log("Joined to rooms");
    });
});


//CONNECTS SOCKET
var server_port = process.env.PORT || 3000;
//we obviate the error
server.listen(server_port, () => {
    console.log('listening on http://localhost:' + server_port);
});


//CONNECTS MONGODB
app.listen(app.get('port'), () => {
    //Express Application
    console.log(`Server on port: ${app.get('port')}`);
    //Database connection
    console.log(`Using mongoDB version: ${database.version}`);
});
