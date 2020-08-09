import React from "react";
import { useState, useEffect } from "react";
import { ImpulseSpinner } from "react-spinners-kit";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddBoxTwoToneIcon from "@material-ui/icons/AddBoxTwoTone";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";
import AddBoxIcon from "@material-ui/icons/AddBox";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Backdrop from "@material-ui/core/Backdrop";
// import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import "../../ComponentsCss/Complaints.css";
import "../../ComponentsCss/Supervisor.css";

let store = require("store");
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
  },
  myButton: {
    background: "linear-gradient(45deg, #008080 30%, #20B2AA 90%)",
    border: 0,
    color: "white",
    width: 100,
    justifyContent: "center",
    textDecoration: "none",
    boxShadow: "0px 8px 10px -5px rgba(124,133,133,1)",
    marginRight: "15px",
    marginBottom: "7px",
  },
  backdrop: {
    zIndex: 1,
    color: "#fff",
  },
}));

export default function AddForm(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [towns, setTowns] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(store.get("userData"));
  const [form, setForm] = useState({
    username: "",
    helperTextUserName: "",
    errorUser: false,

    password: "",
    showPassword: false,
    helperTextPassword: "",
    errorPassword: false,

    name: "",
    helperTextName: "",
    errorName: false,

    email: "",
    helperTextEmail: "",
    errorEmail: false,

    phoneNumber: "",
    helperTextPhoneNumber: "",
    errorPhoneNumber: false,

    town: "",
    helperTextMain: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };

  const handleClickShowPassword = () => {
    setForm({ ...form, showPassword: !form.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changeHandler = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleUserNameBlur = (event) => {
    let letters = /^[0-9a-zA-Z]+$/;
    if (form.username !== "" && !form.username.match(letters)) {
      setForm({
        ...form,
        helperTextUserName: "Please use alphanumerics",
        errorUser: true,
      });
    } else {
      setForm({
        ...form,
        helperTextUserName: "",
        errorUser: false,
      });
    }
  };

  const handleNameBlur = (event) => {
    let letters = /^[A-Za-z]+$/;
    if (form.name !== "" && !form.name.match(letters)) {
      setForm({
        ...form,
        helperTextName: "Please use alphabets",
        errorName: true,
      });
    } else {
      setForm({
        ...form,
        helperTextName: "",
        errorName: false,
      });
    }
  };
  const handleEmailBlur = (event) => {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (form.email !== "" && !form.email.match(mailformat)) {
      setForm({
        ...form,
        helperTextEmail: "Please enter valid email",
        errorEmail: true,
      });
    } else {
      setForm({
        ...form,
        helperTextEmail: "",
        errorEmail: false,
      });
    }
  };
  const handlePhoneNumberBlur = (event) => {
    let phoneno = /^\d{11}$/;
    if (form.phoneNumber !== "" && !form.phoneNumber.match(phoneno)) {
      setForm({
        ...form,
        helperTextPhoneNumber: "Invalid phone number",
        errorPhoneNumber: true,
      });
    } else {
      setForm({
        ...form,
        helperTextPhoneNumber: "",
        errorPhoneNumber: false,
      });
    }
  };

  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  // const handleOnFocus = (text, err) => {
  //   setForm({
  //     ...form,
  //     text: "",
  //     err: false,
  //     helperTextMain: "",
  //   });
  // };
  // const handlePasswordBlur = (event) => {
  //   let letters = /^[0-9a-zA-Z]+$/;
  //   if (!form.username.match(letters)) {
  //     setForm({
  //       ...form,
  //       helperTextUserName: "Please use alphanumerics.",
  //       errorUser: true,
  //     });
  //   } else {
  //     setForm({
  //       ...form,
  //       helperTextUserName: "",
  //       errorUser: false,
  //     });
  //   }
  // };

  const list = props.town.map((r) => {
    return <MenuItem value={r}>{r}</MenuItem>;
  });

  function handleClick(event) {
    event.preventDefault();
    const str = form.phoneNumber;
    const n = 10;
    const newP = "+92" + str.slice(-n);
    // console.log(newP);

    /*
      Output: 2015
    */
    setLoading(true);
    const userObject = {
      name: form.name,
      username: form.username,
      password: form.password,
      email: form.email,
      phoneNumber: newP,
      role: "SUPERVISOR",
      town: form.town,
      //mac: _macAddress,
    };

    if (
      form.username === "" ||
      form.password === "" ||
      form.phoneNumber === "" ||
      form.email === "" ||
      form.name === "" ||
      form.town === ""
    ) {
      setForm({
        ...form,
        helperTextMain: "*Please fill all fields",
      });
      setLoading(false);
    } else {
      axios
        .post(
          "https://m2r31169.herokuapp.com/api/createSupervisor",
          userObject,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": userData.accessToken, //the token is a variable which holds the token
            },
          }
        )
        .then(async (res) => {
          if (res.status === 200) {
            // console.log("ye hai prop" + props.row);
            setLoading(false);
            setOpen(false);
            // let temp = props.row.length - 2;
            // let id = JSON.stringify(props.row[temp].supervisorId) + 1;
            // JSON.stringify(props.row).push({
            //   supervisorId: id,
            //   name: form.name,
            //   email: form.email,
            //   username: form.email,
            //   phoneNumber: form.phoneNumber,
            //   image: null,
            //   town: form.town,
            // });
            // localStorage.setItem('accessToken',res.data.accessToken)

            // store.set("userData", res.data);
            // console.log("logged in!!");
            // window.location = "/dashboard/home";
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status == 400) {
              setLoading(false);
              if (err.response.data == "email") {
                setForm({
                  ...form,
                  helperTextMain: "*Email is already in use",
                });
              } else if (err.response.data == "username") {
                setForm({
                  ...form,
                  helperTextMain: "*Username is already in use",
                });
              } else if (err.response.data == "phoneNumber") {
                setForm({
                  ...form,
                  helperTextMain: "*PhoneNumber is already in use",
                });
              }
              // setOpen(false);
            } else if (
              err.response.status === 401 ||
              err.response.status === 403
            ) {
              handleLogoutAutomatically();
            }
            // if (err.response.status === 401 || err.response.status === 403) {
            //   handleLogoutAutomatically();
            // }
          }

          // console.log("complaints nahi arhi", err.response);
          // setErrors(err);
        });
    }
  }

  return (
    <div>
      {" "}
      <AddBoxIcon
        className="addbutton"
        onClick={handleClickOpen}
        style={{
          fontSize: "1.7rem",
          color: "#008080",
          border: 0,
        }}
      ></AddBoxIcon>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <Paper
          className="filter elevationPaper"
          fullWidth
          padding="none"
          className="detail"
          style={{
            textDecoration: "none",
            boxShadow: "0px 8px 10px -5px rgba(124,133,133,1)",
            borderBottom: "3px solid #008080",
          }}
        >
          <div>
            <Box
              className="box1 detail"
              textAlign="left"
              color="#008080"
              fontWeight="500"
              fontSize="16px"
              padding="none"
              margin="2px"
              component="span"
            >
              Add Details
            </Box>{" "}
          </div>
        </Paper>
        <DialogContent>
          <div className={classes.margin}>
            <form>
              <Grid
                container
                spacing={2}
                // align="right"
                justify="flex-start"
              >
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    error={form.errorName}
                    helperText={form.helperTextName}
                    label="Name"
                    id="name"
                    name={"name"}
                    value={form.name}
                    onChange={changeHandler}
                    onBlur={handleNameBlur}
                    onFocus={() => {
                      setForm({
                        ...form,
                        helperTextMain: "",
                        helperTextName: "",
                        errorName: false,
                      });
                    }}
                    style={{ width: "93%" }}
                    autoFocus
                  />{" "}
                </Grid>{" "}
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    id="username"
                    error={form.errorUser}
                    helperText={form.helperTextUserName}
                    label="Username"
                    value={form.username}
                    name={"username"}
                    onChange={changeHandler}
                    onBlur={handleUserNameBlur}
                    onFocus={() => {
                      setForm({
                        ...form,
                        helperTextMain: "",
                        helperTextUserName: "",
                        errorUser: false,
                      });
                    }}
                    style={{ width: "93%" }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    id="email"
                    label="Email"
                    name={"email"}
                    value={form.email}
                    error={form.errorEmail}
                    helperText={form.helperTextEmail}
                    onChange={changeHandler}
                    onBlur={handleEmailBlur}
                    onFocus={() => {
                      setForm({
                        ...form,
                        helperTextMain: "",
                        helperTextEmail: "",
                        errorEmail: false,
                      });
                    }}
                    style={{ width: "93%" }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    id="phonenumber"
                    label="Phone number"
                    name={"phoneNumber"}
                    value={form.phoneNumber}
                    inputProps={{ maxLength: 11 }}
                    error={form.errorPhoneNumber}
                    helperText={form.helperTextPhoneNumber}
                    onChange={changeHandler}
                    onBlur={handlePhoneNumberBlur}
                    onFocus={() => {
                      setForm({
                        ...form,
                        helperTextMain: "",
                        helperTextPhoneNumber: "",
                        errorPhoneNumber: false,
                      });
                    }}
                    style={{ width: "93%" }}
                  />
                </Grid>{" "}
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormControl style={{ width: "93%" }}>
                    <InputLabel
                      id="demo-simple-select-label"
                      variant="standard"
                    >
                      Town
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="town"
                      value={form.town}
                      onFocus={() => {
                        setForm({
                          ...form,
                          helperTextMain: "",
                        });
                      }}
                      onChange={changeHandler}
                    >
                      {list}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  {" "}
                  <FormControl style={{ width: "93%" }}>
                    <InputLabel htmlFor="standard-adornment-password">
                      Password
                    </InputLabel>
                    <Input
                      id="password"
                      name="password"
                      value={form.password}
                      type={form.showPassword ? "text" : "password"}
                      onFocus={() => {
                        setForm({
                          ...form,
                          helperTextMain: "",
                        });
                      }}
                      // error={form.errorPassword}
                      // helperText={form.helperTextPassword}
                      onChange={changeHandler}
                      // onBlur={handlePasswordBlur}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            style={{
                              color: "#008080",
                            }}
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {form.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </form>{" "}
          </div>
        </DialogContent>{" "}
        <DialogActions>
          {" "}
          <Grid
            container
            spacing={2}
            // align="right"
            justify="flex-start"
          >
            {" "}
            <Grid item xs={12} sm={12} md={12} lg={8}>
              <div className="boxhelper ">
                <Box
                  textAlign="left"
                  color="red"
                  fontWeight="500"
                  fontSize="14px"
                >
                  {form.helperTextMain}
                </Box>{" "}
              </div>
            </Grid>{" "}
          </Grid>{" "}
          <Button
            type="submit"
            className={classes.myButton}
            onClick={handleClick}
          >
            Submit
          </Button>{" "}
          <Backdrop className={classes.backdrop} open={loading}>
            <ImpulseSpinner size={90} color="#008081" loading={loading} />
          </Backdrop>
        </DialogActions>
      </Dialog>
    </div>
  );
}
