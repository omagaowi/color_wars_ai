import React from "react";
// import "./CircularLoader.css";
import "../styles/circularLoader.css";

const CircularLoader = ({
  size = 40,
  border = 4,
  color = "#3498db",
  speed = "1s",
}) => {
  return (
    <div
      className="circular-loader"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        animationDuration: speed,
        borderTopWidth: border,
      }}
    ></div>
  );
};

export default CircularLoader;
