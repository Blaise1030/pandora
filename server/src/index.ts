import express = require("express");
import http from 'http';
import cors from 'cors';
import { Socket, Server } from 'socket.io'
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app);
const io: Server = require('socket.io')(server, {
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
        const newRoomId2 = socketId + idleUser.socketId;
        if (!historicRooms.find((roomId: string) => newRoomId === roomId || newRoomId2 === roomId)) {
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
        if (user && user.room){
            io.to(user.room).emit(PARTNER_DISCONNECTED);   
        }                     
        deleteUser(socketId);
    });

    socket.on(SEARCH_NEW, (user: User) => {        
        if (user && user.room){
            socket.leave(user.room)
            socket.broadcast.to(user.room).emit(PARTNER_DISCONNECTED)            
        }            
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


// type User1 = {
//     socketId: string,
//     partner: string | null,
// }

// type UserPairs = {
//     socket1: User1,
//     socket2: User1,
// }

// type Tuple<T, X> = {
//     elem1: T,
//     elem2: X
// }

// type Message = {
//     socketId:string,
//     text:string
// }

// var currentUsers: Array<User1> = [];
// var historicConnection: Array<string> = [];


// // HelperFunction

// const isSame = (arg1: string, arg2: string) => arg1 === arg2
// const removeUser = (socket: string): void => { currentUsers.filter((user: User1) => !isSame(user.socketId, socket)) }
// const getUser = (socket: string): Array<User1> => currentUsers.filter((user: User1) => isSame(user.socketId, socket));
// const addUser = (socket: string): User1 => { currentUsers.push({ socketId: socket, partner: null }); return { socketId: socket, partner: null } }
// const updateUser = (socket: string, updateUser: (arg1: User1) => User1): void => {
//     currentUsers.map((user: User1) => isSame(user.socketId, socket) ? updateUser(user) : user);
// }
// const hasAlreadyConnected = (socket1: string, socket2: string): boolean => {
//     const id1 = socket1 + socket2;
//     const id2 = socket2 + socket1;
//     const room = historicConnection.find((connectionId: string) => isSame(connectionId, id1) || isSame(connectionId, id2))
//     return room ? true : false
// }
// const addNewRoom = (roomId: string): void => {
//     if (historicConnection.length >= 10) historicConnection = [];
//     historicConnection.push(roomId)
// }

// function findPartner(socket: string): Tuple<UserPairs | User1, boolean> {
//     const allIdleUsers: Array<User1> = currentUsers.filter((user: User1) => !user.partner && user.socketId !== socket);
//     const randomUser: User1 = allIdleUsers[Math.round(Math.random() * allIdleUsers.length)];
//     var thisUser: Array<User1> = getUser(socket);
//     if (thisUser.length === 0) thisUser = [addUser(socket)];
//     if (randomUser !== undefined && randomUser && !hasAlreadyConnected(socket, randomUser.socketId)) {
//         addNewRoom(thisUser[0].socketId + randomUser.socketId)
//         const requestUser: User1 = { socketId: thisUser[0].socketId, partner: randomUser.socketId }
//         const partner: User1 = { socketId: randomUser.socketId, partner: thisUser[0].socketId }
//         updateUser(thisUser[0].socketId, (_) => requestUser)
//         updateUser(randomUser.socketId, (_) => partner)
//         return { elem1: { socket1: requestUser, socket2: partner }, elem2: true };
//     }
//     return { elem1: getUser(socket)[0], elem2: false }
// }

// function userDisconnects(socket: string): Tuple<UserPairs | User1, boolean> | null {
//     const socketOwner: Array<User1> = getUser(socket);
//     removeUser(socket);
//     if (socketOwner[0] && socketOwner[0].partner) {
//         const updatedPartner: User1 = { socketId: socketOwner[0].partner, partner: null }
//         updateUser(socketOwner[0].partner, (_) => updatedPartner);
//         return findPartner(updatedPartner.socketId);
//     }
//     return null
// }

// function breakConnection(socket:string):Tuple<Tuple<UserPairs | User1, boolean>,Tuple<UserPairs | User1, boolean>>|null{
//     const socketOwner: Array<User1> = getUser(socket);
//     if (socketOwner[0] && socketOwner[0].partner) {
//         updateUser(socketOwner[0].socketId,()=>({socketId:socketOwner[0].socketId,partner:null}));
//         updateUser(socketOwner[0].partner,()=>({socketId:socketOwner[0].partner,partner:null}));        
//         return {elem1:findPartner(socketOwner[0].socketId),elem2:findPartner(socketOwner[0].partner)}
//     }
// }

// io.on('connection', (socket: Socket) => {
//     socket.on('establish-new-connection-request', () => {
//         const socketId = socket.id;
//         const result:Tuple<UserPairs | User1, boolean> = findPartner(socketId);
//         // If there is a pair
//         if (result.elem2) {
//             const userPair: UserPairs = result.elem1 as UserPairs;
//             io.to(userPair.socket1.socketId).emit('join-id', userPair.socket1)
//             io.to(userPair.socket2.socketId).emit('join-id', userPair.socket2)
//         } else {
//             const userData: User1 = result.elem1 as User1;
//             io.to(userData.socketId).emit('join-id', userData)
//         }
//     })

//     socket.on('user-disconnects', () => {
//         const socketId = socket.id;
//         const result:Tuple<UserPairs | User1, boolean> | null = userDisconnects(socketId);
//         if (result) {
//             // If there is a pair
//             if (result.elem2) {
//                 const userPair: UserPairs = result.elem1 as UserPairs;
//                 io.to(userPair.socket1.socketId).emit('join-id',userPair.socket1)
//                 io.to(userPair.socket2.socketId).emit('join-id', userPair.socket2)
//             } else {
//                 const userData: User1 = result.elem1 as User1;
//                 io.to(userData.socketId).emit('join-id', userData)
//             }
//         }
//     })

//     socket.on('send-message',(message:string)=>{
//         const socketId = socket.id;
//         const user:Array<User1> = getUser(socketId)
//         if(user[0] && user[0].partner)
//             io.to(user[0].partner).emit('incoming-message',{text:message,socketId:socketId})
//     })

//     socket.on('typing-message', () => {
//         const user = getUser(socket.id);
//         if (user[0] && user[0].partner)
//             io.to(user[0].partner).emit('partner-typing', true)
//     })

//     socket.on('no-longer-typing-message', () => {
//         const user = getUser(socket.id);
//         if (user[0] && user[0].partner)
//             io.to(user[0].partner).emit('partner-no-longer-typing', false)            
//     })

//     socket.on('break-connection', () => {
//         const socketId = socket.id;
//         const user: Array<User1> = getUser(socketId);
//         if (user[0]) {
//             const result = breakConnection(socketId);
//             if (result){
//                 const {elem1,elem2}:Tuple<Tuple<UserPairs | User1, boolean>,Tuple<UserPairs | User1, boolean>> = result;
//                 if (elem1.elem2){
//                     const userPair:UserPairs = elem1.elem1 as UserPairs;
//                     io.to(userPair.socket1.socketId).emit('join-id', userPair.socket1)
//                     io.to(userPair.socket2.socketId).emit('join-id', userPair.socket2)
//                 } else{
//                     const userData: User1 = elem1.elem1 as User1;
//                     io.to(userData.socketId).emit('join-id', userData)
//                 }
//                 if (elem2.elem1){
//                     const userPair:UserPairs = elem2.elem1 as UserPairs;
//                     io.to(userPair.socket1.socketId).emit('join-id', userPair.socket1)
//                     io.to(userPair.socket2.socketId).emit('join-id', userPair.socket2)
//                 }else{
//                     const userData: User1 = elem2.elem1 as User1;
//                     io.to(userData.socketId).emit('join-id', userData)
//                 }                
//             }             
//         }
//     })

// })


app.use(cors());
app.get('/', function (req, res) {
    res.send(`<h1>Pandora Server running</h1>`);
})
server.listen(PORT);
