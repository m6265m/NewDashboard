import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Avatar,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  Input,
  InputLabel,
} from "@material-ui/core";

import ImageComponent from "../Profile/ImageComponent";
import UserStatistics from "../Profile/UserStatistics";
import Alerts from "../Profile/Alerts";
import ChangePassword from "../Profile/ChangePassword";
import "../../ComponentsCss/Profile.css";
import AccountCircle from "@material-ui/icons/AccountCircle";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import LockIcon from "@material-ui/icons/Lock";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
let store = require("store");

function Profile(props) {
  const { notification } = props;

  const [open, setOpen] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setphoneNumber] = React.useState("");
  const [userData, setUserData] = useState(store.get("userData"));
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imageUpload, setImageUpload] = useState(false);
  const [imageRemove, setImageRemove] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    console.log(userData.userData.image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeProfileImage = () => {
    setImageRemove(true);
    setImageUpload(false);
  };

  const uploadProfileImage = (file) => {
    setImageUpload(true);
    setImageRemove(false);
    setImage(file);
  };

  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const updateProfile = () => {
    // console.log(
    //   JSON.stringify({
    //     ...userData,
    //     userData: {
    //       ...tempObj,
    //       name: fullName,
    //       email: email,
    //       phoneNumber: phoneNumber,
    //       image: image,
    //     },
    //   })
    // );
    setphoneNumber("+92" + phoneNumber.slice(-10));
    setLoading(true);
    console.log("lalal" + phoneNumber, fullName, email);
    if (imageRemove) {
      onPhotoRemove();
    } else if (imageUpload) {
      onPhotoUpload();
    } else if (fullName != userData.userData.name) {
      update(fullName, "name", "Name");
    } else if (email != userData.userData.email) {
      update(email, "email", "Email");
    } else if (
      "+92" + phoneNumber.slice(-10) !=
      userData.userData.phoneNumber
    ) {
      //console.log("lalal" + phoneNumber, fullName, email);
      update("+92" + phoneNumber.slice(-10), "phoneNumber", "phoneNumber");
    } else setLoading(false);
  };

  const onPhotoRemove = () => {
    axios
      .post(
        "https://m2r31169.herokuapp.com/api/removeProfilePicture",
        {},

        {
          headers: {
            "x-access-token": userData.accessToken, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        setImage(null);
        setImageRemove(false);
        setLoading(false);
        store.set("userData", {
          ...userData,
          userData: {
            ...userData.userData,
            image: null,
          },
        });
        props.updateProfileImage(null);
        console.log("post hogayi" + res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          }
          if (err.response.status === 503 || err.response.status === 500) {
            console.log(err.response.status);
            alert("Something went wrong. Please try again later");
          }
        }
        setLoading(false);
        console.log("error agaya" + err);
      });
  };

  const onPhotoUpload = () => {
    console.log("inside photo upload");
    const formData = new FormData();

    formData.append("profilePicture", image);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        "x-access-token": userData.accessToken,
      },
    };
    axios
      .post(
        "https://m2r31169.herokuapp.com/api/admin/uploadProfilePicture",
        formData,
        config
      )
      .then((response) => {
        console.log("done photo upload");
        // alert("The profile image is successfully uploaded");
        setImage(response.data);
        setLoading(false);
        setImageUpload(false);
        store.set("userData", {
          ...userData,
          userData: {
            ...userData.userData,
            image: response.data,
          },
        });
        props.updateProfileImage(response.data);
      })
      .catch((err) => {
        setImageUpload(false);
        setLoading(false);
        if (error.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          }

          if (error.response.status == 400)
            alert("Please choose a valid image  ");
        }
        if (err.response.status === 503 || err.response.status === 500) {
          console.log(err.response.status);
          alert("Something went wrong. Please try again later");
        } else {
          console.log(err);
        }
      });
  };

  const update = (value, key, api) => {
    console.log("update" + value);

    axios
      .post(
        "https://m2r31169.herokuapp.com/api/update" + api,
        {
          [key]: value,
        },
        {
          headers: {
            "x-access-token": userData.accessToken, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        console.log("profile updated" + res.data);
        setLoading(false);
        store.set("userData", {
          ...userData,
          userData: {
            ...userData.userData,
            [key]: value,
          },
        });
        setUserData(store.get("userData"));
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          }
          if (err.response.status === 503 || err.response.status === 500) {
            console.log(err.response.status);
            alert("Something went wrong. Please try again later");
          }
        }
        setLoading(false);
        console.log("error " + error);
      });
  };

  //USE EFFECT
  useEffect(() => {
    // props.history.push("/error");

    console.log("imageee notif", loading, notification, props.history);
    if (Object.keys(userData).length > 0) {
      setFullName(userData.userData.name);
      setEmail(userData.userData.email);
      setphoneNumber(userData.userData.phoneNumber);
      setImage(userData.userData.image);
    }
  }, [userData, notification]);
  return (
    <div>
      <Grid container>
        <Grid
          container
          xs={12}
          sm={12}
          md={8}
          lg={8}
          item={true}
          alignItems="center"
          display="flex"
          className="mainSetting"
        >
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              component="div"
              fontSize="1.5rem"
              color="black"
              style={{
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {"Account Settings"}
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <ImageComponent
              uploadImage={uploadProfileImage}
              removeImage={removeProfileImage}
              userName={
                Object.keys(userData).length > 0 && userData.userData.username
              }
              role={
                Object.keys(userData).length > 0 &&
                (userData.Role == "ADMIN" ? "Administrator" : "Supervisor")
              }
              image={
                Object.keys(userData).length > 0 &&
                (userData.userData.image == null
                  ? null
                  : userData.userData.image)
              }
            />
          </Grid>

          <Grid
            container
            xs={12}
            sm={12}
            md={12}
            lg={12}
            item={true}
            justify={window.innerWidth < 500 ? "flex-start" : "space-around"}
            style={{ paddingTop: "2rem" }}
          >
            <Box className="elevation" style={{ margin: "10px" }}>
              <TextField
                id="input-with-icon-textfield"
                label="Full Name"
                value={
                  fullName
                  // ? userData.userData.name
                  // : ""
                }
                onChange={(event) => {
                  setFullName(event.target.value);
                }}
                InputProps={{
                  className: "settingInput",
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box className="elevation" style={{ margin: "10px" }}>
              <TextField
                className="settingInput"
                id="input-with-icon-textfield"
                type="email"
                label="Email Address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                InputProps={{
                  className: "settingInput",
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box className="elevation" style={{ margin: "10px" }}>
              <TextField
                id="input-with-icon-textfield"
                label="Phone Number"
                inputProps={{ maxLength: 10 }}
                value={phoneNumber.slice(-10)}
                onChange={(event) => {
                  const re = /^[0-9\b]+$/;

                  if (
                    event.target.value === "" ||
                    re.test(event.target.value)
                  ) {
                    console.log(event.target.value + "phonenumber");
                    setphoneNumber(event.target.value);
                  }
                }}
                InputProps={{
                  className: "settingInput",

                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                      +92
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box className="elevation" style={{ margin: "10px" }}>
              <FormControl>
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={"password"}
                  value={"sdds"}
                  readOnly={true}
                  className="settingInput"
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        aria-label="toggle password visibility"
                        onClick={() => handleClickOpen()}
                      >
                        Change
                      </Button>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Box>

            {/* <TextField
                id="outlined-helperText"
                label="Name"
                defaultValue=""
                variant="outlined"
              />
              <TextField
                id="outlined-helperText"
                label="Email Address"
                defaultValue=""
                variant="outlined"
              />

              <TextField
                id="outlined-helperText"
                label="Phone Number"
                defaultValue="Phone Number"
                variant="outlined"
              /> */}
            {/* </Grid>
            <Grid
              container
              xs={12}
              sm={12}
              md={6}
              lg={6}
              justify="space-between"
            >
              {/* <Settings /> */}
            {/* </Grid> */}
            {/* <Button>Change Password</Button> */}
          </Grid>

          <ChangePassword
            open={open}
            dialogClose={handleClose}
            userData={userData}
          />
          <Grid
            container
            xs={12}
            sm={12}
            md={12}
            lg={12}
            item={true}
            style={{ paddingTop: "1rem" }}
            justify="center"
          >
            <Box component="div" style={{ color: "red", fontWeight: "500" }}>
              {error}
            </Box>
          </Grid>

          <Grid
            container
            item={true}
            justify="center"
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <Button
              variant="contained"
              style={{
                minWidth: 200,
                background: "linear-gradient(45deg, #008080 30%, #20B2AA 90%)",
                border: 0,
                color: "white",
                padding: 10,
                justifyContent: "center",
                textDecoration: "none",
                display: loading ? "none" : "block",
              }}
              onClick={() => {
                if (phoneNumber.length < 10) {
                  setError("Phone number is not valid");
                } else if (!validateEmail(email)) {
                  setError("Email is not valid");
                } else {
                  updateProfile();
                  setError("");
                }
              }}
            >
              Save
            </Button>
            <CircularProgress
              style={{ display: loading ? "block" : "none", color: "teal" }}
            />
          </Grid>
        </Grid>
        {window.innerWidth > 500 && (
          <Grid container item={true} xs={12} sm={12} md={4} lg={4}>
            <Grid item xs={12} sm={6} md={12} lg={12}>
              <Alerts data={notification} key={notification.length} />
            </Grid>
            <Grid item xs={12} sm={6} md={12} lg={12}>
              <UserStatistics
                token={userData.accessToken}
                role={userData.Role}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Profile;
