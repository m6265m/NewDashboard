import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import CheckIcon from "@material-ui/icons/Check";
import HourglassFullTwoToneIcon from "@material-ui/icons/HourglassFullTwoTone";
import ClearIcon from "@material-ui/icons/Clear";
import PropTypes from "prop-types";
import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";

export default function Status(props) {
  const { buttonComp, name, display } = props;

  const [color, setColor] = useState("#008080");
  const [bgcolor, setBgcolor] = useState(lighten("#008080", 0.75));

  const setValues = () => {
    if (name === "Assigned" || name === "Active") {
      setColor("rgb(142, 36, 170)");
      setBgcolor(lighten("rgb(142, 36, 170)", 0.75));
    } else if (name === "Unresolved") {
      setColor("red");
      setBgcolor("#ff000052");
    } else if (name === "Rejected") {
      setColor("#FFB400");
      setBgcolor("rgba(251, 179, 26, 0.33)");
    } else if (name === "Resolved") {
      setColor("#008081");
      setBgcolor("#daf4db");
    }
  };
  useEffect(() => {
    setValues();
  }, [name]);

  return (
    <Box
      component={buttonComp}
      // onClick={() => onFilterTable("status", name)}
      className="status"
      style={{
        display: display ? display : "flex",
        alignItems: "center",
        background: bgcolor,
        color: color,
        minWidth: "80px",
      }}
    >
      {name === "Resolved" && (
        <CheckIcon style={{ fontSize: "18px", marginRight: "5px" }} />
      )}
      {(name === "Assigned" || name === "Active") && (
        <HourglassFullTwoToneIcon
          style={{ fontSize: "18px", marginRight: "5px" }}
        />
      )}
      {name === "Unresolved" && (
        <ClearIcon style={{ fontSize: "18px", marginRight: "5px" }} />
      )}
      {name === "Rejected" && (
        <ErrorOutlineOutlinedIcon
          style={{ fontSize: "18px", marginRight: "5px" }}
        />
      )}

      {props.name}
    </Box>
  );
}
