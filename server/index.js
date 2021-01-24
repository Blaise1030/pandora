const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const PORT = process.env.PORT || 5000
const router = require('./router');
const { text } = require('express');
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    wsEngine: 'ws',
    cors: {
        origin: "*",
    },
});

currentUsers = [];

const addNewUsers = (socketId) => {
    currentUsers
}



io.on('connection', socket => {
    socket.on('join', () => {
        const socketId = socket.id;


    })
    // socket.on("join", () => {
    //     const socketId = socket.id;
    //     addUser({ socketId: socketId });
    //     const { findUser, newRoom, userSocketId } = pairUsers(socketId);
    //     // generates a join id for user
    //     socket.emit("join-id", findUser(userSocketId));
    //     // broadcast to the user 
    //     socket.broadcast.to(findUser.socketId).emit("join-id", findUser(findUser));
    // })

    // socket.on('disconnect', () => {
    //     const user = removeUser(socket.id);
    //     if (user && user.room) {
    //         io.to(user.room).emit('user_disconnected', {})
    //     }
    // })

    // socket.on('request_room', () => {
    //     const currentUser = findUser(socket.id);
    //     if (currentUser && currentUser.room) {
    //         io.to(user.room).emit('user_disconnected', {})
    //     }
    //     const { findUser, newRoom, userSocketId } = pairUsers(socketId);
    //     socket.emit()

    // })



    // socket.on('request-room', () => {

    // })


    // socket.on('join', ({ userId, room }, callback) => {
    //     const { error, user } = addUser({ id: socket.id, userId: userId, room: room })
    //     if (error) return callback(error)
    //     socket.emit('message', { user: 'admin', text: `${user.userId} you are connected` });
    //     socket.broadcast.to(user.room).emit('message', { user: "admin", text: `${user.userId} has joined` })
    //     socket.join(user.room);
    // })

    // socket.on('disconnect', () => {
    //     const user = removeUser(socket.id);
    //     if (user)
    //         io.to(user.room).emit('message', { user: 'admin', text: `${user.userId} has disconnected` })
    // })
    // socket.on('sendMessage', (message, callback) => {
    //     const user = getUser(socket.id);
    //     // const message = {
    //     //     user: user.userId,
    //     //     text: message
    //     // }
    //     if (user && user.room)
    //         io.to(user.room).emit('message', { user: user.userId, text: message })
    // })



})



app.use(router);

server.listen(PORT, () => {
    console.log('server has started on PORT');
});
