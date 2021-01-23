import React from 'react';
const LogoComponent = () => {
  return (

    <a
      href=""
      style={{
        zIndex: 2,
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
      <h1 style={{ color: "white", marginTop: "3px", marginLeft: "10px", textShadow: '0px 0px 40px black', }}>
        PANDORA
          </h1>
    </a>

  );
};

export default LogoComponent;