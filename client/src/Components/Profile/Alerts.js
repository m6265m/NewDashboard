import React, { useEffect, useState } from "react";
import { makeStyles, lighten } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { ListSubheader, ListItemSecondaryAction, Box } from "@material-ui/core";
import { Scrollbars } from "react-custom-scrollbars";
import { Link } from "react-router-dom";
import Moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "99%",
    maxWidth: "50ch",
    backgroundColor: "theme.palette.background.paper",
  },
  inline: {
    display: "inline",
  },
}));

export default function Alerts(props) {
  const { data } = props;
  const classes = useStyles();

  const chooseColor = (status) => {
    return status === "Resolved" || status === "Verified"
      ? "#008081"
      : status === "Active" || status === "Assigned"
      ? "rgb(142, 36, 170)"
      : status === "Rejected"
      ? "#FFB400"
      : "#FF0000";
  };

  const [notif, setNotif] = useState([]);
  const [notifData, setNotifData] = useState([]);
  const [notifType, setNotifType] = useState([]);
  useEffect(() => {

    const dateFilter = data.filter((item) => {
      // console.log("notif", Moment(item.timeAndDate));
      // console.log("notif", Date());
      // console.log("notif", Moment("2019-6-19").isSame(new Date(), "week"));
      return Moment(item.timeAndDate).isSame(new Date(), "week");
    });
    setNotifData(dateFilter);
    const unique = [...new Set(dateFilter.map((item) => item.statusType))];
    setNotif(unique);
    const uniqueType = [
      ...new Set(dateFilter.map((item) => item.ComplaintType)),
    ];
    setNotifType(uniqueType);
  }, [data]);
  return (
    <List className={classes.root}>
      <ListSubheader style={{ textAlign: "center", color: "black" }}>
        {"Weekly Alerts"}
      </ListSubheader>
      {/* <ListItemAvatar>
            <Avatar alt="Resolved" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar> */}
      <Scrollbars style={{ minHeight: "300px" }}>
        {/* orignalData.filter((obj) => obj.statusType === "Resolved") .length */}
        {notif.length !== 0 ? (
          notifType.map((y) => {
            return notif.map((x) => {
              // console.log(
              //   "type in notif" + y,
              //   x,
              //   notifData.filter((obj) => obj.ComplaintType === y).length
              // );
              return (
                <AlertList
                  notification={x}
                  type={y}
                  number={
                    notifData.filter(
                      (obj) => obj.statusType === x && obj.ComplaintType === y
                    ).length
                  }
                  color={chooseColor(x)}
                />
              );
            });
          })
        ) : (
          <Box textAlign="center">
            {" "}
            <br /> <br />
            No new alerts
          </Box>
        )}
        {/* <AlertList title="Resolved" color="#008081" />
        <AlertList title="Rejected" color="#FFB400" />
        <AlertList title="Assigned" color="rgb(142, 36, 170)" /> */}
        {/* <Divider variant="outset" component="li" /> */}
      </Scrollbars>
    </List>
  );
}

function AlertList(props) {
  const { color, notification, number, type } = props;
  const classes = useStyles();

  return (
    number > 0 && (
      <Link
        to={{
          pathname: "/dashboard/complaints",
          statusFilter:
            notification === "Unresolved"
              ? null
              : notification === "Verified"
              ? "Resolved"
              : notification,
          typeFilter: type,
        }}
      >
        <ListItem
          alignItems="flex-start"
          className="alertList"
          style={{ background: lighten(color, 0.8), color: color }}
        >
          {/* <ListItemAvatar>
      <Avatar alt="Assigned" src="/static/images/avatar/3.jpg" />
    </ListItemAvatar> */}
          <ListItemText
            primary={
              <React.Fragment>
                <Box
                  component="span"
                  fontSize="0.9rem"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {notification === "Assigned"
                    ? "New Complaint Assigned"
                    : notification}
                </Box>

                <Box
                  component="span"
                  fontSize="0.6rem"
                  className={classes.inline}
                  color="gray"
                  style={{ float: "right" }}
                />
              </React.Fragment>
            }
            secondary={
              <Box
                component="span"
                fontSize="0.8rem"
                className={classes.inline}
                color="textPrimary"
              >
                {/* {"Complaint number " +
              notification.ComplainId +
              " assigned to " +
              notification.supervisor +
              " is " +
              notification.statusType +
              (notification.statusType == "Resolved"
                ? ". Click here to verify complaint"
                : notification.statusType == "Rejected"
                ? ". Click here to view reason of rejection"
                : "")} */}
                {notification !== "Assigned"
                  ? number +
                    " new Complaint" +
                    (number === 1 ? "" : "s") +
                    " of " +
                    type +
                    " have been " +
                    notification +
                    " this week. " +
                    (notification === "Resolved"
                      ? "Click here to verify complaint . "
                      : notification === "Rejected"
                      ? "Click here to view reason of rejection . "
                      : "")
                  : "You have been assigned " +
                    number +
                    " new compaint" +
                    (number === 1 ? "" : "s") +
                    " of " +
                    type}
              </Box>
            }
          />
        </ListItem>
      </Link>
    )
  );
}
