import {
  Box,
  Avatar,
  makeStyles,
  Badge,
  withStyles,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from "@material-ui/icons/Delete";
import cameraIcon from "../../assets/images/camera.webp";

const useStyles = makeStyles((theme) => ({
  large: {
    fontSize: "10rem",
    width: "12rem",
    height: "12rem",
  },
  input: { display: "none" },
}));

const SmallAvatar = withStyles((theme) => ({
  root: {
    background: "white",
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const ITEM_HEIGHT = 48;

export default function ImageComponent(props) {
  const { userName, role, uploadImage, image, removeImage } = props;
  const classes = useStyles();
  const [images, setImage] = useState(image);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChange = (e) => {
    uploadImage(e.target.files[0]);

    setImage(URL.createObjectURL(e.target.files[0]));
  };



  return (
    <div
    // className="elevation"
    >
      <input
        accept="image/*"
        className={classes.input}
        id="icon-button-file"
        type="file"
        onChange={onChange}
      />

      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <Box
            alignItems="center"
            justifyContent="flex-start"
            display="flex"
            flexDirection="column"
            textAlign="center"
            paddingTop={2}
            paddingBottom={2}
          >
            <Badge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              style={{ color: "grey" }}
              badgeContent={
                <div>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    onClick={handleClick}
                  >
                    <SmallAvatar src={cameraIcon} />{" "}
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                      },
                    }}
                  >
                    <MenuItem key={"upload"} onClick={handleClose}>
                      <PublishIcon />
                      <label
                        style={{
                          color: "black",
                          fontSize: 15,
                          textAlign: "center",
                        }}
                        htmlFor="icon-button-file"
                      >
                        <Box
                          // style={{
                          //   marginTop: "-5px",
                          // }}
                          component="span"
                        >
                          Upload
                        </Box>
                      </label>
                    </MenuItem>

                    <MenuItem
                      disabled={images == null ? true : false}
                      style={{
                        color: "black",
                        fontSize: 15,
                      }}
                      key={"remove"}
                      onClick={() => {
                        removeImage();
                        setImage(null);
                        handleClose();
                      }}
                    >
                      <DeleteIcon /> <Box>Remove</Box>
                    </MenuItem>
                  </Menu>
                </div>
              }
            >
              {/* <input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
              /> */}
              <Avatar
                style={{ color: "white", background: "teal" }}
                className={classes.large}
                src={
                  images
                  // ||
                  // AccountCircleRoundedIcon
                }
              />
              {/* <AccountCircleRoundedIcon style={{ fontSize: "inherit" }} />
              </Avatar> */}
              {/* <Avatar 
  src="/images/example.jpg" 
  style={{
    margin: "10px",
    width: "60px",
    height: "60px",
  }} 
 /> */}
            </Badge>

            <Box>
              <Box fontWeight="600" color="black">
                {userName}
              </Box>
              <Box color="black">{role}</Box>
            </Box>
          </Box>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={12}>
          <Box marginTop={5} className="list">
            Complaints Assigned : 25{" "}
          </Box>
          <Box className="list">Complaints Resolved : 10 </Box>
          <Box className="list">Complaints Rejected : 5 </Box>
        </Grid> */}
      </Grid>
    </div>
  );
}
