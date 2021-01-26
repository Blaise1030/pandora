import React from "react";
import styles from '../styles/MainPage.module.css'
import { Grid } from '@material-ui/core';
import IntroductionComponent from './Components/IntroductionComponent'
import ChatComponent from "./Components/ChatComponent";

const MainPage = () => {
  const [isClicked, setIsClicked] = React.useState(false);
  return (
    <div >
      <div className={styles.title}><a href="">PANDORA</a></div>
      <Grid container direction="column" justify="center" alignItems="center" style={{ height: "93vh", width: "100vw" }}>
        {!isClicked ? (<IntroductionComponent setIsClicked={setIsClicked} />) : (<ChatComponent />)}
      </Grid>
    </div>
  );
};

export default MainPage;
