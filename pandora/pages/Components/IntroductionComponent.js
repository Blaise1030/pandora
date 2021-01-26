import React from 'react';
import { Grid} from '@material-ui/core'
import styles from '../../styles/Introduction.module.css'
const IntroductionComponent = (props) => {
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <p className={styles.introText}>
        Text whatever, wherever, whenever with a stranger.
      </p>
      <div className={styles.startButton}
        onClick={() => props.setIsClicked(true)}>
        <p className={styles.spanColor}><span>Open Box ?</span></p>
      </div>
    </Grid >
  );
};

export default IntroductionComponent;


