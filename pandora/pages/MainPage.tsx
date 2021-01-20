import React from "react";
import { start } from "repl";

const MainPage = () => {
  const [isClicked, setIsClicked] = React.useState(false);
  return (
    <>
      <style>
        {`
          .gradient {
            background: linear-gradient(340deg, #2c9076, #6369c1, #e16060);
            background-size: 600% 600%;

            -webkit-animation: AnimationName 15s ease infinite;
            -moz-animation: AnimationName 15s ease infinite;
            -o-animation: AnimationName 15s ease infinite;
            animation: AnimationName 15s ease infinite;
          }

          @-webkit-keyframes AnimationName {
            0% {
              background-position: 29% 0%;
            }
            50% {
              background-position: 72% 100%;
            }
            100% {
              background-position: 29% 0%;
            }
          }
          @-moz-keyframes AnimationName {
            0% {
              background-position: 29% 0%;
            }
            50% {
              background-position: 72% 100%;
            }
            100% {
              background-position: 29% 0%;
            }
          }
          @-o-keyframes AnimationName {
            0% {
              background-position: 29% 0%;
            }
            50% {
              background-position: 72% 100%;
            }
            100% {
              background-position: 29% 0%;
            }
          }
          @keyframes AnimationName {
            0% {
              background-position: 29% 0%;
            }
            50% {
              background-position: 72% 100%;
            }
            100% {
              background-position: 29% 0%;
            }
          }
        `}
      </style>
      <div
        className="gradient"
        style={{
          width: "100vw",
          height: "100vh",
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LogoComponent />
        {!isClicked ? (
          <IntroductionComponent setIsClicked={setIsClicked} />
        ) : (
          <ChatComponent />
        )}
      </div>
    </>
  );
};

export default MainPage;

const ChatComponent = () => {
  const [input, setInput] = React.useState(null);
  return (
    <>
      <style>{`
      input[type=text] {
        border: none;
        outline:none;                
      }
      ::-webkit-scrollbar {
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
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
          paddingBottom: "26px",
        }}
      >
        <div style={{ height: "6%" }}></div>
        <div
          style={{
            height: "88%",
            paddingTop:"20px",
            overflowY: "scroll",
            position: "relative",
          }}
        >
          <MessageCardComponent you={false} text={"some message"} />
          <MessageCardComponent you={true} text={"some message"} />
          <MessageCardComponent you={true} text={"some message"} />
        </div>

        <form
          style={{
            height: "6%",
            display: "flex",
            flexDirection: "row",
            paddingTop: "10px",
            paddingLeft: "26px",
            paddingRight: "26px",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            setInput("");
          }}
        >
          <input
            type="text"
            value={input}
            placeholder={"Type something ... "}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            style={{
              boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.23 )",
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: "10px",
              width: "100%",
              padding: "20px",

              fontWeight: "normal",
              fontSize: "15px",
            }}
          />
        </form>
      </div>
    </>
  );
};

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
          color: you ? "black" : "white",
          background: you
            ? "rgba(177, 231, 106, 0.50 )"
            : "(255, 255, 255, 0.70 )",
          width: "fit-content",
          padding: "10px",
          marginTop: "5px",
          marginBottom: "5px",
          borderRadius: "10px",
          backdropFilter: "blur( 4.5px )",
          WebkitBackdropFilter: "blur( 4.5px )",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const IntroductionComponent = (props) => {
  return (
    <div>
      <style jsx>
        {`
          .start-button:hover {
            box-shadow: 0 0 50px rgba(33, 33, 33, 0.8);
            background-color: rgba(0, 0, 0, 1);
          }
        `}
      </style>
      <h1
        style={{
          fontSize: "50px",
          color: "white",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        Text whatever, wherever, whenever you want.
      </h1>

      <button
        className="start-button"
        onClick={() => props.setIsClicked(true)}
        style={{
          transition: "box-shadow .3s",
          backgroundColor: "rgba(0, 0, 0, 1)",
          borderRadius: "10px",
          fontWeight: "bold",
          border: "none",
          padding: "15px 32px",
          textAlign: "center",
          textDecoration: "none",
          display: "inline-block",
          fontSize: "16px",
        }}
      >
        <span style={{ color: "white" }}> Open the box ?</span>
      </button>
    </div>
  );
};

const LogoComponent = () => {
  return (
    <a href="">
      <div
        style={{
          position: "absolute",
          left: "20px",
          top: "20px",
          flexDirection: "row",
          display: "inline-flex",
        }}
      >
        <div
          style={{
            boxShadow: "0 0 60px rgba(33, 33, 33, 0.8)",
            height: "45px",
            width: "45px",
            backgroundColor: "black",
            borderRadius: "5px",
            color: "white",
          }}
        >
          <p
            style={{
              marginTop: "9px",
              position: "relative",
              fontWeight: "bolder",
              fontSize: "22px",
            }}
          >
            P
          </p>
        </div>
        <h1 style={{ color: "white", marginTop: "3px", marginLeft: "10px" }}>
          PANDORA
        </h1>
      </div>
    </a>
  );
};
