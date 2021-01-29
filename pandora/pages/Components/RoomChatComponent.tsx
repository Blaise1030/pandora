import { Grid } from "@material-ui/core";
import styles from "../../styles/ChatComponent.module.css";
import React, { FormEvent ,useState} from "react";

const RoomChatComponent = () => {
  const [messageList, setMessageList] = useState([]);
  const [tryDisconnect, setTryDisconnect] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [timeOut, timeOutSetter] = useState(null);

  function timeoutFunction() {
    clearTimeout(timeOut);
    setTyping(false);
    //socket.emit("noLongerTypingMessage");
  }

  function onKeyDownNotEnter() {
    if (!typing) {
      setTyping(true);
      //socket.emit("typingMessage");
      timeOutSetter(setTimeout(timeoutFunction, 3000));
    } else {
      clearTimeout(timeOut);
      timeOutSetter(setTimeout(timeoutFunction, 3000));
    }
  }

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Do something
  };
  const onDisconnectButtonClicked = () => {
    setTryDisconnect(!tryDisconnect);
    // Do something
  };

  const onInputClick = () => setTryDisconnect(false);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  function scroll() {
    setTimeout(() => {
      var objDiv = document.getElementById("scrollToBottom");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 0);
  }

  return (
    <Grid container style={{ height: "93vh" }}>
      <div id={"scrollToBottom"} className={styles.chatScroll}></div>
      <Grid item style={{ width: "100%" }}>
        <div className={styles.inputDiv}>
          <a href="#">
            <div
              className={
                tryDisconnect ? styles.confirmLeaveButton : styles.leaveButton
              }
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