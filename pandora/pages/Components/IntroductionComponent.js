import React from 'react';
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
  
  export default IntroductionComponent;