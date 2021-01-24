import express = require("express");
import http from 'http';
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});

type User = {
    socketId: string
    room: string | null
}

var users: Array<User> = [];
var historicRooms: Array<string> = [];

function addToHistoricRoom(newRoom: string) {
    // Reset the room array    
    if (historicRooms.length > 10)
        historicRooms = [];
    historicRooms.push(newRoom);
}

function addNewUsers(socketId: string): Array<User> {
    users.push({ socketId: socketId, room: null })
    return users;
}

function findsUser(socketId: string): User {
    return users.find((user: User) => user.socketId === socketId)
}

function updatesUser(socketId: string, replacement: (arg1: User) => User): Array<User> {
    users = users.map((user: User) => user.socketId === socketId ? replacement(user) : user);
    return users
}

function deleteUser(socketId: string) {
    users = users.filter((user: User) => user.socketId != socketId)
    return users;
}

function findsIdleUser(socketId: string): User {
    var allIdleUsers: Array<User> = users.filter((user: User) => user.socketId != socketId && !user.room);
    if (allIdleUsers.length > 1)
        return allIdleUsers[Math.floor(Math.random() * allIdleUsers.length)]
    else if (allIdleUsers.length === 1)
        return allIdleUsers[0]
    else if (allIdleUsers.length === 0)
        return null
}

function pairsUser(socketId: string): Array<User> {
    const idleUser: User = findsIdleUser(socketId);
    if (idleUser) {
        const newRoomId = idleUser.socketId + socketId;
        if (!historicRooms.find((roomId: string) => newRoomId === roomId)) {
            addToHistoricRoom(newRoomId);
            updatesUser(socketId, (user: User) => ({ socketId: user.socketId, room: newRoomId }))
            updatesUser(idleUser.socketId, (user: User) => ({ socketId: user.socketId, room: newRoomId }));
            return [findsUser(socketId), findsUser(idleUser.socketId)];
        }
        return null
    }
    return null;
}



const ON_USER_JOIN: string = 'join'
const GIVE_JOIN_ID: string = 'join-id'
const AGREE_JOIN_ROOM: string = 'agree-join'
const AGREE_LEAVE_ROOM: string = 'agree-leave'
const USER_DISCONNECTS: string = 'disconnect'
const PARTNER_DISCONNECTED: string = 'partner-disconnected'
const SEARCH_NEW: string = 'search-new'
const SEND_MESSAGE: string = 'send-message'



io.on('connection', (socket: any) => {
    // On user join 
    socket.on(ON_USER_JOIN, () => {
        const socketId = socket.id;
        addNewUsers(socketId);
        const pairedUsers: Array<User> = pairsUser(socketId);
        if (pairedUsers) {
            socket.emit(GIVE_JOIN_ID, pairedUsers[0])
            io.to(pairedUsers[1].socketId).emit(GIVE_JOIN_ID, pairedUsers[1])
        } else {
            socket.emit(GIVE_JOIN_ID, { socketId: socketId, room: null })
        }
    })

    socket.on(AGREE_LEAVE_ROOM, (user: User) => {
        const socketId = socket.id;
        socket.leave(user.room)
        updatesUser(socketId, (user: User) => ({ socketId: socketId, room: null }))
        const pairedUsers: Array<User> = pairsUser(socketId);
        if (pairedUsers) {
            socket.emit(GIVE_JOIN_ID, pairedUsers[0])
            io.to(pairedUsers[1].socketId).emit(GIVE_JOIN_ID, pairedUsers[1])
        } else {
            socket.emit(GIVE_JOIN_ID, { socketId: socketId, room: null })
        }
    });

    socket.on(AGREE_JOIN_ROOM, (user: User) => socket.join(user.room))

    socket.on(USER_DISCONNECTS, () => {
        const socketId: string = socket.id;
        const user: User = findsUser(socketId);
        if (user && user.room)
            io.to(user.room).emit(PARTNER_DISCONNECTED, { socketId: 'admin', text: "You are disconnected" });
        deleteUser(socketId);
    });

    socket.on(SEARCH_NEW, (user: User) => {
        if (user && user.room)
            io.to(user.room).emit(PARTNER_DISCONNECTED, { socketId: 'admin', text: "You are disconnected" })
    });

    socket.on(SEND_MESSAGE, (msg: string) => {
        const user = findsUser(socket.id);
        if (user && user.room)
            io.to(user.room).emit('message', { socketId: socket.id, text: msg })
    })

    socket.on('typingMessage', () => {
        const user = findsUser(socket.id);
        if (user && user.room)
            socket.broadcast.to(user.room).emit('partner-typing', true)
    })

    socket.on('noLongerTypingMessage', () => {
        const user = findsUser(socket.id);
        if (user && user.room)
            socket.broadcast.to(user.room).emit('partner-no-longer-typing', false)
    })

})

server.listen(PORT);
