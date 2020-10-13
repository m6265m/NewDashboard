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
    minWidth: 180,
  },
}));

export default function Reason(props) {
  const { name, changeValue, display, value } = props;
  const classes = useStyles();
  let store = require("store");
  const [userData, setUserData] = useState(store.get("userData"));

  const [hasError, setErrors] = useState(false);
  const [error, setError] = useState(false);

  const [reasons, setReason] = useState([]);
  const [values, setValues] = useState(value);

  const getReasons = () => {
    setError(false);
    var finalObj = [];
    axios
      .get("https://m2r31169.herokuapp.com/api/getRejectTags")
      .then((res) => {
        for (var i in res.data.Reasons) {
          finalObj.push(res.data.Reasons[i]);
        }
        setReason(finalObj);
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
  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };
  useEffect(() => {
    setValues(value);
    getReasons();
  }, []);

  const handleChange = (event) => {
    setValues(event.target.value);
    changeValue(event.target.value);
  };

  return (
    <FormControl
      variant="outlined"
      className={classes.formControl}
      style={{ display: display }}
    >
      <InputLabel id="demo-simple-select-outlined-label">{name}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={values}
        onChange={handleChange}
        label={name}
      >
        {reasons.map((reason) => (
          <MenuItem key={reason} value={reason}>
            {reason}
          </MenuItem>
        ))}
      </Select>
      <Box style={{ display: error ? "block" : "none" }}>
        {"Error loading data"}
      </Box>
    </FormControl>
  );
}

Reason.propTypes = {
  name: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,

  changeValue: PropTypes.func.isRequired,
};
