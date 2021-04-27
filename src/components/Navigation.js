import React from 'react';
import { Link } from 'react-router-dom';
import { FcCamcorderPro, FcPicture } from 'react-icons/fc';

const Navigation = () => (
  <div className="navigation">
    <div id="navBar" style={navBar}>
      <Link className="link" to="/object_detection"><FcCamcorderPro />Object Detection</Link>
      <Link className="link" to="/image_recognition"><FcPicture />Image Recognition</Link>
    </div>
  </div>
)

const navBar = {
  height: "50px",
  display: "flex",
  justifyContent: "space-between",
  textAlign: "center",
  alignItems: "center"
}

export default Navigation;