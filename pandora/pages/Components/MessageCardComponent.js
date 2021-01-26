import cardStyles from '../../styles/ChatCard.module.css';
import React from 'react';
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

export const IsTypingCard = () =>{
  return (
    <div className={cardStyles.chatBubble}>
      <div className={cardStyles.typing}>
        <div className={cardStyles.dot}></div>
        <div className={cardStyles.dot}></div>
        <div className={cardStyles.dot}></div>
      </div>
    </div>
  )
}

const MessageCard = React.memo(ChatCards);
export default MessageCard



