import React, {useState, useEffect} from "react";
import axios from "axios";
import ChartistGraph from "react-chartist";
import Box from "@material-ui/core/Box";
import "../../ComponentsCss/resolveTimeAnalysis.css";

let store = require("store");


function ResolveTimeAnalysisStats() {
    const [resolveTime, setResolveTime] = useState({
        _0_2days: 70,
        _3_4days: 20,
        _5_6days: 5,
        moreThan6days: 5
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
                // console.log("resolveTime coming", res.data);

                if (
                    res.data._0_2days !== null &&
                    res.data._3_4days !== null &&
                    res.data._5_6days !== null &&
                    res.data.moreThan6days !== null
                ) {
                    setResolveTime(res.data);
                } else {
                    setResolveTimeCheck(1);
                    setResolveTime({
                        _0_2days: 0,
                        _3_4days: 0,
                        _5_6days: 0,
                        moreThan6days: 0
                    });
                }
            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        handleLogoutAutomatically();
                    } else if (
                        err.response.status === 503 ||
                        err.response.status === 500 ||
                        err.response.status === 400
                    ) {
                        setResolveTimeCheck(1);

                    }
                }
                setResolveTimeCheck(1);
                console.error(err);
            });
    }, [resolveTime]);

    const piechart = {
        data: {
            series: [
                resolveTime._5_6days,
                resolveTime._0_2days,
                resolveTime._3_4days,
                resolveTime.moreThan6days,
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
        <div className="resolve-main">
            {resolveTimeCheck === 0 ? (
                <ChartistGraph
                    data={piechart.data}
                    type="Pie"
                    options={piechart.options}
                    style={{padding: "10px"}}
                />
            ) : (
                <div className="no-resolve-time-heading">
                    <p className="resolve-text">Not available</p>
                </div>
            )}

            <div className="resolve-heading">
                <p className="resolve-text">Resolve Time Analysis</p>

                <Box
                    textAlign="left"
                    color="#43a047"
                    fontWeight="bold"
                    component="span"
                    fontSize="3rem"
                >
                    .
                </Box>
                <Box
                    textAlign="left"
                    color="#008081"
                    fontWeight="600"
                    component="span"
                    fontSize="0.75rem"
                >
                    {" "}
                    2 days
                </Box>
                <Box
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
                    textAlign="left"
                    color="#008080"
                    fontWeight="600"
                    component="span"
                    fontSize="0.75rem"
                >
                    {" "}
                    4 days
                </Box>
                <Box
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
                    textAlign="left"
                    color="#008080"
                    fontWeight="600"
                    component="span"
                    fontSize="0.75rem"
                >
                    {" "}
                    6 days
                </Box>

                <Box
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
                    textAlign="left"
                    color="#008080"
                    fontWeight="600"
                    component="span"
                    fontSize="0.75rem"
                >
                    {" "}
                    more than 6 days
                </Box>
            </div>
        </div>
    );
}

export default ResolveTimeAnalysisStats;
