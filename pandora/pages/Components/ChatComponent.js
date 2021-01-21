import React from "react";
import MessageCardComponent from "./MessageCardComponent";
const ChatComponent = () => {
  const [input, setInput] = React.useState("");
  const [tryDisconnect, setTryDisconnect] = React.useState(false);
  const [dataList, setDataList] = React.useState([]);
  const [itemIsLoading, setItemIsLoading] = React.useState(false);

  function scroll() {
    setTimeout(() => {
      var objDiv = document.getElementById("scrollingDiv");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 0);
  }

  return (
    <div>
      <style>{`
        input[type=text] {
          border: none;
          outline:none;                
        }
        ::-webkit-scrollbar {
          width: 0px;  /* Remove scrollbar space */
          background: transparent;  /* Optional: just make scrollbar invisible */
      }
      .start-button:hover {
        box-shadow: 0 0 10px rgba(33, 33, 33, 0.8);
        background-color: rgba(0, 0, 0, 0.1);
      }
      ::-webkit-scrollbar-thumb {
          background: #FF0000;
      }
        `}</style>
      <div
        style={{
          background: "rgba( 255, 255, 255, 0.25 )",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.27 )",
          backdropFilter: "blur( 1.5px )",
          WebkitBackdropFilter: "blur( 1.5px )",
          borderRadius: "10px",
          height: "700px",
          width: "1000px",
          maxHeight: "80vh",
          maxWidth: "90vw",
          textAlign: "center",
          paddingBottom: "40px",
        }}
      >
        <div style={{ height: "6%" }}></div>
        <div
          id="scrollingDiv"
          style={{
            height: "88%",
            paddingTop: "20px",
            overflowY: "scroll",
            position: "relative",
          }}
        >
          {dataList.map((msg) => (
            <MessageCardComponent you={true} text={msg} />
          ))}
        </div>

        <div
          style={{
            height: "6%",
            display: "flex",
            flexDirection: "row",
            paddingTop: "10px",
            paddingLeft: "26px",
            paddingRight: "26px",
          }}
        >
          <button
            type="link"
            className="start-button"
            onClick={(e) => {
              if (tryDisconnect) {
                setDataList([]);
                setInput("");
              }
              setTryDisconnect(!tryDisconnect);
            }}
            style={{
              width: "80px",
              height: "45px",
              transition: "box-shadow .3s",
              boxShadow: "0 0 10px rgba(33, 33, 33, 0.8)",
              backgroundColor: tryDisconnect ? "#eb596e" : "rgba(0, 0, 0, 1)",
              borderRadius: "10px",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
              border: "none",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
            }}
          >
            <span style={{ color: "white" }}>
              {tryDisconnect ? "sure ?" : "leave"}
            </span>
          </button>

          <form
            style={{ width: "100%" }}
            onSubmit={(e) => {
              e.preventDefault();

              if (input.trim().length > 1) {
                setDataList([...dataList, input]);
                setInput("");
              }
              scroll();
            }}
          >
            <input
              type="text"
              value={input}
              placeholder={"Type something ... "}
              onClick={(e) => setTryDisconnect(false)}
              onChange={(e) => {
                setTryDisconnect(false);
                setInput(e.target.value);
              }}
              style={{
                height: "45px",
                boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.23 )",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: "10px",
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
                width: "100%",
                padding: "20px",
                fontWeight: "normal",
                fontSize: "15px",
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
