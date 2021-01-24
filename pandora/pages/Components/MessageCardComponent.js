const MessageCardComponent = ({ socketId, msg }) => {
  console.log(socketId)
  return (
    <div>
      {socketId === msg.socketId ? (<div style={
        {
          textAlign: "start",
          wordWrap: "break-word",
          maxWidth: "40%",
          marginRight: "26px",
          marginLeft: "auto",
          color: "white",
          width: "fit-content",
          padding: "12px",
          marginTop: "10px",
          marginBottom: "10px",
          textShadow: '0px 0px 40px black',
          borderRadius: "13px 2px 10px 13px",
          boxShadow: "0 8px 10px 0 rgba( 31, 38, 135, 0.1 )",
          background: 'rgba(63, 195, 128, 0.3)',
          backdropFilter: 'blur( 20.0px )',
          WebkitBackdropFilter: 'blur( 20.0px )',
        }
      }>
        {msg.text}
      </div>) :
        (
          <div
            style={{
              textAlign: "start",
              wordWrap: "break-word",
              maxWidth: "40%",
              marginRight: "auto",
              marginLeft: "26px",
              color: "black",
              background: "blue",
              width: "fit-content",
              padding: "12px",
              marginTop: "10px",
              marginBottom: "10px",
              textShadow: '0px 0px 40px black',
              background: 'rgba(255, 255, 255, 0.30)',
              borderRadius: "2px 13px 13px 20px",
              backdropFilter: "blur( 4.5px )",
              WebkitBackdropFilter: "blur( 4.5px )",
              boxShadow: "0 8px 10px 0 rgba( 31, 38, 135, 0.1 )",
            }}
          >
            {msg.text}
          </div>)
      }
    </div >
  );
};

export default MessageCardComponent;