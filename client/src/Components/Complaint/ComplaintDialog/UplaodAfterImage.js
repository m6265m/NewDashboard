import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { IconButton, TextField } from "@material-ui/core";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    minWidth: 260,
    margin: 10,
    position: "relative",
  },
  media: {
    height: 250,
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

export default function UploadAfterImage(props) {
  const { uploadImage } = props;
  const classes = useStyles();
  const [image, setImage] = useState(null);

  const [opacity, setOpacity] = useState(1);

  const onChange = (e) => {
    uploadImage(e.target.files[0]);

    setImage(URL.createObjectURL(e.target.files[0]));
    setOpacity(0);
  };

  useEffect(() => {
    setImage(null);
  }, []);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia className={classes.media} image={image} />
        <input
          accept="image/*"
          className={classes.input}
          id={"icon-button-file" + "new"}
          type="file"
          onChange={onChange}
        />
        <label htmlFor={"icon-button-file" + "new"}>
          <div className="overlay" style={{ opacity: opacity }}>
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
      </CardActionArea>
      {/* <CardActions style={{ justifyContent: "center" }}>
        <Button
          style={{
            Width: "100%",
            color: "teal",

            border: 0,

            textDecoration: "none",
          }}
          onClick={() => {
            ValidateAndAddType();
          }}
        >
          {"Upload after image"}
        </Button>
      </CardActions> */}
    </Card>
  );
}
