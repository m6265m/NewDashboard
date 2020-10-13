import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SelectSupervisor(props) {
  const { name, value, changeValue, disable, token, display } = props;
  const classes = useStyles();

  const [hasError, setErrors] = useState(false);
  const [error, setError] = useState(false);
  let store = require("store");
  const [userData, setUserData] = useState(store.get("userData"));

  const [supervisor, setSupervisor] = useState([]);
  const [values, setValues] = useState("");
  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };
  const getStatus = () => {
    setError(false);
    let finalObj = [];
    // var finalObj1 = [];
    axios
      .get("https://m2r31169.herokuapp.com/api/getSuperVisor_Town", {
        headers: {
          "x-access-token": token, //the token is a variable which holds the token
        },
      })
      .then((res) => {
        for (var i in res.data.supervisors) {
          finalObj.push(res.data.supervisors[i]);
          // finalObj1.push(res.data.supervisors[i].town);
        }

        setSupervisor(finalObj);
        // setTown(finalObj1);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          } else if (
            err.response.status === 503 ||
            err.response.status === 500
          ) {
            setError(true);
            console.log(err.response.status);
          }
        }
        setErrors(err);
      });
  };

  useEffect(() => {
    setValues(value);
    getStatus();
  }, []);

  const handleChange = (event) => {
    setValues(event.target.value);
    changeValue(event.target.value);
  };

  return (
    <FormControl className={classes.formControl} style={{ display: display }}>
      <InputLabel id="demo-simple-select-outlined-label">{name}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={values}
        onChange={handleChange}
        label={name}
        disabled={disable}
      >
        {supervisor.map((Name, index) => (
          <MenuItem value={Name.supervisorId}>
            {Name.name} - {Name.town}
          </MenuItem>
        ))}
      </Select>
      <Box style={{ display: error ? "block" : "none" }}>
        {"Error loading data"}
      </Box>
    </FormControl>
  );
}

SelectSupervisor.propTypes = {
  name: PropTypes.string.isRequired,
  disable: PropTypes.bool.isRequired,

  changeValue: PropTypes.func.isRequired,
};
