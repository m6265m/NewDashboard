import React, {useState, useEffect} from "react";
import axios from "axios";
import ChartistGraph from "react-chartist";
import "../../ComponentsCss/ZoneStats.css";
import Box from "@material-ui/core/Box";

let Chartist = require("chartist");
let store = require("store");

function ZoneStats() {
    const [userData, setUserData] = useState(store.get("userData"));
    const [zoneCheck, setZoneCheck] = useState(0)

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

    const [allData, setData] = useState({
        LabelsState: [],
        SeriesResolvedState: [],
        SeriesUnresolvedState: [],
        SeriesAssignedState: [],
        HighestCountState: [],
    });

    let Labels = [];
    let SeriesResolved = [];
    let SeriesUnresolved = [];
    let SeriesAssigned = [];
    let finalHighestCount = [];

    useEffect(() => {
        if (userData.accessToken !== null) {
            axios
                .get("https://m2r31169.herokuapp.com/api/getTownWiseComplaints", {
                    headers: headers,
                })
                .then((res) => {
                    // console.log("towns coming", res.data);

                    for (let i in res.data) {
                        Labels[i] = res.data[i].Town;
                        SeriesResolved[i] = res.data[i].Resolved;
                        SeriesUnresolved[i] = res.data[i].Unresolved;
                        SeriesAssigned[i] = res.data[i].Assigned;
                        finalHighestCount[i] = res.data[i].highestCount;
                    }

                    setData({
                        LabelsState: Labels,
                        SeriesResolvedState: SeriesResolved,
                        SeriesAssignedState: SeriesAssigned,
                        SeriesUnresolvedState: SeriesUnresolved,
                        HighestCountState: finalHighestCount,
                    });

                    // console.log("final labels", Labels);
                    // console.log("highestcount!!", finalHighestCount);
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status === 401 || err.response.status === 403) {
                            handleLogoutAutomatically();
                        } else if (
                            err.response.status === 503 ||
                            err.response.status === 500
                        ) {
                            setZoneCheck(1)
                        }
                    }

                    console.error(err);
                });
        }
        // console.log("HIGH!!", Math.max.apply(null, allData.HighestCountState));
    }, [allData]);

    let delays2 = 80,
        durations2 = 500;
    let animated = 0;


    // // //  zone wise complaints chart

    const demoChart = {
        data: {
            labels: allData.LabelsState,
            series: [
                allData.SeriesResolvedState,
                allData.SeriesAssignedState,
                allData.SeriesUnresolvedState,
            ],

            // series: userData.Role === "ADMIN" ?
            //
            //
            //     [allData.SeriesResolvedState,
            //         allData.SeriesAssignedState,
            //         allData.SeriesUnresolvedState]
            //     :
            //     [allData.SeriesResolvedState]

        },
        options: {
            axisX: {
                showGrid: true,
            },
            stackBars: true,
            seriesBarDistance: 9,
            low: 0,
            high: Math.max.apply(null, allData.HighestCountState) + 100,
            height: 400,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
        responsiveOptions: [
            [
                "screen and (min-width: 350px)",
                {
                    stackBars: true,
                    reverseData: true,
                    horizontalBars: true,
                    seriesBarDistance: 9,

                    axisX: {
                        labelInterpolationFnc: Chartist.noop,
                    },
                    axisY: {
                        offset: 60,
                    },
                },
            ],

            [
                "screen and (min-width: 800px)",
                {
                    stackBars: false,

                    // seriesBarDistance: 10
                },
            ],
            // Options override for media > 1000px
            [
                "screen and (min-width: 1000px)",
                {
                    reverseData: false,
                    horizontalBars: false,

                    // seriesBarDistance: 15
                },
            ],
        ],
        animation: {
            draw: function (data) {
                if (animated <= allData.LabelsState.length) {

                    if (data.type === "bar") {
                        data.element.animate({
                            opacity: {
                                begin: (data.index + 1) * delays2,
                                dur: durations2,
                                from: 0,
                                to: 1,
                                easing: "ease",
                            },
                        });
                    }
                    animated++
                }
            },
        },
    };

    return (
        <div className="zone-main">

            {zoneCheck === 0 ?
                <ChartistGraph
                    className="ct-chart-background-demo-charts ct-stroke-color2"
                    data={demoChart.data}
                    type="Bar"
                    options={demoChart.options}
                    responsiveOptions={demoChart.responsiveOptions}
                    listener={demoChart.animation}
                />
                :

                <div className="no-resolve-time-heading">
                    <p className="resolve-text">Not available</p>
                </div>
            }


            <div className="zone-heading">
                <p className="zone-text">
                    Town Wise Complaints
                </p>
            </div>

            <Box
                textAlign="left"
                color="#02FCFA"
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
                Resolved
            </Box>
            <Box
                textAlign="left"
                color=" #008081"
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
                Assigned
            </Box>
            <Box
                textAlign="left"
                color="#042338"
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
                Unresolved
            </Box>
        </div>
    );
}

export default ZoneStats;
