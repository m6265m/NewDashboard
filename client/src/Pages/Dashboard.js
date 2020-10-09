import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "../Components/Menu";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import avatarImage from "../assets/images/admin.png";
import Home from "../Components/Home/Home";
import Complaints from "../Components/Complaint/Complaints";
import Supervisors from "../Components/Supervisor/Supervisors";
import Profile from "../Components/Profile/Profile";
import ManageComplaints from "../Components/ManageComplaints/ManageComplaints";
import Notification from "../Components/Notification";
import ErrorPage from "../Pages/Error";
import { Switch, Route, Redirect } from "react-router-dom";
import Moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Scrollbars } from "react-custom-scrollbars";
import GenerateReports from "../Components/Reports/GenerateReports";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AdminRoute from "../Components/Routes/AdminRoute";
import { messaging } from "../init-fcm";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

let store = require("store");

const styles = {
  root: {
    position: "relative",
  },
  myCard: {
    borderRadius: 20,
    background: "#f3f3f3",
    // boxShadow: '6px 6px 10px 0px rgba(112,112,112,0.16), -6px -6px 10px 0px #FFFFFF',
    padding: "10px 20px",
    minHeight: "89vh",
    minWidth: "70vw",
    marginRight: 17,
  },

  myAvatar: {
    marginLeft: "12px",
  },

  myToolbar: {
    color: "teal",
    minHeight: 20,
    display: "flex",
    justifyContent: "flex-end",
  },
  gridContainer: {
    width: "auto",
  },
  paper: {
    backgroundColor: "white",
    color: "teal",
    position: "absolute",
    marginTop: "5px",
    zIndex: 1200,
    right: "38px",
    height: "100%",
    maxHeight: 200,
    width: "100%",
    maxWidth: 300,
    overflow: "auto",
    padding: "10px",
  },
  notifDropdown: {
    display: "flex",
    backgroundColor: "#97DED0",
    marginBottom: "10px",
    height: "100%",
    maxHeight: 100,
    borderRadius: 9,
  },
  notifDropdownWithoutColor: {
    display: "flex",
    backgroundColor: "#F3F3F3",
    marginBottom: "10px",
    height: "100%",
    maxHeight: 100,
    borderRadius: 9,
  },
  hideNoNotif: {
    display: "none",
  },
  noNotifDropdown: {
    display: "flex",
    marginBottom: "10px",
    height: "100%",
    maxHeight: 70,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #97DED0",
  },

  timeClass: {
    flex: "1 1 auto",
    minWidth: 0,
    marginTop: "4px",
    marginLeft: "10px",
    marginRight: "10px",
  },
};

const useStyles = makeStyles(styles);

