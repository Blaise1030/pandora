import styles from "../styles/RoomMainPage.module.css";
import { Grid, GridList, GridListTile, Fab } from "@material-ui/core";
import cardStyles from "../styles/RoomCard.module.css";
import { useState } from "react";
import AddRoomComponent from "./Components/AddRoomComponent";
export default function RoomMainPage() {
  const [showPopUp,setShowPopUp] = useState(false);

  const controlPopUp = () => setShowPopUp(!showPopUp);

  return (
    <div>
      <div className={styles.title}>
        <a href="">
          PANDORA
          <span style={{ fontWeight: "normal", fontSize: "12px" }}> rooms</span>
        </a>
      </div>
      <div className={styles.scrollDiv}>
        <RoomCards
          title={"Heasdad"}
          description={"This is the description pleasehe description please"}
          members={2}
        />
        <RoomCards
          title={"Heasdad"}
          description={"This is the description pleasehe description please"}
          members={1}
        />
        <RoomCards
          title={"Heasdad"}
          description={"This is the description pleasehe description please"}
          members={1}
        />
      </div>
      {showPopUp?<AddRoomComponent />:<></>}
      <a href="#">
        <div className={!showPopUp?styles.fab:styles.fabCancel} onClick={controlPopUp}>
          {!showPopUp?<span>create room</span>:<span>cancel</span>}
        </div>{" "}
      </a>
    </div>
  );
}

const RoomCards = ({ title, description, members }) => {
  return (
    <div style={{ width: "100%" }}>
      <a href="#">
        <div className={cardStyles.card}>
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
