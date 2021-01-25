import React, { useEffect } from "react";
import { Card, Container, Grid } from '@material-ui/core';
import styles from '../../styles/ChatComponent.module.css';
import cardStyles from '../../styles/ChatCard.module.css';
import MessageCardComponent from "./MessageCardComponent";
import io from 'socket.io-client'

let socket;

// When user come in we will assign a socket to the user as userId;
// Assigns the user a room id from a list of unrequested if there is one ;

const ChatComponent = () => {
  const [input, setInput] = React.useState("");
  const [tryDisconnect, setTryDisconnect] = React.useState(false);
  const [messageList, setMessageList] = React.useState([]);
  const [socketId, setSocketId] = React.useState("");
  const [currentRoom, setCurrentRoom] = React.useState("");
  const [newHeader, setNewHeader] = React.useState("Searching for John Doe ...");
  const [typing, setTyping] = React.useState(false);
  const [timeOut, timeOutSetter] = React.useState(null);
  const [partnerTyping, setPartnerTyping] = React.useState(false);
  const ENDPOINT = 'https://pandora-app2021.herokuapp.com/';


  // function timeoutFunction() {
  //   clearTimeout(timeOut);
  //   setTyping(false)
  //   socket.emit('noLongerTypingMessage');
  // }

  // function onKeyDownNotEnter() {
  //   if (!typing) {
  //     setTyping(true)
  //     socket.emit('typingMessage');
  //     timeOutSetter(setTimeout(timeoutFunction, 3000));
  //   } else {
  //     clearTimeout(timeOut);
  //     timeOutSetter(setTimeout(timeoutFunction, 3000));
  //   }
  // }

  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   socket.emit('join')
  //   return () => {
  //     socket.emit('disconnect');
  //     socket.off();
  //     io.socket.removeAllListeners()
  //   }
  // }, [])

  // useEffect(() => {
  //   socket.on('join-id', (userObject) => {
  //     setSocketId(userObject.socketId);
  //     if (userObject && userObject.room) {
  //       setCurrentRoom(userObject.room);
  //       socket.emit('agree-join', userObject)
  //     }
  //   });
  //   socket.on('partner-disconnected', () => {
  //     setCurrentRoom(null)
  //     setNewHeader("You are disconnected. Searching for John Doe...")
  //     socket.emit('agree-leave', { socketId: socketId, room: currentRoom })
  //   });
  //   socket.on('partner-typing', (payload) => setPartnerTyping(payload))
  //   socket.on('partner-no-longer-typing', (payload) => setPartnerTyping(payload))
  // }, [socketId])

  // useEffect(() => {
  //   socket.on('message', (message) => {
  //     setMessageList((oldMsg) => [...oldMsg, message])
  //     scroll()
  //   })
  // }, [])

  // function scroll() {
  //   setTimeout(() => {
  //     var objDiv = document.getElementById("scrollingDiv");
  //     objDiv.scrollTop = objDiv.scrollHeight;
  //   }, 0);
  // }

  // const searchNew = () => {
  //   socket.emit('search-new', { socketId: socketId, room: currentRoom })
  // }

  // const sendMessage = (e) => {
  //   e.preventDefault();
  //   timeoutFunction()
  //   if (input && input.length >= 1 && currentRoom) {
  //     socket.emit('send-message', input)
  //     setInput("")
  //     scroll();
  //   }
  // }

  const onDisconnectButtonClicked = (e) =>{
    e.preventDefault()
    if (tryDisconnect && currentRoom)
      searchNew()
    setTryDisconnect(!tryDisconnect)
  }

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item className={styles.chatScroll}>
        {messageList.map((msg)=>(<ChatCards socketId={socketId} msg={msg} />))}        
      </Grid>
      <Grid item style={{ width: "100%" }}>
        <div className={styles.inputDiv}>
          <div className={tryDisconnect?styles.confirmLeaveButton:styles.leaveButton}
               onClick={(e) => onDisconnectButtonClicked(e)}>
            <span style={{ color: "white" }}>{tryDisconnect ? "sure ?" : "leave"}</span>
          </div>
          <form
            style={{ width: "100%" }}
            onSubmit={(e) => { e.preventDefault(); sendMessage(e)}}>
            <input
              type="text"
              value={input}
              className={styles.inputStyle}
              placeholder={"Type something ... "}              
              onClick={(e) => setTryDisconnect(false)}
              //onKeyDown={(e) => onKeyDownNotEnter()}
              onChange={(e) => {
                setTryDisconnect(false);
                setInput(e.target.value);
              }}              
            />
          </form>
        </div>
      </Grid>
    </Grid >
  );
};

export default ChatComponent;


const ChatCards = ({ socketId, msg }) => {
  if (msg && msg.socketId === 'admin') {
    return (
      <div style={{ width: "100%" }}>
        <div className={cardStyles.adminStyle}> {msg.text} </div>
      </div>
    );
  }
  else if (msg && socketId && msg.socketId === socketId)
    return (
      <div style={{ width: "100%" }}>
        <div className={cardStyles.userStyle}> {msg.text}  </div>
      </div>
    );
  else
    return (
      <div style={{ width: "100%" }}>
        <div className={cardStyles.otherStyle}> {msg ? msg.text : ""}  </div>
      </div>
    );
}