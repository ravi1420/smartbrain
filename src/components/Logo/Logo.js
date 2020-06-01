import React from "react";
import Tilt from "react-tilt";
import "./Logo.css";
import facelogo from "./face.png";

const Logo = () => {
  return (
    <div className="ma4 mt0 center">
      <Tilt
        className="Tilt br2 shadow-2"
        options={{ max: 45 }}
        style={{ height: 100, width: 100 }}
      >
        <div className="Tilt-inner">
          <img src={facelogo} alt="logo" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
