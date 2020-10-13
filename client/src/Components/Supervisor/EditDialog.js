import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogActions from "@material-ui/core/DialogActions";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { Scrollbars } from "react-custom-scrollbars";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import { IconButton } from "@material-ui/core";
import { ImpulseSpinner } from "react-spinners-kit";
import Backdrop from "@material-ui/core/Backdrop";
import axios from "axios";
import { useState, useEffect } from "react";
import "../../ComponentsCss/Complaints.css";
import "../../ComponentsCss/Supervisor.css";

let store = require("store");
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 1,
    color: "#fff",
  },
}));

export default function EditDialog(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(store.get("userData"));
  const [selectedIndex, setSelectedIndex] = React.useState(props.rowData.town);

  const handleListItemClick = (value) => {
    setSelectedIndex(value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };
  const handleUpdate = (_town) => {
    setLoading(true);
    const object = {
      supervisorId: props.rowData.supervisorId,
      town: _town,
    };
    axios
      .post("https://m2r31169.herokuapp.com/api/updateTown", object, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": userData.accessToken, //the token is a variable which holds the token
        },
      })
      .then(async (res) => {
        if (res.status === 200) {
          props.onUpdate(props.rowData, _town);
          setLoading(false);
          setOpen(false);
        }
      })
      .catch((err) => {
        if (err.response) {
          setLoading(false);
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          }
          if (err.response.status === 503 || err.response.status === 500) {
            console.log(err.response.status);
            alert("Something went wrong. Please try again later");
          }
        }
      });
  };

  return (
    <div>
      {" "}
      <IconButton
        onClick={handleClickOpen}
        style={{
          backgroundColor: "transparent",
        }}
      >
        <EditIcon
          style={{
            color: "#008080",
            fontSize: "20px",
            padding: 0,
            border: 0,
          }}
        />{" "}
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <Scrollbars style={{ minWidth: 300, minHeight: 400 }}>
          <Paper
            className="filter elevationPaper"
            fullWidth
            padding="none"
            className="detail"
            style={{
              textDecoration: "none",
              boxShadow: "0px 4px 8px -5px rgba(124,133,133,1)",
              borderBottom: "3px solid #008080",
            }}
          >
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
              Select Town
            </Box>{" "}
            <Box style={{ float: "right" }}>
              <IconButton
                onClick={handleClose}
                aria-label="close"
                style={{
                  padding: "0px",
                  marginRight: "7px",
                  backgroundColor: "transparent",
                }}
              >
                <CancelIcon style={{ color: "teal" }} />
              </IconButton>
            </Box>
          </Paper>
          <List component="nav" aria-label="main mailbox folders">
            {props.town.map((t) => (
              <ListItem
                style={{
                  // boxShadow: " 0 1px 4px 0 rgba(0, 0, 0, 0.19)",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.19)",
                }}
                button
                selected={selectedIndex === t}
                onClick={() => handleListItemClick(t)}
              >
                <ListItemText primary={t} />
              </ListItem>
            ))}
          </List>
          <DialogActions>
            <Button
              style={{
                display: loading ? "none" : "block",
              }}
              onClick={() => {
                handleUpdate(selectedIndex);
              }}
              color="primary"
            >
              Update
            </Button>{" "}
            <CircularProgress
              style={{ display: loading ? "block" : "none", color: "teal" }}
            />
          </DialogActions>{" "}
        </Scrollbars>{" "}
      </Dialog>
    </div>
  );
}
