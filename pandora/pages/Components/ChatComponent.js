import React, { useEffect } from "react";
import { Card, Container, Grid } from '@material-ui/core';
import styles from '../../styles/ChatComponent.module.css'
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

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item className={styles.chatScroll}>
        <ChatCards socketId={'1'} msg={{ socketId: "admin", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "1", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "1", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "1", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "admin", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={"1"} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={"1"} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={"1"} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "admin", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "1", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "1", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "1", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "admin", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={"1"} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={"1"} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={"1"} msg={{ socketId: "2", text: "message" }} />
        <ChatCards socketId={'1'} msg={{ socketId: "2", text: "message" }} />
      </Grid>
      <Grid item style={{ width: "100%" }}
        variant="row"
        justify="start"
        alignItems="center">
        <div
          style={{
            height: "8%",
            display: "flex",
            flexDirection: "row",
            paddingTop: "5px",
            paddingLeft: "26px",
            paddingRight: "26px",
          }}
        >
          <button
            type="link"
            className="start-button"
            onClick={(e) => {
              if (tryDisconnect && currentRoom)
                searchNew()
              setTryDisconnect(!tryDisconnect);
            }}
            style={{
              width: "90px",
              height: "45px",
              transition: "box-shadow .3s",
              boxShadow: "0 0 10px rgba(33, 33, 33, 0.8)",
              backgroundColor: tryDisconnect ? "#eb596e" : "rgba(0, 0, 0, 1)",
              borderRadius: "10px",
              border: "none",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
              outline: 'none',
            }}
          >
            <span style={{ color: "white" }}>
              {tryDisconnect ? "sure ?" : "leave"}
            </span>
          </button>

          <form
            style={{ width: "100%" }}
            onSubmit={(e) => { e.preventDefault(); sendMessage(e) }}
          >
            <input
              type="text"
              value={input}
              placeholder={"Type something ... "}
              onClick={(e) => setTryDisconnect(false)}
              //onKeyDown={(e) => onKeyDownNotEnter()}
              onChange={(e) => {
                setTryDisconnect(false);
                setInput(e.target.value);
              }}
              style={{
                height: '45px',
                color: 'white',
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                width: "100%",
                padding: "20px",
                fontWeight: "normal",
                fontSize: "15px",
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
        <div style={{
          fontSize: '17px',
          color: 'white', fontWeight: '300',
          paddingTop: '5px', paddingBottom: '5px',
          paddingLeft: "13px", paddingRight: '13px',
          borderRadius: '20px', marginRight: 'auto',
          marginLeft: "auto", borderTopLeftRadius: '2px',
          width: "fit-content", marginTop: '20px',
          textShadow: '0px 0px 10px rgba(0,0,0,0.6)',
          marginBottom: "20px"
        }}> {msg.text} </div>
      </div>
    );
  }
  else if (msg && socketId && msg.socketId === socketId)
    return (
      <div style={{ width: "100%" }}>
        <div style={{
          textAlign: "start",
          wordWrap: "break-word",
          maxWidth: "40%",
          marginRight: "26px",
          marginLeft: "auto",
          color: "white",
          width: "fit-content",
          padding: "8px 15px 8px 15px",
          marginTop: "8px",
          marginBottom: "8px",
          textShadow: '0px 0px 40px black',
          borderRadius: "13px 2px 10px 13px",
          boxShadow: "0 8px 10px 0 rgba( 31, 38, 135, 0.1 )",
          background: 'rgba(25, 181, 254, 0.5)',
          backdropFilter: 'blur( 20.0px )',
          WebkitBackdropFilter: 'blur( 20.0px )',
        }}> {msg.text}  </div>
      </div>
    );
  else
    return (
      <div style={{ width: "100%" }}>
        <div style={{
          textAlign: "start",
          wordWrap: "break-word",
          maxWidth: "40%",
          marginRight: "auto",
          marginLeft: "26px",
          color: "black",
          width: "fit-content",
          padding: "8px 15px 8px 15px",
          marginTop: "8px",
          marginBottom: "8px",
          textShadow: '0px 0px 40px black',
          background: 'rgba(255, 255, 255, 0.50)',
          borderRadius: "2px 10px 13px 13px",
          backdropFilter: "blur( 4.5px )",
          WebkitBackdropFilter: "blur( 4.5px )",
          boxShadow: "0 8px 10px 0 rgba( 31, 38, 135, 0.1 )"
        }}> {msg ? msg.text : ""}  </div>
      </div>
    );
}