import ChatComponent from "./Components/ChatComponent";
import LogoComponent from "./Components/Logo";
import IntroductionComponent from "./Components/IntroductionComponent";
import React from "react";

const MainPage = () => {
  const [isClicked, setIsClicked] = React.useState(false);

  function componentResolver(isCliked) {
    if (isClicked) return <ChatComponent />;
    return <IntroductionComponent setIsClicked={setIsClicked} />;
  }
  return (
    <>
      <style>
        {`
          .gradient {
            background: linear-gradient(340deg, #2c9076, #6369c1, #e16060);
            background-size: 600% 600%;

            -webkit-animation: AnimationName 50s ease infinite;
            -moz-animation: AnimationName 50s ease infinite;
            -o-animation: AnimationName 50s ease infinite;
            animation: AnimationName 50s ease infinite;
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
