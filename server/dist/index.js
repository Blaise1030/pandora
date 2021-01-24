"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = __importDefault(require("http"));
const PORT = process.env.PORT || 5000;
const app = express();
const server = http_1.default.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});
var users = [];
function addNewUsers(socketId) {
    users.push({ socketId: socketId, room: null });
    return users;
}
function findsUser(socketId) {
    return users.find((user) => user.socketId === socketId);
}
function updatesUser(socketId, replacement) {
    users = users.map((user) => user.socketId === socketId ? replacement(user) : user);
    return users;
}
function deleteUser(socketId) {
    users = users.filter((user) => user.socketId != socketId);
    return users;
}
function findsIdleUser(socketId) {
    var allIdleUsers = users.filter((user) => user.socketId != socketId && !user.room);
    if (allIdleUsers.length > 1)
        return allIdleUsers[Math.floor(Math.random() * allIdleUsers.length)];
    else if (allIdleUsers.length === 1)
        return allIdleUsers[0];
    else if (allIdleUsers.length === 0)
        return null;
}
function pairsUser(socketId) {
    const idleUser = findsIdleUser(socketId);
    if (idleUser) {
        const newRoomId = idleUser.socketId + socketId;
        updatesUser(socketId, (user) => ({ socketId: user.socketId, room: newRoomId }));
        updatesUser(idleUser.socketId, (user) => ({ socketId: user.socketId, room: newRoomId }));
        return [findsUser(socketId), findsUser(idleUser.socketId)];
    }
    return null;
}
io.on('connection', (socket) => {
    socket.on('join', () => {
        const socketId = socket.id;
        addNewUsers(socketId);
        const pairedUsers = pairsUser(socketId);
        if (pairedUsers) {
            socket.emit("join-id", pairedUsers[0]);
            io.to(pairedUsers[1].socketId).emit("join-id", pairedUsers[1]);
        }
        else {
            socket.emit("join-id", { socketId: socketId, room: null });
        }
    });
    socket.on('agree-join', (user) => socket.join(user.room));
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
});
server.listen(PORT);
//# sourceMappingURL=index.js.map