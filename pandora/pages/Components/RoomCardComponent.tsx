import React from 'react';
import cardStyles from '../../styles/RoomCard.module.css'


const RoomCard = ({ onRoomCardClick, title, description, members, roomId }) => {
  return (

    <a href="#">
      <div className={cardStyles.card}
        onClick={(_) => onRoomCardClick(roomId, title)}
        style={{ textAlign: 'left' }}>
        <span style={{ fontSize: "20px", fontWeight: "bold", margin: "0" }}>
          {title}
        </span>
        <p style={{ fontSize: "15px", fontWeight: "lighter" }}>
          {" "}
          {members} {members === 1 ? "member" : "members"}{" "}
        </p>
        <p style={{ fontSize: "20px", fontWeight: "lighter" }}>
          {description}
        </p>
      </div>
    </a>
  );
};

const RoomCards = React.memo(RoomCard)
export default RoomCards