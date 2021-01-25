import React from "react";
import styles from '../styles/MainPage.module.css'
import { Grid } from '@material-ui/core';
import IntroductionComponent from './Components/IntroductionComponent'
import LogoComponent from './Logo'
import ChatComponent from "./Components/ChatComponent";

const MainPage = ({ location }) => {
  const [isClicked, setIsClicked] = React.useState(false);
  return (
    <body className={styles.gradient}>
      <Grid container direction="column" justify="center" alignItems="center" style={{ height: "100vh", width: "100vw" }}>
        {!isClicked ? (<IntroductionComponent setIsClicked={setIsClicked} />) : (<ChatComponent />)}
      </Grid>
    </body>
  );
};

export default MainPage;
