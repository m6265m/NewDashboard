import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import ChartistGraph from "react-chartist";
import Box from "@material-ui/core/Box";

import { Grid, styled, FormControl, Select, MenuItem } from "@material-ui/core";
import "../../ComponentsCss/Supervisor.css";
let store = require("store");

let Chartist = require("chartist");

function ResolveTime() {
  const [resolveTime, setResolveTime] = useState({
    less: 70,
    medium: 20,
    high: 5,
    greaterThanTwentyFour: 5,
  });

  const [resolveTimeCheck, setResolveTimeCheck] = useState(0);

  const [userData, setUserData] = useState(store.get("userData"));

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

  useEffect(() => {
    axios
      .get("https://m2r31169.herokuapp.com/api/getresolveTime", {
        headers: headers,
      })
      .then((res) => {
        console.log("resolveTime coming", res.data);

        if (
          res.data._1_to_9 !== null &&
          res.data._10_to_16 !== null &&
          res.data._17_to_24 !== null &&
          res.data.geraterThan24 !== null
        ) {
          setResolveTime({
            less: res.data._1_to_9,
            medium: res.data._10_to_16,
            high: res.data._17_to_24,
            greaterThanTwentyFour: res.data.geraterThan24,
          });
        } else {
          setResolveTimeCheck(1);
          setResolveTime({
            less: 0,
            medium: 0,
            high: 0,
            greaterThanTwentyFour: 0,
          });
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
            console.log(err.response.status);
          }
        }
        console.error(err);
      });
  }, []);

  const piechart = {
    data: {
      series: [
        resolveTime.high,
        resolveTime.less,
        resolveTime.medium,
        resolveTime.greaterThanTwentyFour,
      ],
    },
    options: {
      labelInterpolationFnc: function (value) {
        if (value === 0) return "";
        else return value + "%";
      },
    },
  };

  return (
    <div className="resolve-mains">
      <div className="resolve-headings">
        <p className="resolve-texts">Resolve Time Analysis</p>

        <Box
          padding="none"
          textAlign="left"
          color="#43a047"
          fontWeight="bold"
          component="span"
          fontSize="3rem"
        >
          .
        </Box>
        <Box
          padding="none"
          textAlign="left"
          color="#008081"
          fontWeight="600"
          component="span"
          fontSize="0.75rem"
        >
          {" "}
          1 to 9 hours
        </Box>
        <Box
          padding="none"
          textAlign="left"
          color=" #f4c63d"
          fontWeight="bold"
          component="span"
          fontSize="3rem"
          marginLeft={1}
        >
          .
        </Box>
        <Box
          padding="none"
          textAlign="left"
          color="#008080"
          fontWeight="600"
          component="span"
          fontSize="0.75rem"
        >
          {" "}
          10 to 16 hours
        </Box>
        <Box
          padding="none"
          textAlign="left"
          color="#fb8c00"
          fontWeight="bold"
          component="span"
          fontSize="3rem"
          marginLeft={1}
        >
          .
        </Box>
        <Box
          padding="none"
          textAlign="left"
          color="#008080"
          fontWeight="600"
          component="span"
          fontSize="0.75rem"
        >
          {" "}
          17 to 24 hours
        </Box>

        <Box
          padding="none"
          textAlign="left"
          color="#FF0000"
          fontWeight="bold"
          component="span"
          fontSize="3rem"
          marginLeft={1}
        >
          .
        </Box>
        <Box
          padding="none"
          textAlign="left"
          color="#008080"
          fontWeight="600"
          component="span"
          fontSize="0.75rem"
        >
          {" "}
          more than 24 hours
        </Box>
      </div>

      {resolveTimeCheck === 0 ? (
        <ChartistGraph
          data={piechart.data}
          type="Pie"
          options={piechart.options}
          style={{ padding: "10px" }}
        />
      ) : (
        <div className="no-resolve-time-heading">
          <p className="resolve-text">Not available</p>
        </div>
      )}
    </div>
  );

  //   return (
  //     <div className="resolve-mains">
  //       <Grid container justify="center" alignItems="center">
  //         <Grid item xs={12} sm={12} md={6} lg={6}>
  //           {" "}
  //           <div className="resolve-headings">
  //             <p>Resolve Time Analysis</p>
  //             <Grid container justify="center" alignItems="center">
  //               <Grid item xs={12} sm={6} md={6} lg={6}>
  //                 {" "}
  //                 <Box
  //                   textAlign="left"
  //                   color="#43a047"
  //                   fontWeight="bold"
  //                   component="span"
  //                   fontSize="3rem"
  //                 >
  //                   .
  //                 </Box>
  //                 <Box
  //                   textAlign="left"
  //                   color="#008081"
  //                   fontWeight="600"
  //                   component="span"
  //                   fontSize="0.75rem"
  //                 >
  //                   {" "}
  //                   1 to 9 hours
  //                 </Box>
  //               </Grid>
  //               <Grid item xs={12} sm={6} md={6} lg={6}>
  //                 {" "}
  //                 <Box
  //                   textAlign="left"
  //                   color=" #f4c63d"
  //                   fontWeight="bold"
  //                   component="span"
  //                   fontSize="3rem"
  //                   marginLeft={1}
  //                 >
  //                   .
  //                 </Box>
  //                 <Box
  //                   textAlign="left"
  //                   color="#008080"
  //                   fontWeight="600"
  //                   component="span"
  //                   fontSize="0.75rem"
  //                 >
  //                   {" "}
  //                   10 to 16 hours
  //                 </Box>
  //               </Grid>
  //               <Grid item xs={12} sm={6} md={6} lg={6}>
  //                 {" "}
  //                 <Box
  //                   textAlign="left"
  //                   color="#fb8c00"
  //                   fontWeight="bold"
  //                   component="span"
  //                   fontSize="3rem"
  //                   marginLeft={1}
  //                 >
  //                   .
  //                 </Box>
  //                 <Box
  //                   textAlign="left"
  //                   color="#008080"
  //                   fontWeight="600"
  //                   component="span"
  //                   fontSize="0.75rem"
  //                 >
  //                   {" "}
  //                   17 to 24 hours
  //                 </Box>
  //               </Grid>
  //               <Grid item xs={12} sm={6} md={6} lg={6}>
  //                 {" "}
  //                 <Box
  //                   textAlign="left"
  //                   color="#FF0000"
  //                   fontWeight="bold"
  //                   component="span"
  //                   fontSize="3rem"
  //                   marginLeft={1}
  //                 >
  //                   .
  //                 </Box>
  //                 <Box
  //                   textAlign="left"
  //                   color="#008080"
  //                   fontWeight="600"
  //                   component="span"
  //                   fontSize="0.75rem"
  //                 >
  //                   {" "}
  //                   more than 24 hours
  //                 </Box>
  //               </Grid>
  //             </Grid>
  //           </div>
  //         </Grid>
  //         <Grid item xs={12} sm={12} md={6} lg={6}>
  //           {" "}
  //           {resolveTimeCheck === 0 ? (
  //             <ChartistGraph
  //               data={piechart.data}
  //               type="Pie"
  //               options={piechart.options}
  //               style={{ padding: "10px" }}
  //             />
  //           ) : (
  //             <div className="no-resolve-time-heading">
  //               <p className="resolve-text">Not available</p>
  //             </div>
  //           )}
  //         </Grid>
  //       </Grid>
  //     </div>
  //   );
}

export default ResolveTime;