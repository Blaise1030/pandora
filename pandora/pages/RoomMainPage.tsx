import styles from "../styles/RoomMainPage.module.css";
import React, { useState, useEffect, FormEvent } from "react";
import AddRoomComponent from "./Components/AddRoomComponent";
import RoomCards from "./Components/RoomCardComponent";
import io from "socket.io-client";
import RoomChatComponent from "./Components/RoomChatComponent";

let socket: SocketIOClient.Socket;

export default function RoomMainPage() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [roomLists, setRoomLists] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [enterRoom, setEnterRoom] = useState(false);
  const [createRoomTitle, setRoomTitle] = useState("");
  const [createRoomDescription, setRoomDescription] = useState("");
  const ENDPOINT = "http://localhost:8000";

  const controlPopUp = () => setShowPopUp(!showPopUp);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("on-user-enter");
    return () => {
      socket.emit("on-disconnect", currentUser);
      socket.close();
    };
  }, []);

  useEffect(() => {
    socket.on("returns-existing-rooms", (user) => {
      setCurrentUser(user.user);
      setRoomLists(user.availableRooms);
    });
  }, []);

  useEffect(() => {
    socket.on("create-room-request-accepted", (user) => {
      setCurrentUser(user.user);
      setRoomLists(user.rooms);
    });
  }, []);

  const onCreateNewRoomFunction = (des:string, title:string) => {    
    socket.emit("on-request-create-rooms", {
      user: currentUser,
      roomTitle: title,
      roomDescription: des,
    });
    setShowPopUp(false);
    setEnterRoom(true);
  };

  return (
    <div>
      <div className={styles.title}>
        <a href="">
          PANDORA
          <span style={{ fontWeight: "normal", fontSize: "12px" }}> rooms</span>
        </a>
      </div>
      {!enterRoom ? (
        <div className={styles.scrollDiv}>
          {roomLists.map((room, index) => (
            <RoomCards
              key={index}
              title={room.roomTitle}
              description={room.roomDescription}
              members={room.memberNumber}
              roomId={room.roomId}
            />
          ))}
        </div>
      ) : (<RoomChatComponent />)}

      {showPopUp ? (
        <AddRoomComponent onAddNewRoom={onCreateNewRoomFunction} />
      ) : (<></>)}
      {!enterRoom ? (
        <a href="#">
          <div className={!showPopUp ? styles.fab : styles.fabCancel} onClick={controlPopUp}>
            {!showPopUp ? <span>create room</span> : <span>cancel</span>}
          </div>
        </a>
      ) : (<></>)}
    </div>
  );
}
