import React, { useEffect } from "react";
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

  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('join')
    return () => {
      socket.emit('disconnect');
      socket.off();
      io.socket.removeAllListeners()
    }
  }, [])

  useEffect(() => {
    socket.on('join-id', (userObject) => {
      setSocketId(userObject.socketId);
      if (userObject && userObject.room) {
        setCurrentRoom(userObject.room);
        socket.emit('agree-join', userObject)
      }
    });
    socket.on('partner-disconnected', () => {
      setCurrentRoom(null)
      socket.emit('agree-leave', { socketId: socketId, room: currentRoom })
    });
    socket.on()
  }, [socketId])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessageList((oldMsg) => [...oldMsg, message])
      scroll()
    })
  }, [])

  function scroll() {
    setTimeout(() => {
      var objDiv = document.getElementById("scrollingDiv");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 0);
  }

  const searchNew = () => {
    socket.emit('search-new', { socketId: socketId, room: currentRoom })
  }

  const sendMessage = (e) => {
    e.preventDefault();
    if (input && input.length >= 1 && currentRoom) {
      socket.emit('send-message', input)
      setInput("")
      scroll();
    }
  }

  return (
    <div>
      <style>{`
        input[type=text] {
          border: none;
          outline:none;                
        }
        ::placeholder{
          color:white;
        }
        ::-webkit-scrollbar {
          width: 0px;  /* Remove scrollbar space */
          background: transparent;  /* Optional: just make scrollbar invisible */
      }
      .start-button:hover {
        box-shadow: 0 0 10px rgba(33, 33, 33, 0.8);
        background-color: rgba(0, 0, 0, 0.1);
      }
      ::-webkit-scrollbar-thumb {
          background: #FF0000;
      }
        `}</style>

      <div
        style={{
          background: "rgba( 255, 255, 255, 0.25 )",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.27 )",
          backdropFilter: "blur( 1.5px )",
          WebkitBackdropFilter: "blur( 1.5px )",
          borderRadius: "10px",
          height: "600px",
          width: "1000px",
          maxHeight: "80vh",
          maxWidth: "90vw",
          textAlign: "center",
          paddingBottom: "40px",
        }}
      >
        <div style={{ height: "8%" }}>
          <p style={{
            paddingTop: '13px',
            paddingLeft: "26px",
            textAlign: 'start',
            color: "white",
            textShadow: '0px 0px 30px black'
          }}>
            {currentRoom ? 'connected' : 'searching ...'}
          </p>
        </div>
        <div
          id="scrollingDiv"
          style={{
            height: "86%",
            paddingTop: "20px",
            overflowY: "scroll",
            position: "relative",
          }}
        >
          {messageList.map((msg, index) =>
          (<MessageCardComponent
            key={index}
            socketId={socketId}
            msg={msg}
          />)
          )}
        </div>

        <div
          style={{
            height: "8%",
            display: "flex",
            flexDirection: "row",
            paddingTop: "10px",
            paddingLeft: "26px",
            paddingRight: "26px",
          }}
        >
          <button
            type="link"
            className="start-button"
            onClick={(e) => {
              if (tryDisconnect)
                searchNew()
              setTryDisconnect(!tryDisconnect);
            }}
            style={{
              width: "80px",
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
            onSubmit={(e) => sendMessage(e)}
          >
            <input
              type="text"
              value={input}
              placeholder={"Type something ... "}
              onClick={(e) => setTryDisconnect(false)}
              onChange={(e) => {
                setTryDisconnect(false);
                setInput(e.target.value);
              }}
              style={{
                height: "45px",
                color: 'white',
                backgroundColor: "transparent",
                borderRadius: "10px",
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
                width: "100%",
                padding: "20px",
                fontWeight: "normal",
                fontSize: "15px",
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
