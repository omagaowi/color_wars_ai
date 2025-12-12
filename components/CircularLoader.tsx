import React from "react";
// import "./CircularLoader.css";
import '../styles/circularLoader.css'

const CircularLoader = ({ size = 40, color = "#3498db", speed = "1s" }) => {
  return (
    <div
      className="circular-loader"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        animationDuration: speed,
      }}
    ></div>
  );
};

export default CircularLoader;
