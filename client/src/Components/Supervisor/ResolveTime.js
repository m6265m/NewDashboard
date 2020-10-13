import React, {useState, useEffect} from "react";
import axios from "axios";
import ChartistGraph from "react-chartist";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../../ComponentsCss/Supervisor.css";

let store = require("store");

let Chartist = require("chartist");

function ResolveTime(props) {
    const [resolveTime, setResolveTime] = useState({
        _0_2days: 70,
        _3_4days: 20,
        _5_6days: 5,
        moreThan6days: 5
    });

    const [loading, setLoading] = useState(true);
    const [resolveTimeCheck, setResolveTimeCheck] = useState(0);

    const [userData, setUserData] = useState(store.get("userData"));

    const headers = {};

    const handleLogoutAutomatically = () => {
        store.remove("userData");
        store.clearAll();
        setUserData({});
        window.location = "/";
    };

    useEffect(() => {
        axios
            .get(
                "https://m2r31169.herokuapp.com/api/getSupervisorResolveTime?id=" +
                props.superId,
                {
                    headers: {
                        "x-access-token": userData.accessToken, //the token is a variable which holds the token
                    },
                }
            )
            .then((res) => {
                if (
                    res.data._0_2days !== null &&
                    res.data._3_4days !== null &&
                    res.data._5_6days !== null &&
                    res.data.moreThan6days !== null
                ) {
                    setResolveTime(res.data);

                    setLoading(false);
                } else {
                    setResolveTimeCheck(1);
                    setResolveTime({
                        _0_2days: 0,
                        _3_4days: 0,
                        _5_6days: 0,
                        moreThan6days: 0
                    });
                    setLoading(false);
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
                        setLoading(false);
                        setResolveTimeCheck(1);
                        setResolveTime({
                            _0_2days: 0,
                            _3_4days: 0,
                            _5_6days: 0,
                            moreThan6days: 0
                        });
                        console.log(err.response.status);
                    }
                }
                setResolveTimeCheck(1);
                console.error(err);
            });
    }, []);

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
        <div className="resolve-mains">
            <Box
                style={{
                    borderBottom: "1px solid #99999957",
                }}
                textAlign="center"
                color="black"
                fontWeight="600"
                component="div"
                fontSize="18"
            >
                <p className="resolve-texts">Resolve Time Analysis</p>
            </Box>

            {resolveTimeCheck === 0 ? (
                <ChartistGraph
                    style={{display: loading ? "none" : "block"}}
                    data={piechart.data}
                    type="Pie"
                    options={piechart.options}
                    style={{padding: "10px"}}
                />
            ) : (
                <div
                    className="no-resolve-time-heading"
                    style={{display: loading ? "none" : "block"}}
                >
                    <p className="resolve-text">No Complain Resolved</p>
                </div>
            )}
            <CircularProgress
                style={{
                    display: loading ? "block" : "none",
                    color: "teal",
                    margin: " auto",
                }}
            />

            <div style={{textAlign: "center", borderTop: "1px solid #99999957"}}>
                {" "}
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

export default ResolveTime;
