import styles from "../styles/RoomMainPage.module.css";
import { Grid, GridList, GridListTile } from "@material-ui/core";
export default function RoomMainPage() {
  return (
    <div>
      <style>
        {`
        .card:hover {
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);                    
          background: rgba( 255, 255, 255, 0.2);          
        }                
        .scrollDiv::-webkit-scrollbar {
          display: none;
        }
      `}
      </style>
      <div className={styles.title}>
        <a href="">
          PANDORA
          <span style={{ fontWeight: "normal", fontSize: "12px" }}> rooms</span>
        </a>
      </div>      
      <div
        className="scrollDiv"
        style={{
          height: "93vh",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          overflowY: "scroll",

          MsOverflowStyle: "none",
          scrollBehavior: "smooth",
        }}
      >        
        <RoomCards />
        <RoomCards />
        <RoomCards />
        <RoomCards />
        <RoomCards />
        <RoomCards />
        <RoomCards />
      </div>
    </div>
  );
}

const RoomCards = () => {
  return (
    <div style={{ width: "100%" }}>
      <style>
        {`
        .card:hover {
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);                    
          background: rgba( 255, 255, 255, 0.2);          
        }        
      `}
      </style>
      <a href="#">
        <div
          className="card"
          style={{
            borderRadius: "20px",
            color: "white",
            textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            padding: "50px",
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
            width: "60%",
            maxWidth:"500px",
            marginTop: "25px",
            marginBottom: "25px",
          }}
        >
          <span style={{ fontSize: "25px", fontWeight: "bold", margin: "0" }}>
            Hello This is the title{" "}
          </span>
          <p style={{ fontSize: "15px", fontWeight: "lighter" }}> 1 members </p>
          <p style={{ fontSize: "20px", fontWeight: "lighter" }}>
            We will be talking some stuff we will be talking about baking mainly                      
          </p>
        </div>
      </a>
    </div>
  );
};
