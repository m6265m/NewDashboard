import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import axios from "axios";
import { IconButton, TextField } from "@material-ui/core";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

const useStyles = makeStyles({
  root: {
    maxWidth: 350,
    minWidth: window.innerwidth > 400 ? 260 : 210,
    margin: 10,
    position: "relative",
  },
  media: {
    height: window.innerwidth > 400 ? 270 : 220,
  },

  input: { display: "none" },
  // media: {
  //   height: 0,
  //   paddingTop: "56.25%", // 16:9
  // },
  // card: {
  //   position: "relative",
  // },
  overlay: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "black",
    backgroundColor: "white",
  },
});

export default function AddType(props) {
  const { token, done } = props;
  const classes = useStyles();
  let store = require("store");
  const [userData, setUserData] = useState(store.get("userData"));
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [typeName, setTypeName] = useState("");
  const [Error, setError] = useState("");

  const onChange = (e) => {
    console.log("changing");
    setNewImage(e.target.files[0]);

    setImage(URL.createObjectURL(e.target.files[0]));
  };
  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const ValidateAndAddType = () => {
    if (typeName === "") {
      setError("Add a valid type name");
    } else if (image == null) {
      setError("Select an image");
    } else addType();
  };

  const addType = () => {
    console.log("inside photo upload");
    const formData = new FormData();
    formData.set("type", typeName);

    formData.append("image", newImage);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        "x-access-token": token,
      },
    };
    axios
      .post(
        "https://m2r31169.herokuapp.com/api/addComplaintTypes",
        formData,
        config
      )
      .then((response) => {
        console.log("done photo upload");
        // alert("The profile image is successfully uploaded");
        // setImage("https://m2r31169.herokuapp.com" + response.data);

        done();
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
        if (err.response) {
          if (err.response.status === 406) alert("The type is already added  ");

          if (err.response.status === 400)
            alert("Please choose a valid image  ");
        } else {
          console.log(err);
        }
      });
  };

  useEffect(() => {
    setImage(null);
    setTypeName("");
  }, []);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia className={classes.media} title={typeName} image={image} />
        <input
          accept="image/*"
          className={classes.input}
          id={"icon-button-file" + "new"}
          type="file"
          onChange={onChange}
        />
        <label htmlFor={"icon-button-file" + "new"}>
          <div className="overlay" style={{ opacity: 1 }}>
            <CameraAltIcon
              style={{
                top: "40%",
                left: "40%",
                position: "relative",
                fontSize: "50px",
                color: "teal",
              }}
            />
          </div>
        </label>
        <CardContent style={{ paddingTop: "20px" }}>
          <TextField
            id="standard-basic"
            label="Type Name"
            value={typeName}
            onChange={(event) => {
              setTypeName(event.target.value);
            }}
          />
          <Box style={{ color: "red" }}>{Error}</Box>
        </CardContent>
      </CardActionArea>
      <CardActions style={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          style={{
            Width: "100%",
            background: "teal",
            border: 0,
            color: "white",

            textDecoration: "none",
          }}
          onClick={() => {
            ValidateAndAddType();
          }}
        >
          Add Complaint Type
        </Button>
      </CardActions>
    </Card>
  );
}
