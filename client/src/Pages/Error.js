import React, { useState, useEffect } from "react";
import axios from "axios";
import image from "../assets/images/app_icon_without_bg.png";
import Button from "@material-ui/core/Button/index";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import "../PagesCss/Error.css";

function ErrorPage(props) {
  //USE EFFECT
  useEffect(() => {
    // setUserData(store.get("userData"));
  }, []);

  return (
    <div>
      <div className="circle">{props.code}</div>
      {/*<div className="centered-text">*/}
      {/*    <p style={{ fontSize: "90px" }}>{props.code}</p>*/}
      {/*</div>*/}
      <div className="bottom-text">
        <p>{"Service Temporarily Unavailable"}</p>
      </div>
    </div>
  );
}

export default ErrorPage;
