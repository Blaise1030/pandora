import styles from "../styles/RoomMainPage.module.css";
import React, { useState, useEffect } from "react";
import AddRoomComponent from "./Components/AddRoomComponent";
import RoomCards from "./Components/RoomCardComponent";
import io from "socket.io-client";
import RoomChatComponent from "./Components/RoomChatComponent";
import { Rooms } from "socket.io";

let socket: SocketIOClient.Socket;

export default function RoomMainPage() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [roomLists, setRoomLists] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [enterRoom, setEnterRoom] = useState(false);
  const [currentRoomNumber, setCurrentRoomNumber] = React.useState(0)
  const [nameInput, setNameInput] = React.useState("")
  const [name, setName] = React.useState(null)
  const ENDPOINT = "http://localhost:8000";

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('get-rooms')
    socket.on("all-rooms", (rooms: Array<Rooms>) => {
      setRoomLists(rooms)
    })
  }, []);

  useEffect(() => {
    socket.on('created-room-id', ({ newRoomId, title }) => {
      if ({ newRoomId, title }) {
        setCurrentRoom(newRoomId)
        setCurrentTitle(title)
        setCurrentRoomNumber(1)
        setEnterRoom(true)
      }
    })
  }, [])

  const roomCardClicked = (roomId: string, title: string, number: number) => {
    setCurrentRoom(roomId);
    setCurrentTitle(title);
    setCurrentRoomNumber(number)
    setEnterRoom(true);
  }

  const controlPopUp = () => setShowPopUp(!showPopUp);
  const onNameInput = (e: { target: { value: React.SetStateAction<string>; }; }) => setNameInput(e.target.value);
  const onNameSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (nameInput.trim().length > 0)
      setName(nameInput)
  }

  return (
    <div>
      <div className={styles.title}>
        <a href={!enterRoom ? "" : "#"}>
          {!enterRoom ? 'PANDORA ' : currentTitle}
          <span style={{ fontWeight: "normal", fontSize: "12px", paddingLeft: enterRoom ? "10px" : "0" }}>
            {!enterRoom ? 'rooms' : `${currentRoomNumber} member${currentRoomNumber === 1 ? "" : 's'}`}
          </span>
        </a>
      </div>
      {
        !name ? <div className={styles.noRooms}>
          <form onSubmit={onNameSubmit}>
            <input
              className={styles.inputStyle}
              type="text"
              value={nameInput}
              placeholder={"What is your nickname ?"}
              onChange={onNameInput}
              autoFocus
            />
          </form>
        </div>
          : roomLists.length <= 0 ?
            (<div className={styles.noRooms}>
              {'Oops there are no rooms, create rooms !'}
            </div>)
            : !enterRoom ? (
              <div className={styles.scrollDiv}>
                {roomLists.map((room, index) => (
                  <RoomCards
                    key={index}
                    onRoomCardClick={roomCardClicked}
                    title={room.roomTitle}
                    description={room.roomDescription}
                    members={room.memberNumber}
                    roomId={room.roomId}
                  />
                ))}
              </div>
            ) : (<RoomChatComponent
              key={"roomChatComponent"}
              name={name}
              currentRoom={currentRoom}
              setEnterRoom={setEnterRoom}
              setCurrentRoomNumber={setCurrentRoomNumber}
            />)
      }


      {
        showPopUp ? (
          <AddRoomComponent socket={socket} setShowPopUp={setShowPopUp} />
        ) : (<></>)
      }
      {
        !enterRoom && name ? (
          <a href="#">
            <div className={!showPopUp ? styles.fab : styles.fabCancel} onClick={controlPopUp}>
              {!showPopUp ? <span>create room</span> : <span>cancel</span>}
            </div>
          </a>
        ) : (<></>)
      }
    </div >
  );
}



