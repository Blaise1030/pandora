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



// const users = [];

// const getIdleUser = () => {
//     // Chooses a user by random 
//     const allIdleUsers = users.filter((user) => user.room);
//     return allIdleUsers[Math.floor(Math.random() * allIdleUsers)];
// }

// const removeUser = (socketId) => {
//     const index = users.findIndex((user) => user.socketId === socketId);
//     if (index != -1) {
//         return users.splice(index, 1)[0];
//     }
// }

// const setUserRoom = (socketId, roomId) => {
//     users = users.map((user) => {
//         user.socketId === socketId ?
//             {
//                 socketId: user.socketId,
//                 room: roomId
//             } : user
//     })
// }

// const addUser = (userData) => {
//     users.push(userData);
//     return users;
// }

// const findUser = (socketId) => users.find((user) => user.socketId === socketId)

// const pairUsers = (userSocketId) => {
//     const findUser = getIdleUser();
//     const newRoom = findUser.socketId + findUser;
//     setUserRoom(findUser.socketId, newRoom);
//     setUserRoom(userSocketId, newRoom);
//     return newRoom
// }

io.on('connection', socket => {
    // socket.on("join", (socket) => {
    //     const socketId = socket.id;
    //     addUser({ socketId: socketId });
    //     pairUsers(socketId);
    //     socket.emit("join-id", findUser(socketId));
    // })

    // socket.on('disconnect', () => {
    //     const user = removeUser(socket.id)
    //     if (user)
    //         io.to(user.room).emit('message', { user: 'admin', text: `${user.socketId} has disconnect` })
    // })

    // socket.on('request-room', () => {

    // })


    socket.on('join', ({ userId, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, userId: userId, room: room })
        if (error) return callback(error)
        socket.emit('message', { user: 'admin', text: `${user.userId} you are connected` });
        socket.broadcast.to(user.room).emit('message', { user: "admin", text: `${user.userId} has joined` })
        socket.join(user.room);
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user)
            io.to(user.room).emit('message', { user: 'admin', text: `${user.userId} has disconnected` })
    })
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        // const message = {
        //     user: user.userId,
        //     text: message
        // }
        if (user && user.room)
            io.to(user.room).emit('message', { user: user.userId, text: message })
    })



})



app.use(router);

server.listen(PORT, () => {
    console.log('server has started on PORT');
});
