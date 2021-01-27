import express from 'express';
import http from 'http';
import cors from 'cors';
import { Socket, Server } from 'socket.io'
import { create } from 'domain';
const PORT = process.env.PORT || 8000
const app = express();
const server = http.createServer(app);
const io: Server = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});

type Room = {
  roomId: string,
  roomTitle:string,
  roomDescription:string,  
  memberNumber:number,
}

type User = {
  socketId:string,
  room:string|null,  
}

type UserRequest = {
  user:User,
  requestRoom:string
}

type UserCreatesRoom = {
  user:User,  
  roomTitle:string,
  roomDescription:string,  
}

type UserMessage = {
  user:User,
  msg:string
}

var allAvailableRooms:Array<Room>  = [];
const incrementRoomMember = (room:Room):Room => ({...room,memberNumber:room.memberNumber+1});
const decrementRoomMember = (room:Room):Room => ({...room,memberNumber:room.memberNumber-1});
const updatesRooms = (roomId:string,updateFunction:(x:Room)=>Room) => allAvailableRooms = allAvailableRooms.map(updateFunction);

const joinRoom = (user:UserRequest):User => {
   const targetedRoom = allAvailableRooms.find((room:Room) => room.roomId === user.requestRoom);
   if (targetedRoom){
    updatesRooms(targetedRoom.roomId,incrementRoomMember)
    return {socketId:user.user.socketId,room:targetedRoom.roomId}
   }
   return {socketId:user.user.socketId,room:null}
}

const leaveRoom = (user:User):User => {
  const targetedRoom = allAvailableRooms.find((room:Room) => room.roomId === user.room);
   if (targetedRoom){
    updatesRooms(targetedRoom.roomId,decrementRoomMember)
    allAvailableRooms = allAvailableRooms.filter((room:Room)=>room.memberNumber > 0);
    return {socketId:user.socketId,room:null}
   }
   return user;
}

const addRoom = (createRooms:UserCreatesRoom):User =>{
  const roomId = Date.now().toString() + createRooms.user.socketId;
  if (createRooms.roomDescription && createRooms.roomTitle && createRooms.user){
    allAvailableRooms.push({roomId:roomId,
                            roomTitle:createRooms.roomTitle,
                            roomDescription:createRooms.roomTitle,
                            memberNumber:0})
    return {socketId:createRooms.user.socketId,room:roomId} 
  }  
  return {socketId:createRooms.user.socketId,room:null}
}


io.on('connection',(socket:Socket)=>{

  socket.on('on-user-enter',()=>{
    const socketId = socket.id;    
    socket.to(socketId).emit('returns-existing-rooms',{
      user:{socketId:socketId,room:null},
      availableRooms:allAvailableRooms}
    )        
  });

  socket.on('on-user-enter-room',(userRequest:UserRequest)=>{
    const socketId:string = socket.id;
    const user:User = joinRoom(userRequest)
    if (user.room){
      io.to(user.room).emit('send-msg',{socketId:'admin',msg:`${socketId} joined`})
      socket.join(user.room)
    }      
    socket.to(socketId).emit('joined-room',user)
  })

  socket.on('on-disconnect',(user:User)=>{
    const socketId:string = socket.id;
    const updatedUser:User = leaveRoom(user)
    if (user.room){
      io.to(user.room).emit('send-msg',{socketId:'admin',msg:`${socketId} left`})
      socket.leave(user.room);        
    }      
    socket.to(socketId).emit('leave-room',updatedUser)
  })

  socket.on('on-request-create-rooms',(user:UserCreatesRoom)=>{    
    if (!user.user.room){
      const updatedUser:User = addRoom(user)
      socket.join(user.user.socketId)
      socket.to(user.user.socketId).emit('create-room-request-accepted',updatedUser)}
  })

  socket.on('on-user-message',(user:UserMessage)=>{    
    if (user && user.user.room && user.msg)
      io.to(user.user.room).emit('send-msg',{socketId:user.user.socketId,msg:user.msg})        
  })
});


app.get('/', (req,res) => res.send('Pandora Rooms Running' + allAvailableRooms.length));
app.use(cors());
app.listen(PORT, () => {});