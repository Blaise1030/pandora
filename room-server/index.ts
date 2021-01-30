import express from 'express';
import http from 'http';
import cors from 'cors';
import { Socket } from 'socket.io'
const PORT = process.env.PORT || 8000
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
  },
});

type Room = {
  roomId: string,
  roomTitle: string,
  roomDescription: string,
  memberNumber: number,
}

type User = {
  socketId: string,
  room: string | null,
}

var allAvailableRooms: Array<Room> = [];

const getRoomNumber = (roomId: string) => allAvailableRooms.find((room: Room) => room.roomId === roomId)?.memberNumber
const incrementRoomMember = (room: Room): Room => ({ ...room, memberNumber: room.memberNumber + 1 });
const decrementRoomMember = (room: Room): Room => ({ ...room, memberNumber: room.memberNumber - 1 });
const updatesRooms = (roomId: string, updateFunction: (x: Room) => Room) => allAvailableRooms = allAvailableRooms.map((room: Room) => room.roomId === roomId ? updateFunction(room) : room);

var userNumber = 0;

io.on('connection', (socket: Socket) => {
  socket.on('get-rooms', () => {
    userNumber += 1;
    socket.emit('all-rooms', allAvailableRooms);
  });

  socket.on('user-enter-room', ({ roomId, name }) => {
    updatesRooms(roomId, incrementRoomMember)
    socket.join(roomId);
    io.to(roomId).emit('send-msg', { socketId: 'admin', msg: `${name} joined` })
    io.to(roomId).emit('current-room-number', getRoomNumber(roomId))
    io.emit('all-rooms', allAvailableRooms);
  })

  socket.on('user-leaves-room', ({ roomId, name }) => {
    updatesRooms(roomId, decrementRoomMember);
    allAvailableRooms = allAvailableRooms.filter((room: Room) => room.memberNumber > 0)
    io.emit('all-rooms', allAvailableRooms);
    io.to(roomId).emit('send-msg', { socketId: 'admin', msg: `${name} left` });
    io.to(roomId).emit('current-room-number', getRoomNumber(roomId))
    socket.leave(roomId);
  })

  socket.on('disconnecting', function () {
    const socketId = socket.id;
    socket.rooms.forEach(
      (r: string) => {
        updatesRooms(r, decrementRoomMember);
        allAvailableRooms = allAvailableRooms.filter((room: Room) => room.memberNumber > 0)
        io.emit('all-rooms', allAvailableRooms);
        io.to(r).emit('send-msg', { socketId: 'admin', msg: `a member left` });
        io.to(r).emit('current-room-number', getRoomNumber(r))
        socket.leave(r);
      }
    );

  });

  socket.on('create-room', ({ roomTitle, roomDescription }) => {
    const newRoomId: string = Date.now() + socket.id
    allAvailableRooms.push({
      roomId: newRoomId,
      roomTitle: roomTitle,
      roomDescription: roomDescription,
      memberNumber: 0
    })
    io.emit('all-rooms', allAvailableRooms)
    socket.emit('created-room-id', { newRoomId: newRoomId, title: roomTitle })

  })


  socket.on('on-user-message', ({ message, roomId, name }) => {
    const socketId = socket.id;
    io.to(roomId).emit('send-msg', { socketId: socketId, msg: message, name: name })
  })

  socket.on('no-longer-typing-message', ({ roomId, name, socketId }) => {
    socket.broadcast.to(roomId).emit('no-longer-typing', { name: name, socketId: socketId })
  })

  socket.on('typing-message', ({ roomId, name, socketId }) => {
    socket.broadcast.to(roomId).emit('someone-is-typing', { name: name, socketId: socketId })

  })

});


app.get('/', (req, res) => res.send('Pandora Rooms Running...' + 'Current userNumber: ' + userNumber));
app.use(cors());
server.listen(PORT);