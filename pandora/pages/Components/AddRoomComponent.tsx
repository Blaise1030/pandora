import { useState,useEffect } from "react";
import styles from "../../styles/AddRoom.module.css";
import io from 'socket.io-client'

const AddRoomComponent = ({onAddNewRoom}) => {
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [errorOnTitle,setErrorOnTitle] = useState(false);
  const [errorOnDesc,setErrorOnDesc] = useState(false);

  const setRoomTitle = (e) => {
    e.preventDefault()
    setTitle(e.target.value)
  }

  const setRoomDescription = (e) => {
    e.preventDefault()
    if (e.target.value.length <= 150)
      setDescription(e.target.value) 
  }

  const onAddClicked = () => {
    if (title.trim().length <= 0){
      setErrorOnTitle(true)
      setTitle("")
    }      
    if (description.trim().length<=0){
      setErrorOnDesc(true)
      setDescription("")
    }
      
    if (title.length >= 1 && description.length >= 1){       
      onAddNewRoom(description,title)
    }
  }

  return (
    <div className={styles.componentDiv}>
      <div style={{ width: "100%" }}>
        <input
          value={title}          
          onChange={setRoomTitle}          
          placeholder={errorOnTitle?"type title here!":"room title"}
          className={styles.titleInput}
        />
      </div>
      <div style={{ width: "100%" }}>
        <textarea          
          value={description}
          onChange={setRoomDescription}                     
          placeholder={errorOnDesc?"type description here!":"description"}
          className={styles.descriptionInput}
        />
      </div>
      <p></p>
      <div style={{ width: "100%" }}>
        <div className={styles.addButton} onClick={onAddClicked}>
          <a href="#" style={{ width: "fit-content" }}>
            add
          </a>
        </div>
      </div>
    </div>
  );
};

export default AddRoomComponent;
