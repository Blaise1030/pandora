"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT || 5000;
const app = express();
const server = http_1.default.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});
var users = [];
var historicRooms = [];
function addToHistoricRoom(newRoom) {
    // Reset the room array    
    if (historicRooms.length > 10)
        historicRooms = [];
    historicRooms.push(newRoom);
}
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
        if (!historicRooms.find((roomId) => newRoomId === roomId)) {
            addToHistoricRoom(newRoomId);
            updatesUser(socketId, (user) => ({ socketId: user.socketId, room: newRoomId }));
            updatesUser(idleUser.socketId, (user) => ({ socketId: user.socketId, room: newRoomId }));
            return [findsUser(socketId), findsUser(idleUser.socketId)];
        }
        return null;
    }
    return null;
}
const ON_USER_JOIN = 'join';
const GIVE_JOIN_ID = 'join-id';
const AGREE_JOIN_ROOM = 'agree-join';
const AGREE_LEAVE_ROOM = 'agree-leave';
const USER_DISCONNECTS = 'disconnect';
const PARTNER_DISCONNECTED = 'partner-disconnected';
const SEARCH_NEW = 'search-new';
const SEND_MESSAGE = 'send-message';
io.on('connection', (socket) => {
    // On user join 
    socket.on(ON_USER_JOIN, () => {
        const socketId = socket.id;
        addNewUsers(socketId);
        const pairedUsers = pairsUser(socketId);
        if (pairedUsers) {
            socket.emit(GIVE_JOIN_ID, pairedUsers[0]);
            io.to(pairedUsers[1].socketId).emit(GIVE_JOIN_ID, pairedUsers[1]);
        }
        else {
            socket.emit(GIVE_JOIN_ID, { socketId: socketId, room: null });
        }
    });
    socket.on(AGREE_LEAVE_ROOM, (user) => {
        const socketId = socket.id;
        socket.leave(user.room);
        updatesUser(socketId, (user) => ({ socketId: socketId, room: null }));
        const pairedUsers = pairsUser(socketId);
        if (pairedUsers) {
            socket.emit(GIVE_JOIN_ID, pairedUsers[0]);
            io.to(pairedUsers[1].socketId).emit(GIVE_JOIN_ID, pairedUsers[1]);
        }
        else {
            socket.emit(GIVE_JOIN_ID, { socketId: socketId, room: null });
        }
    });
    socket.on(AGREE_JOIN_ROOM, (user) => socket.join(user.room));
    socket.on(USER_DISCONNECTS, () => {
        const socketId = socket.id;
        const user = findsUser(socketId);
        if (user && user.room)
            io.to(user.room).emit(PARTNER_DISCONNECTED, { socketId: 'admin', text: "You are disconnected" });
        deleteUser(socketId);
    });
    socket.on(SEARCH_NEW, (user) => {
        if (user && user.room)
            io.to(user.room).emit(PARTNER_DISCONNECTED, { socketId: 'admin', text: "You are disconnected" });
    });
    socket.on(SEND_MESSAGE, (msg) => {
        const user = findsUser(socket.id);
        if (user && user.room)
            io.to(user.room).emit('message', { socketId: socket.id, text: msg });
    });
    socket.on('typingMessage', () => {
        const user = findsUser(socket.id);
        if (user && user.room)
            socket.broadcast.to(user.room).emit('partner-typing', true);
    });
    socket.on('noLongerTypingMessage', () => {
        const user = findsUser(socket.id);
        if (user && user.room)
            socket.broadcast.to(user.room).emit('partner-no-longer-typing', false);
    });
});
app.use(cors_1.default());
server.listen(PORT);
//# sourceMappingURL=index.js.map