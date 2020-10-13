import PropTypes from "prop-types";
import LockIcon from "@material-ui/icons/Lock";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Dialog,
  Grid,
  InputAdornment,
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

export default function ChangePassword(props) {
  const { dialogClose, open } = props;
  let store = require("store");

  const [userData, setUserData] = useState(store.get("userData"));
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [Selstatus, setSelStatus] = React.useState({});
  const [location, setLocation] = React.useState(
    "Your geolocation will be shown here"
  );

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const handleSaveClose = () => {
    // dialogClose();
    changePasswordApi();
  };

  const changePasswordApi = () => {
    setError("");
    setLoading(true);
    axios
      .post(
        "https://m2r31169.herokuapp.com/api/changePassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            "x-access-token": userData.accessToken, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        dialogClose();
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          } else if (
            err.response.status === 503 ||
            err.response.status === 500
          ) {
            console.log(err.response.status);
            alert("Something went wrong. Please try again later");
          } else if (err.response.status === 400) {
            setError("Incorrect existing password");
            console.log("error" + err);
          }
        }
      });
  };

  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={dialogClose}
      maxWidth="sm"
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Box
          component="div"
          fontSize="1.2rem"
          color="black"
          style={{
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {"Change Password"}
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* <DialogContentText>Enter existing and new Passwords</DialogContentText> */}
        <Grid container justify="space-around">
          <TextField
            id="input-with-icon-textfield"
            label="Existing Password"
            type="password"
            onChange={(event) => {
              setOldPassword(event.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            id="input-with-icon-textfield"
            label="New Password"
            type={showPassword ? "text" : "password"}
            onChange={(event) => {
              setNewPassword(event.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Box
          component="div"
          fontSize="1rem"
          color="red"
          style={{
            textAlign: "center",
            fontWeight: "400",
          }}
        >
          {Error}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialogClose} color="primary">
          Cancel
        </Button>
        <Button
          style={{ display: loading ? "none" : "block" }}
          onClick={() => {
            handleSaveClose();
          }}
        >
          Done
        </Button>
        <CircularProgress
          style={{ display: loading ? "block" : "none", color: "teal" }}
        />
      </DialogActions>
    </Dialog>
  );
}

ChangePassword.propTypes = {
  // sel: PropTypes.object.isRequired,
  // open: PropTypes.string.isRequired,
  // save: PropTypes.func.isRequired,
  // dialogClose: PropTypes.func.isRequired,
};
