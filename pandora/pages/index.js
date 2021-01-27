import Head from "next/head";
import styles from "../styles/Home.module.css";
import MainPage from "./ChatMainPage";
import RoomMainPage from "./RoomMainPage";



export default function Home() {
  return (
    <div className={styles.gradient}>
      <Head>
        <title>Pandora</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RoomMainPage />
    </div>
  );
}
