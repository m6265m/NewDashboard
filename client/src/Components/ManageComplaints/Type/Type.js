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
let store = require("store");

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

export default function Type(props) {
  const {
    name,
    image,
    enable,
    id,
    token,
    done,
    edit,
    allowEdit,
    doneEnable,
  } = props;
  const classes = useStyles();
  let store = require("store");
  const [userData, setUserData] = useState(store.get("userData"));

  const [input, setInput] = useState(false);
  const [inputImage, setInputImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [typeName, setTypeName] = useState(name);
  const [opacity, setOpacity] = useState(0);
  const [typeImage, setImage] = useState(image);

  useEffect(() => {
    allowEdit ? setInput(true) : setInput(false);
  }, [allowEdit]);

  const onChange = (e) => {
    setInputImage(true);
    setNewImage(e.target.files[0]);

    setImage(URL.createObjectURL(e.target.files[0]));
  };
  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };
  const uploadImage = () => {
    console.log("inside photo upload");
    const formData = new FormData();
    formData.set("id", id);
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
        "https://m2r31169.herokuapp.com/api/editComplaintTypeAndImage",
        formData,
        config
      )
      .then((response) => {
        console.log("done photo upload");
        // alert("The profile image is successfully uploaded");
        // setImage("https://m2r31169.herokuapp.com" + response.data);
        setInputImage(false);
        done();
      })
      .catch((err) => {
        setInputImage(false);
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
          if (err.response.status == 400)
            alert("Please choose a valid image  ");
        } else {
          console.log(err);
        }
      });
  };
  const updateType = () => {
    if (typeName === "") setTypeName(name);

    if (typeName != name || inputImage) uploadImage();
  };

  const ToggleAndUpdate = () => {
    edit(id);
    //update
    if (input) {
      updateType();
    }

    //toggle
    setInput(!input);
    setOpacity(opacity == 0 ? 1 : 0);
  };

  const changeStatus = (id) => {
    axios
      .post(
        "https://m2r31169.herokuapp.com/api/enableDisableComplaintType",
        { id: id },
        {
          headers: {
            "x-access-token": token, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        console.log("post hogayi" + res.data);
        doneEnable();
      })
      .catch((err) => {
        console.log("error agaya" + err);
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
      });
  };

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={typeImage}
          title={typeName}
        />
        <input
          disabled={input ? false : true}
          accept="image/*"
          className={classes.input}
          id={"icon-button-file" + id}
          type="file"
          onChange={onChange}
        />
        <label htmlFor={"icon-button-file" + id}>
          <div className="overlay" style={{ opacity: opacity }}>
            <CameraAltIcon
              style={{
                top: "40%",
                left: "40%",
                position: "relative",
                fontSize: "50px",
              }}
            />
          </div>
        </label>
        <CardContent>
          {input ? (
            <TextField
              required
              id="standard-required"
              value={typeName}
              onChange={(event) => {
                setTypeName(event.target.value);
              }}
            />
          ) : (
            <Box
              fontWeight="700"
              component="span"
              fontSize="1.2rem"
              color="black"
            >
              {typeName}
            </Box>
          )}

          {/* <IconButton>
            <EditIcon style={{ fontSize: 15, color: "grey", float: "left" }} />
          </IconButton> */}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            ToggleAndUpdate();
          }}
        >
          {input ? "Save" : "Edit"}
        </Button>{" "}
        <Button
          size="small"
          onClick={() => changeStatus(id)}
          style={{ color: enable ? "teal" : "grey" }}
        >
          {enable ? "Disable" : "Enable"}
        </Button>
      </CardActions>
    </Card>
  );
}
