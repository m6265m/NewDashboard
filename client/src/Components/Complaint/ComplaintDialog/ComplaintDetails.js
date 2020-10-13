import Moment from "moment";
import React, { useState, useEffect } from "react";
import axios from "axios";

import Details from "./Details";
import { Box, Paper, Grid, DialogActions, Button } from "@material-ui/core";
import Status from "../Status";

export default function ComplaintDetails(props) {
  const { sel, role } = props;

  const [location, setLocation] = React.useState(
    "Your geolocation will be shown here"
  );

  //location api

  useEffect(() => {
    getLocation(sel.longitude, sel.latitude);
  }, []);
  const getLocation = (long, lat) => {
    const key = "64cbb3fee6954e";

    axios
      .get(
        "https://us1.locationiq.com/v1/reverse.php?key=" +
          key +
          "&lat=" +
          lat +
          "&lon=" +
          long +
          "&format=json"
      )
      .then((res) => {
        setLocation(res.data.display_name);
      })
      .catch((err) => console.log("Error in reverse" + err));
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Details title="Complaint Id" name={sel.id} />

        <Details title="Description" name={sel.description} />
        <Details title="Location" name={location} />

        <Details
          title="Date"
          name={Moment(sel.date).format("DD-MM-YYYY hh:mm A")}
        />
        <Details title="Complaint Type" name={sel.type} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Details
          title="Complaint Status"
          display={
            role === "SUPERVISOR" ||
            sel.statusType === "Resolved" ||
            sel.statusType === "Rejected"
              ? "block"
              : "none"
          }
        />
        <Status
          name={sel.statusType}
          buttonComp="div"
          display={
            role === "SUPERVISOR" ||
            sel.statusType === "Resolved" ||
            sel.statusType === "Rejected"
              ? "flex"
              : "none"
          }
        />

        <Box
          fontWeight="700"
          component="div"
          fontSize="0.9rem"
          color="black"
          m={1}
        >
          Complaint Image - Before
        </Box>

        <Paper className="image">
          <img
            className="complainImage"
            height="250px"
            alt="Error Loading Image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src={sel.image}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
