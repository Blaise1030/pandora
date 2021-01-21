const MessageCardComponent = ({ you, text }) => {
    return (
      <div>
        <div
          style={{
            textAlign: "start",
            wordWrap: "break-word",
            maxWidth: "40%",
            marginRight: you ? "26px" : "auto",
            marginLeft: you ? "auto" : "26px",
            color: !you ? "black" : "white",
            background: you
              ? "rgba(142, 255, 17, 0.50 )"
              : "(255, 255, 255, 0.70 )",
            width: "fit-content",
            padding: "12px",
            marginTop: "5px",
            marginBottom: "5px",
            borderRadius: you?"20px 2px 20px 20px":"2px 20px 20px 20px",            
            backdropFilter: "blur( 4.5px )",
            WebkitBackdropFilter: "blur( 4.5px )",
            boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.2 )",
          }}
        >
          {text}
        </div>
      </div>
    );
  };
  
  export default MessageCardComponent;