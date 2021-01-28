import React from "react";
import styles from "../styles/MainPage.module.css";
import { Grid } from "@material-ui/core";
import IntroductionComponent from "./Components/IntroductionComponent";
import ChatComponent from "./Components/ChatComponent";

const MainPage = () => {
  const [isClicked, setIsClicked] = React.useState(false);
  return (
    <div>
      <div className={styles.title}>
        <a href="">
          PANDORA{" "}
          <span style={{ fontWeight: "normal", fontSize: "12px" }}> chats</span>
        </a>
      </div>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={styles.innerDiv}
      >
        {!isClicked ? (
          <IntroductionComponent setIsClicked={setIsClicked} />
        ) : (
          <ChatComponent />
        )}
      </Grid>
    </div>
  );
};

export default MainPage;
