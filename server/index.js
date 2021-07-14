
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
    console.log(err); //err.message
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
        const receivedUser = getUser(receiver._id);
        if(receivedUser){
            io.to(receivedUser.socketId).emit('newArrivalMessageToClient',{
                senderId,
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

 

    
    // socket.on('join', async ({userName, group})=>{
    //     console.log(`user ${userName} connect to group ${group}`);
        
    //     try{
    //         const user = addUser({id: socket.id, userName, group});

    //         socket.emit('alert', {user: 'admin', text: `${user.name}, welcome to group ${group}`});
    //         socket.broadcast.to(user.group).emit('alert', {user: 'admin', text: `${user.name}, enter the group`});
            
    //         socket.join(user.group);
    //     }
    //     catch (err){
    //         console.log('error in join user to group');
    //     }
    // });

    // socket.on('sendMessage',async (props)=> { 

    //     try{
    //         const user = getUser(socket.id);

    //         io.to(props.group).emit('message', {user:user.name, text: props.message}); 
    //     }
    //     catch (err){
    //         console.log('error in send message');
    //     }
    // })

    // socket.on('disconnect',()=>{
    //     const users = removeUser(socket.id);
    //     //io.to(user.group).emit('alert', {user: 'admin', text: `${user.name}, has left the group`});
    //     //console.log(`${user.name}, has left group ${user.group}`);
    
    // })



});

