import React, { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { lighten, withStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import { Grid, styled } from "@material-ui/core";
import Box from "@material-ui/core/Box";

const AssignedLinearProgress = withStyles({
  root: {
    borderRadius: 20,
    height: 10,
    backgroundColor: lighten("rgb(142, 36, 170)", 0.75),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "rgb(142, 36, 170)",
  },
})(LinearProgress);
const RejectedLinearProgress = withStyles({
  root: {
    borderRadius: 20,
    height: 10,
    backgroundColor: lighten("rgb(251, 140, 0)", 0.75),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "rgb(251, 140, 0)",
  },
})(LinearProgress);
const ResolvedLinearProgress = withStyles({
  root: {
    borderRadius: 20,
    height: 10,
    backgroundColor: lighten("#008081", 0.75),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#008081",
  },
})(LinearProgress);
const UnresolvedLinearProgress = withStyles({
  root: {
    borderRadius: 20,
    height: 10,
    backgroundColor: lighten("#FF0000", 0.75),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#FF0000",
  },
})(LinearProgress);

const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what the font-size on the html element is.
    htmlFontSize: 28,
  },
});

export default function Visualize(props) {
  const [percentage, setPercentage] = useState({});

  //const classes = useStyles();
  async function percentages() {
    let perObj = {};
    perObj["resolved"] = (props.resolved * 100) / props.total;
    perObj["unresolved"] = (props.unresolved * 100) / props.total;
    perObj["rejected"] = (props.rejected * 100) / props.total;
    perObj["assigned"] = (props.assigned * 100) / props.total;
    setPercentage(perObj);
  }
  useEffect(() => {
    percentages();
  }, [props]);
  return (
    <Paper className="visualize elevationPaper">
      <Box
        textAlign="left"
        color="#008080"
        fontWeight="600"
        component="div"
        fontSize="18"
      >
        Total Complaints
      </Box>
      <Box component="div" className="name">
        Resolved Complaints
      </Box>
      <Grid container className="bar">
        <Grid item xs={12} sm={12} md={12}>
          <ResolvedLinearProgress
            // className={classes.margin}
            variant="determinate"
            display="inline"
            value={Object.keys(percentage).length > 0 ? percentage.resolved : 0}
          />
        </Grid>
        <Grid item xs={12} md={12} sm={12} className="value">
          <Box fontFamily="Monospace" component="span" fontSize="0.6rem">
            {props.resolved} / {props.total}
          </Box>
        </Grid>
      </Grid>

      <Box className="name">Unresolved Complaints</Box>
      <Grid container className="bar">
        <Grid item xs={12} md={12} sm={12} m={12}>
          <UnresolvedLinearProgress
            //  className={classes.margin}
            variant="determinate"
            value={
              Object.keys(percentage).length > 0 ? percentage.unresolved : 0
            }
          />
        </Grid>
        <Grid item xs={12} md={12} sm={12} className="value">
          <Box fontFamily="Monospace" component="span" fontSize="0.6rem">
            {props.unresolved} / {props.total}
          </Box>
        </Grid>
      </Grid>
      <Box className="name">Rejected Complaints</Box>
      <Grid container className="bar">
        <Grid item xs={12} md={12} sm={12} m={0}>
          <RejectedLinearProgress
            //className={classes.margin}
            variant="determinate"
            value={Object.keys(percentage).length > 0 ? percentage.rejected : 0}
          />
        </Grid>
        <Grid item xs={12} md={12} sm={12} className="value">
          <Box fontFamily="Monospace" component="span" fontSize="0.6rem">
            {props.rejected} / {props.total}
          </Box>
        </Grid>
      </Grid>

      <Box className="name">Assigned Complaints</Box>
      <Grid container className="bar">
        <Grid item xs={12} md={12} sm={12} m={0}>
          <AssignedLinearProgress
            // className={classes.margin}
            variant="determinate"
            value={Object.keys(percentage).length > 0 ? percentage.assigned : 0}
          />
        </Grid>
        <Grid item xs={12} md={12} sm={12} className="value">
          {" "}
          <Box fontFamily="Monospace" component="span" fontSize="0.6rem">
            {props.assigned} / {props.total}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
