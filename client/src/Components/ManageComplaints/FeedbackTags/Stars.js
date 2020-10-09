import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox, FormControlLabel } from "@material-ui/core";

export default function FeedbackTags(props) {
  const { token, item, save } = props;
  let store = require("store");
  const [userData, setUserData] = useState(store.get("userData"));

  const handleChange = (event) => {
    if (event.target.checked)
      addStarToTag(event.target.name, event.target.checked);
    else {
      deleteStarToTag(event.target.name, event.target.checked);
    }
  };
  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const addStarToTag = (id, yes) => {
    console.log("iteemmmmmmmmmmmmm" + id, yes);
    axios
      .post(
        "https://m2r31169.herokuapp.com/api/addTagToStar",
        { tagId: item.id, starId: id },
        {
          headers: {
            "x-access-token": token, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        console.log("post hogayi" + res.data);
        save();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          } else if (
            err.response.status === 503 ||
            err.response.status === 500
          ) {
            console.log(err.response.status);
            alert("Something went wrong. Please try again later");
          }
        }
        console.log("error agaya" + err);
      });
  };

  const deleteStarToTag = (id, yes) => {
    console.log("iteemmmmmmmmmmmmm" + id, yes);
    axios
      .post(
        "https://m2r31169.herokuapp.com/api/deleteTagOfStar",
        { tagId: item.id, starId: id },
        {
          headers: {
            "x-access-token": token, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        console.log("post hogayi" + res.data);
        save();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          } else if (
            err.response.status === 503 ||
            err.response.status === 500
          ) {
            console.log(err.response.status);
            alert("Something went wrong. Please try again later");
          }
        }
        console.log("error agaya" + err);
      });
  };
  return (
    <div>
      {["1", "2", "3", "4", "5"].map((x) => {
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={item.Stars.includes(x)}
                onChange={handleChange}
                name={x}
              />
            }
            label={x}
          />
          // <Chip
          //   //icon={icon}
          //   label={x}
          //   // onDelete={item.number == edit ? "some" : undefined}
          //   className={classes.chip}
          // />
        );
      })}
    </div>
  );
}
