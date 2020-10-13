import PropTypes from "prop-types";
import ComplaintDetails from "./ComplaintDetails";
import { Scrollbars } from "react-custom-scrollbars";

import React, { useState, useEffect } from "react";
import { Dialog, Paper, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Box from "@material-ui/core/Box";
import UserTable from "./UserTable";
import { Grid, styled, IconButton, Toolbar } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import ComplaintProgress from "./ComplaintProgress";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  toolbar: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  dialogPaper: {
    minHeight: "60vh !important",
    maxHeight: "80vh !important",
  },
}));

export default function ComplaintDialog(props) {
  const { sel, dialogClose, save, open, token, role, supervisors } = props;

  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };



  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      fullWidth={true}
      open={open}
      onClose={dialogClose}
      maxWidth="sm"
      aria-labelledby="form-dialog-title"
    >
      <Scrollbars style={{ minWidth: 100, minHeight: "80vh" }}>
        <AppBar position="static" color="default">
          {" "}
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Complaint Details" {...a11yProps(0)} />
            <Tab label="Progress" {...a11yProps(1)} />
            <Tab
              label={
                sel.statusType === "Resolved" ? "Users & Feedbacks" : "Users"
              }
              {...a11yProps(2)}
            />

            <IconButton
              style={{ top: 0 }}
              edge="start"
              color="inherit"
              onClick={dialogClose}
              aria-label="close"
            >
              <CancelIcon style={{ color: "teal" }} />
            </IconButton>
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <ComplaintDetails sel={sel} role={role} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <ComplaintProgress
              sel={sel}
              role={role}
              token={token}
              dialogClose={dialogClose}
              save={save}
              supervisors={supervisors}
            />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <UserTable id={sel.id} status={sel.statusType} />
          </TabPanel>
        </SwipeableViews>
      </Scrollbars>
    </Dialog>
  );
}

ComplaintDialog.propTypes = {
  sel: PropTypes.object.isRequired,

  open: PropTypes.bool.isRequired,
  save: PropTypes.func.isRequired,
  dialogClose: PropTypes.func.isRequired,
};
