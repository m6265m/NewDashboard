import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Box, Typography } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";

export default function UserTable(props) {
  const { id, status } = props;
  let store = require("store");
  const [userData, setUserData] = useState(store.get("userData"));
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  //const [feedback, setFeedback] = useState([]);

  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const useStyles = makeStyles({
    table: {
      minWidth: 250,
    },
  });

  const getUsers = () => {
    setError(false);
    let finalObj = [];
    let feedbackObj = [];
    axios
      .get(
        "https://m2r31169.herokuapp.com/api/userByComplainId?ComplainId=" + id
      )
      .then((res) => {

        if (res.data.Users[0].User != null) {
          for (var i in res.data.Users) {
            finalObj.push(res.data.Users[i]);
            //feedbackObj.push(res.data.Users[i].Feedbacks);
          }
          setUsers(finalObj);
          //setFeedbacks(feedbackObj);
        }
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
        console.log("error" + err);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      {error && <Box>Error fetching data </Box>}
      {users.length < 1 && <Box>There are no users of this complaint </Box>}
      {users.length > 0 && (
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">User Name</TableCell>
              <TableCell align="center">Phone Number</TableCell>
              <TableCell align="center">Email Address</TableCell>

              {status === "Resolved" && (
                <TableCell align="center">Feedback</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.User.name}>
                <TableCell align="center">{user.User.name}</TableCell>
                <TableCell align="center">{user.User.phoneNumber}</TableCell>
                <TableCell align="center">{user.User.email}</TableCell>
                {status === "Resolved" && (
                  <TableCell align="center">
                    {user.Feedbacks[0].Star ? (
                      <Box>
                        <Rating
                          name="read-only"
                          value={user.Feedbacks[0].Star.number}
                          readOnly
                        />
                        <Box>
                          {user.Feedbacks[0].description
                            ? user.Feedbacks[0].description
                            : user.Feedbacks[0].tag
                            ? user.Feedbacks[0].tag
                            : ""}
                        </Box>
                      </Box>
                    ) : (
                      "no feedback"
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
