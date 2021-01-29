import React from 'react';
import cardStyles from '../../styles/RoomCard.module.css'


const RoomCards = ({ title, description, members, roomId }) => {
    return (
      <div style={{ width: "100%" }}>
        <a href="#">
          <div className={cardStyles.card} onClick={(_) => console.log(roomId)}>
            <span style={{ fontSize: "25px", fontWeight: "bold", margin: "0" }}>
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
      </div>
    );
  };

  export default RoomCards