function Dashboard({ match }) {
  const [userData, setUserData] = useState(store.get("userData"));
  const [notifications, setNotifications] = useState({});
  const [dropdownNotifs, setDropDownNotifs] = useState([]);
  const [serverError, setServerError] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [image, setImage] = useState(null);
  const [open, setOpen] = React.useState(false);

  window.addEventListener("storage", function (e) {
    if (e.key === "logoutEvent") {
      window.location = "/";
      console.log("logout done");
    }
  });

  const handleServerError = (error) => {
    setServerError(error);
  };

  const classes = useStyles();

  const handleClick = (event) => {
    event.preventDefault();
    setOpen((prev) => !prev);
  };
  const handleClickAway = (event) => {
    setOpen(false);
  };

  const updateProfileImage = (imagePath) => {
    // console.log("here" + imagePath);
    setImage(imagePath);
  };
  useEffect(() => {
    setServerError(false);
    // console.log(window.location.pathname.split("/").pop(), "loccccc");
    // handleServerError("503");
  }, []);

  useEffect(() => {
    setImage(
      Object.keys(userData).length > 0 &&
        (userData.userData.image !== null ? userData.userData.image : null)
    );
  }, [userData]);

  const headers = {
    "Content-Type": "application/json",
    "x-access-token": userData.accessToken,
  };

  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const closeNotif = (
    event,
    notificationId,
    notificationStatus,
    complainId
  ) => {
    event.preventDefault();
    // console.log("notificationId", notificationStatus);
    // setOpen(false);
    // window.location = "/dashboard/complaints";

    if (notificationStatus) {
      //   window.location = "/dashboard/complaints";
      // console.log("notif was opened");
      // setOpen(false);
      window.location = `/dashboard/complaints?complainIdOpen=${complainId}`;
    } else {
      console.log("headers" + headers);
      axios
        .post(
          `https://m2r31169.herokuapp.com/api/dashboard/openNotification`,
          { notificationId },
          {
            headers: headers,
          }
        )
        .then((res) => {
          // console.log("notif wasnt opened", res.data);

          window.location = `/dashboard/complaints?complainIdOpen=${complainId}`;
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
              // handleServerError(err.response.status);
            }
          }

          console.error(err);
          console.log("not open");
        });
    }
  };

  // console.log(userData);
  function sentTokenToServer(Ntoken) {
    //console.log("userrrrrr?????", userData.accessToken);

    axios
      .post(
        `https://m2r31169.herokuapp.com/api/notificationToken`,
        {},
        {
          headers: headers,
          data: {
            token: Ntoken,
          },
        }
      )
      .then((res) => {
        // console.log(res);
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
            // handleServerError(err.response.status);
          }
        }
      });
  }

  useEffect(() => {
    messaging
      .requestPermission()
      .then(async function () {
        const token = await messaging.getToken();
        // console.log("token-->" + token);
        ///  sentTokenToServer(token);

        // console.log(
        //   "userrrrrr????? firebase ------  ",
        //   userData.accessToken
        // );
        // console.log(
        //   "proper????? accessToken =====    ",
        //   userData.accessToken
        // );
        if (userData.accessToken !== undefined) {
          sentTokenToServer(token);
        }
      })
      .catch(function (err) {
        if (err.response) {
          if (err.response.status === 401) {
            handleLogoutAutomatically();
          } else if (
            err.response.status === 503 ||
            err.response.status === 500
          ) {
            console.log(err.response.status);
            // handleServerError(err.response.status);
          }
        }
        console.log("Unable to get permission to notify.", err);
      });
    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(function () {
      messaging
        .getToken()
        .then(function (refreshedToken) {
          console.log("Token refreshed.");
          if (userData.accessToken !== undefined) {
            sentTokenToServer(refreshedToken);
          }
          // Indicate that the new Instance ID token has not yet been sent to the
          // app server.
          // setTokenSentToServer(false);
          // // Send Instance ID token to app server.
          // sendTokenToServer(refreshedToken);
          // ...
        })
        .catch(function (err) {
          if (err.response) {
            if (err.response.status === 401 || err.response.status === 403) {
              handleLogoutAutomatically();
            } else if (
              err.response.status === 503 ||
              err.response.status === 500
            ) {
              console.log(err.response.status);
              // handleServerError(err.response.status);
            }
          }
          console.log("Unable to retrieve refreshed token ", err);
          //    showToken("Unable to retrieve refreshed token ", err);
        });
    });

    navigator.serviceWorker.addEventListener("message", (message) =>
      console.log(message)
    );
  }, [userData.accessToken]);

  // console.log(match.path);

  let dropdownNotifications = [];
  useEffect(() => {
    if (userData.accessToken !== null) {
      console.log("headers" + JSON.stringify(headers));
      axios
        .get("https://m2r31169.herokuapp.com/api/dashboard/getNotifications", {
          headers: headers,
        })
        .then((res) => {
          // console.log("status??", res.status);

          // console.log("dropdown notifs??", res.data);
          for (let i in res.data.notifications)
            dropdownNotifications[i] = res.data.notifications[i];

          setDropDownNotifs(dropdownNotifications);
          setNotifCount(res.data.count);

          // console.log("what is coming???????", dropdownNotifs);
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401 || err.response.status === 403) {
              handleLogoutAutomatically();
            } else if (
              err.response.status === 503 ||
              err.response.status === 500
            ) {
              console.log("error header" + err.response.status);
              handleServerError(err.response.status);
            }
          }
          console.error(err);

          console.log("not getting notifs");
        });
    }
  }, [userData.accessToken, notifications]);

  messaging.onMessage((payload) => {
    console.log("Message received!!! payload. ", payload);

    payload !== null ? setNotifications(payload) : setNotifications({});
    console.log(payload.data.title);
  });

  const timeBox = (props) => {
    let difference = props;
    const secondsInMilli = 1000;
    const minutesInMilli = secondsInMilli * 60;
    const hoursInMilli = minutesInMilli * 60;
    const daysInMilli = hoursInMilli * 24;
    const elapsedDays = difference / daysInMilli;
    difference = difference % daysInMilli;
    const elapsedHours = difference / hoursInMilli;
    difference = difference % hoursInMilli;
    const elapsedMinutes = difference / minutesInMilli;
    difference = difference % minutesInMilli;
    const elapsedSeconds = difference / secondsInMilli;

    if (elapsedDays > 365)
      return (
        <ListItemText
          className={classes.timeClass}
          secondary={Math.round(elapsedDays / 365).toString() + "yr"}
        />
      );
    if (elapsedDays >= 7)
      return (
        <ListItemText
          className={classes.timeClass}
          secondary={Math.round(elapsedDays / 7).toString() + "w"}
        />
      );
    if (elapsedDays >= 1)
      return (
        <ListItemText
          className={classes.timeClass}
          secondary={Math.round(elapsedDays).toString() + "d"}
        />
      );
    else if (elapsedHours >= 1)
      return (
        <ListItemText
          className={classes.timeClass}
          secondary={Math.round(elapsedHours).toString() + "h"}
        />
      );
    else if (elapsedMinutes >= 1)
      return (
        <ListItemText
          className={classes.timeClass}
          secondary={Math.round(elapsedMinutes).toString() + "m"}
        />
      );
    else
      return (
        <ListItemText
          className={classes.timeClass}
          secondary={Math.round(elapsedSeconds).toString() + "s"}
        />
      );
  };

  //new grid
  {
    if (!serverError) {
      return (
        <div className="dashboard-grid">
          {Object.keys(notifications).length > 0 && (
            <Notification key={notifications.length} value={notifications} />
          )}

          <div className="menu-view">
            <Menu
              role={userData.Role}
              // selected={window.location.pathname.split("/").pop()}
            />
          </div>
          <div className="card-view-grid">
            <div className="top-bar">
              <ClickAwayListener onClickAway={handleClickAway}>
                <div>
                  <IconButton
                    aria-label="show 17 new notifications"
                    color="inherit"
                    onClick={handleClick}
                  >
                    <Badge badgeContent={notifCount} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <Paper elevation={4} className={classes.paper} hidden={!open}>
                    {/*<div*/}
                    {/*  className={*/}
                    {/*    notifCount === 0*/}
                    {/*      ? classes.noNotifDropdown*/}
                    {/*      : classes.hideNoNotif*/}
                    {/*  }*/}
                    {/*>*/}
                    {/*  <p>No new notifications</p>*/}
                    {/*</div>*/}

                    {dropdownNotifs.map((obj) => {
                      return (
                        <div
                          className={
                            obj.notificationStatus
                              ? classes.notifDropdownWithoutColor
                              : classes.notifDropdown
                          }
                        >
                          {/*<Link*/}
                          {/*  to={{*/}
                          {/*    pathname: "/dashboard/complaints",*/}
                          {/*    complainIdOpen: obj.ComplainId,*/}
                          {/*  }}*/}
                          {/*  */}
                          {/*>*/}

                          <ListItem
                            style={{ padding: "0.5em" }}
                            button={true}
                            // onClick={(e) => closeNotif(e, obj.notificationId, obj.notificationStatus)}
                            onClick={(e) =>
                              closeNotif(
                                e,
                                obj.notificationId,
                                obj.notificationStatus,
                                obj.ComplainId
                              )
                            }
                          >
                            <ListItemAvatar>
                              <Avatar alt="C" src={obj.complainImage} />
                            </ListItemAvatar>

                            <ListItemText
                              style={{ maxWidth: "212px" }}
                              primary={"Complaint" + " " + obj.statusType}
                              secondary={
                                userData.Role === "ADMIN"
                                  ? "Complaint #" +
                                    obj.ComplainId +
                                    " " +
                                    "is" +
                                    " " +
                                    obj.statusType.toLowerCase() +
                                    " " +
                                    "by" +
                                    " " +
                                    obj.supervisor
                                  : obj.statusType === "Verified"
                                  ? "Complaint #" +
                                    obj.ComplainId +
                                    " " +
                                    "has been" +
                                    " " +
                                    "marked as" +
                                    " " +
                                    obj.statusType.toLowerCase()
                                  : "Complaint #" +
                                    obj.ComplainId +
                                    " " +
                                    "has been" +
                                    " " +
                                    obj.statusType.toLowerCase() +
                                    " " +
                                    "to you"
                              }
                            />

                            {timeBox(Moment().diff(Moment(obj.timeAndDate)))}
                          </ListItem>
                          {/*</Link>*/}
                        </div>
                      );
                    })}
                  </Paper>
                </div>
              </ClickAwayListener>

              <Avatar
                className={classes.myAvatar}
                key={image}
                src={image != null ? image : avatarImage}
              />
              <p key={userData.length} className="username-padding">
                {" "}
                {Object.keys(userData).length > 0 &&
                userData.userData.username.length > 0
                  ? userData.userData.username
                  : "dummy123"}
              </p>
            </div>
            <div className="content">
              <Scrollbars style={{ minWidth: 100, minHeight: 370 }}>
                <Switch>
                  <Route
                    path={`${match.path}/`}
                    exact
                    render={() => <Redirect to="/dashboard/home" />}
                  />
                  {/* {/<Route path={"/"} exact component={Dashboard} />/}
                        {/<Route path={`${match.path}/home`} exact component={Home} />/} */}

                  <Route
                    path={`${match.path}/home`}
                    exact
                    render={(props) => (
                      <Home
                        {...props}
                        handleError={handleServerError}
                        notifs={notifications}
                      />
                    )}
                  />

                  {/*<Route*/}
                  {/*    path={`${match.path}/home`}*/}
                  {/*    exact*/}
                  {/*    render={() => (<Home/>)}*/}
                  {/*/>*/}

                  <Route
                    path={`${match.path}/complaints`}
                    exact
                    render={(props) => (
                      <Complaints {...props} handleError={handleServerError} />
                    )}
                  />
                  <AdminRoute
                    path={`${match.path}/supervisors`}
                    exact
                    component={Supervisors}
                    role={userData.Role}
                    handleError={handleServerError}
                  />
                  <Route
                    path={`${match.path}/reports`}
                    exact
                    render={() => (
                      <GenerateReports
                        handleError={handleServerError}
                        notifs={notifications}
                      />
                    )}
                  />
                  <Route
                    path={`${match.path}/profile`}
                    exact
                    render={() => (
                      <Profile
                        key={dropdownNotifs.length}
                        notification={dropdownNotifs}
                        updateProfileImage={updateProfileImage}
                      />
                    )}
                  />
                  {/* <Route
                    path={`${match.path}/employees`}
                    exact
                    component={Employees}
                  /> */}
                  <AdminRoute
                    path={`${match.path}/manage`}
                    exact
                    component={ManageComplaints}
                    role={userData.Role}
                    handleError={handleServerError}
                  />
                </Switch>
              </Scrollbars>
            </div>
          </div>
        </div>
      );
    } else {
      return <ErrorPage code={serverError} />;
    }
  }
}

export default Dashboard;
