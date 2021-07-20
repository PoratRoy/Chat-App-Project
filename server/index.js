
require('dotenv').config();
const express = require('express');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const socketio = require('socket.io');
const {addUser, removeUser, getUser} = require('./users');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
require('./config/routes')(app);
require('./config/db')();
require('./config/prod')(app);


//handeling errors
process.on('unhandledRejection', (err, promise) => {
    console.log(err.message);
    server.close(()=> {process.exit(1)});
})


const server = app.listen(PORT, ()=> {console.log(`Listening to port ${PORT}....`)});

const io = socketio(server);
 
//connect
io.on('connect', (socket)=>{

    //add login user to users socket array
    socket.on('addUserToArray', userId =>{
        addUser(userId, socket.id);
    })

    //add new register user to users socket array
    socket.on('addNewRegisterUser', userId =>{
        addUser(userId, socket.id);
        io.emit('getNewRegisterUser', userId);
    })

    //send and get message
    socket.on('newArrivalMessageToServer',({senderId, receiver,text}) =>{
        const receiverId = receiver._id;
        const receivedUser = getUser(receiverId);
        if(receivedUser){
            io.to(receivedUser.socketId).emit('newArrivalMessageToClient',{
                senderId,
                receiverId,
                text
            })
        }
    })

    //update the new group that open
    socket.on('addNewGroup', (receiverId) => {
        const receivedUser = getUser(receiverId);
        if(receivedUser){
            io.to(receivedUser.socketId).emit('updateGroups')
        }
    })

    //disconnect
    socket.on('disconnect',()=>{
        removeUser(socket.id);
        console.log('user has left');
    })
});

