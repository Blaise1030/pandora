import { Grid } from "@material-ui/core";
import styles from "../../styles/ChatComponent.module.css";
import React, { useEffect, useState } from "react";
import MessageCard from "./MessageCardComponent";
import io from 'socket.io-client';
import { type } from "os";

type User = {
  socketId: string,
  room: string | null,
}

type UserMessage = {
  user: User,
  msg: string,
  name: string
}

type MessageFromServer = {
  socketId: string,
  msg: string
}

let socket;

const RoomChatComponent = ({ name, currentRoom, setEnterRoom, setCurrentRoomNumber }) => {
  const [messageList, setMessageList] = useState([]);
  const [isTypingList, setIsTypingList] = useState([]);
  const [tryDisconnect, setTryDisconnect] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [timeOut, timeOutSetter] = useState(null);
  const ENDPOINT = 'http://localhost:8000'

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('user-enter-room', { roomId: currentRoom, name: name })
    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    socket.on('send-msg', (msgFromServer) => {
      setIsTypingList(isTypingList.filter((typing) => typing.socketId !== msgFromServer.socketId));
      setMessageList((oldMsg) => [...oldMsg, msgFromServer])
      scroll()
    })
  }, [])

  useEffect(() => {
    socket.on('no-longer-typing', ({ name: name, socketId: socketId }) => {
      setIsTypingList(isTypingList.filter((typing) => typing.socketId !== socketId))
      scroll()
    })
    socket.on('someone-is-typing', (message) => {
      setIsTypingList([...isTypingList, message])
      scroll()
    })
    socket.on('current-room-number', (number: number) => {
      setCurrentRoomNumber(number)
    })
  }, [])

  const onDisconnectButtonClicked = () => {
    if (tryDisconnect) {
      socket.emit('user-leaves-room', { roomId: currentRoom, name: name })
      setEnterRoom(false)
    }
    setTryDisconnect(!tryDisconnect)
  };

  const sendMessage = (e) => {
    e.preventDefault()
    if (input.trim().length > 0)
      socket.emit('on-user-message', { message: input, roomId: currentRoom, name: name })
    setInput("")
  };

  const scroll = () => {
    setTimeout(() => {
      var objDiv = document.getElementById("scrollRoomChat");
      if (objDiv)
        objDiv.scrollTop = objDiv.scrollHeight;
    });
  }

  const timeoutFunction = () => {
    clearTimeout(timeOut);
    setTyping(false);
    socket.emit("no-longer-typing-message", { roomId: currentRoom, name: name, socketId: socket.id });
  }

  const onKeyDownNotEnter = () => {
    if (!typing) {
      setTyping(true);
      socket.emit("typing-message", { roomId: currentRoom, name: name, socketId: socket.id });
      timeOutSetter(setTimeout(timeoutFunction, 3000));
    } else {
      clearTimeout(timeOut);
      timeOutSetter(setTimeout(timeoutFunction, 3000));
    }
  }

  const onInputClick = () => setTryDisconnect(false);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  return (
    <Grid container style={{ height: "93vh" }}>
      <div id={"scrollRoomChat"} className={styles.chatScroll}>
        {
          messageList.map(({ socketId, msg, name }, index: number) => (
            <div key={index}>
              {socketId !== 'admin' && socketId != socket.id ?
                <div className={styles.chatUserLabel}>{name}</div>
                : <></>}
              <MessageCard socketId={socket.id} msg={{ socketId: socketId, text: msg }}
              />
            </div>
          ))
        }
        {
          isTypingList.map((message, index) =>
          (<div key={index} style={{ paddingLeft: '26px', color: 'white', textShadow: '0px 0px 40px black' }}>
            {message.socketId} is typing ...</div>))
        }
      </div>
      <Grid item style={{ width: "100%" }}>
        <div className={styles.inputDiv}>
          <a href="#">
            <div
              className={tryDisconnect ? styles.confirmLeaveButton : styles.leaveButton}
              onClick={onDisconnectButtonClicked}
            >
              <span style={{ color: "white" }}>
                {tryDisconnect ? "sure ?" : "leave"}
              </span>
            </div>
          </a>
          <form style={{ width: "100%" }} onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              className={styles.inputStyle}
              placeholder={"Type something ... "}
              onClick={onInputClick}
              onKeyDown={onKeyDownNotEnter}
              onChange={onInputChange}
            />
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default RoomChatComponent;

