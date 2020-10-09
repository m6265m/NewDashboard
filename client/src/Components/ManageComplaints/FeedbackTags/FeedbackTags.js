import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  Button,
  TextField,
  Box,
  TableBody,
  ListItemText,
  ListItemSecondaryAction,
  Table,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Tab,
  ListItem,
} from "@material-ui/core";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import Rating from "@material-ui/lab/Rating";
import Stars from "./Stars";
import DeleteIcon from "@material-ui/icons/Delete";
import { ImpulseSpinner } from "react-spinners-kit";
import Backdrop from "@material-ui/core/Backdrop";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
    Width: window.innerWidth,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function FeedbackTags(props) {
  const { token, loading } = props;

  const classes = useStyles();
  let store = require("store");
  const [userData, setUserData] = useState(store.get("userData"));

  const [allTags, setAllTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const deleteTag = (it) => {
    console.log("iteemmmmmmmmmmmmm" + it);
    axios
      .post(
        "https://m2r31169.herokuapp.com/api/deleteFeedbackTag",
        { tagId: it },
        {
          headers: {
            "x-access-token": token, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        console.log("post hogayi" + res.data);
        getTags();
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
        console.log("error agaya" + err);
      });
  };
  const AddTag = () => {
    console.log("iteemmmmmmmmmmmmm" + newTag, allTags.includes(newTag));
    if (allTags.some((e) => e.tags === newTag)) {
      alert("The tag is already been added");
      setNewTag("");
    } else {
      axios
        .post(
          "https://m2r31169.herokuapp.com/api/addFeedbackTag",
          { tag: newTag },
          {
            headers: {
              "x-access-token": token, //the token is a variable which holds the token
            },
          }
        )
        .then((res) => {
          console.log("post hogayi" + res.data);
          getTags();
          setNewTag("");
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
          console.log("error agaya" + err);
        });
    }
  };
  const getTags = () => {
    loading(true);
    var finalObj = [];
    axios
      .get("https://m2r31169.herokuapp.com/api/feedbackAssociatedStars", {
        headers: {
          "x-access-token": token, //the token is a variable which holds the token
        },
      })
      .then((res) => {
        loading(false);
        console.log("agyaa" + JSON.stringify(res.data));
        for (var i in res.data) {
          finalObj.push(res.data[i]);
        }
        console.log("Reasonssssss" + finalObj.toString());
        setAllTags(finalObj);
      })
      .catch((err) => {
        loading(false);
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          } else if (
            err.response.status === 503 ||
            err.response.status === 500
          ) {
            console.log(err.response.status);
            props.handleError(err.response.status);
          }
        }
        console.log("error agaya" + err);
      });

    //   .catch((err) => setErrors(err));
  };
  // const handleDelete = (chipToDelete) => () => {
  //   setChipData((chips) =>
  //     chips.filter((chip) => chip.key !== chipToDelete.key)
  //   );
  // };
  useEffect(() => {
    getTags();
  }, []);

  return (
    <div>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className="tableRow">
            <TableCell align="center">Tag</TableCell>
            <TableCell align="center">Ratings</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="tableBody">
          {allTags.map((item) => {
            console.log("ag", item);
            return (
              <TableRow className="tableRow">
                <TableCell align="center">
                  {item.tags}

                  {/* <Box component="fieldset" borderColor="transparent">
                    <Rating name="read-only" value={item.number} readOnly />
                  </Box> */}
                </TableCell>
                <TableCell align="center">
                  <Stars token={token} item={item} save={() => getTags()} />
                </TableCell>
                <TableCell align="right">
                  <Button
                    color="primary"
                    onClick={() => {
                      deleteTag(item.id);
                    }}
                  >
                    {window.innerWidth > 500 ? " Delete" : <DeleteIcon />}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <List>
        <ListItem>
          {/* <TableCell align="center"> */}
          <TextField
            variant="outlined"
            placeholder="Enter new Tag"
            id="standard-required"
            value={newTag}
            style={{ width: window.innerWidth > 500 ? "70%" : "100" }}
            onChange={(event) => {
              setNewTag(event.target.value);
            }}
          />
          <ListItemSecondaryAction>
            {window.innerWidth > 500 ? (
              <Button
                variant="contained"
                style={{
                  background: "teal",
                  border: 0,
                  color: "white",

                  textDecoration: "none",
                }}
                onClick={() => {
                  AddTag();
                }}
              >
                {"Add Tag"}{" "}
              </Button>
            ) : (
              <AddCircleOutlineRoundedIcon
                style={{
                  color: "#008080",
                  fontSize: "40px",
                  padding: 0,
                  border: 0,
                }}
                onClick={() => {
                  AddTag();
                }}
              />
            )}
          </ListItemSecondaryAction>
          {/* </TableCell> */}
        </ListItem>
      </List>
    </div>
  );
}
