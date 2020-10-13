import PropTypes from "prop-types";

import React, { useState, useEffect } from "react";
import { Dialog, Paper, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";

import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import Box from "@material-ui/core/Box";
import SupervisorTable from "./SupervisorTable";

import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

export default function AssignmentDialog(props) {
  const { sel, dialogClose, save, open, token, role, data } = props;
  const [selected, setSelected] = React.useState([]);
  let store = require("store");

  const [userData, setUserData] = useState(store.get("userData"));

  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    console.log(newSelected);
  };

  const handleSaveClose = () => {
    selected.forEach(function (name) {
      if (data.length > 0) {
        var s = data
          .filter((obj) => obj != null)
          .find((obj) => obj.supervisorName.name === name);
        s.complaint.forEach(function (comp) {
          console.log(3, comp.id, s.supervisorName.supervisorId);
          UpdateAssignStatus(3, comp.id, s.supervisorName.supervisorId);
        });
      }
    });
  };

  const UpdateAssignStatus = (statusId, complainId, supervisorId) => {
    const data = {
      StatusId: statusId,
      id: complainId,
      supervisor: supervisorId,
    };

    axios
      .post("https://m2r31169.herokuapp.com/api/updateComplainStatus", data, {
        headers: {
          "x-access-token": token, //the token is a variable which holds the token
        },
      })
      .then((res) => {
        console.log("posted" + res.data);

        dialogClose();
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

        console.log("error" + err);
      });
  };

  useEffect(() => {
  }, []);
  return (
    role === "ADMIN" && (
      <Dialog
        fullWidth={true}
        open={open}
        onClose={dialogClose}
        maxWidth="sm"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>
          {" "}
          Do you want to assign the new unresolved complaints to the following
          supervisors ?
        </DialogTitle>
        <SupervisorTable
          data={data}
          handleClick={handleClick}
          selected={selected}
        />

        <DialogActions>
          <Button onClick={dialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSaveClose();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
}

AssignmentDialog.propTypes = {
  open: PropTypes.bool.isRequired,

  dialogClose: PropTypes.func.isRequired,
};

function Details(props) {
  return (
    <Box m={1} component="div">
      <Box fontWeight="700" component="div" fontSize="0.9rem" color="black">
        {props.title}
      </Box>
      <Box component="div" fontSize="0.8rem" color="grey" m={1}>
        {props.name}
      </Box>
    </Box>
  );
}
