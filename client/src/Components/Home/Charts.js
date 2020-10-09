import React, {useState, useEffect} from "react";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import ChartistGraph from "react-chartist";

let Chartist = require("chartist");
let store = require("store");

const styles = {
    stats: {
        paddingTop: "5px",

        color: "#999",
        display: "inline-flex",
        fontSize: "12px",
        lineHeight: "22px",
    },
    line: {
        marginTop: "10px",
        borderTop: "1px solid",
        borderTopColor: "#99999957",
    },
};

const useStyles = makeStyles(styles);

function Charts(props) {
    const classes = useStyles();

    const [userData, setUserData] = useState(store.get("userData"));

    const [checkCharts, setCheckCharts] = useState(0);


    const headers = {
        "Content-Type": "application/json",
        "x-access-token": userData.accessToken,
    };

    const [whichType, setWhichType] = useState({
        seriesYearly: [],
        seriesMonthly: [],
        seriesDaily: [],
    });

    const [highestValue, setHighestValue] = useState({
        highestValueDaily: 0,
        highestValueMonthly: 0,
        highestValueYearly: 0,
    });

    const handleLogoutAutomatically = () => {
        store.remove("userData");
        store.clearAll();
        setUserData({});
        window.location = "/";
    };

    const [allData, setData] = useState({
        labelForYearly: [],
        totalCountResultDaily: [],
        totalCountResultMonthly: [],
        totalCountResultYearly: [],
        resolvedResultDaily: [],
        resolvedResultMonthly: [],
        resolvedResultYearly: [],
        unresolvedResultDaily: [],
        unresolvedResultMonthly: [],
        unresolvedResultYearly: [],
        assignedResultDaily: [],
        assignedResultMonthly: [],
        assignedResultYearly: [],
        rejectedResultDaily: [],
        rejectedResultMonthly: [],
        rejectedResultYearly: [],
        activeResultDaily: [],
        activeResultMonthly: [],
        activeResultYearly: [],
    });

    useEffect(() => {
        if (userData.accessToken !== null) {
            axios
                .get(
                    "https://m2r31169.herokuapp.com/api/getComplaintsYearlyMonthlyDaily",
                    {
                        headers: headers,
                    }
                )
                .then((res) => {
                    setData({
                        totalCountResultDaily: res.data.daily.map((a) => a.totalCount),
                        totalCountResultMonthly: res.data.monthly.map((a) => a.totalCount),
                        totalCountResultYearly: res.data.yearly.map((a) => a.totalCount),
                        resolvedResultDaily: res.data.daily.map((a) => a.Resolved),
                        resolvedResultMonthly: res.data.monthly.map((a) => a.Resolved),
                        resolvedResultYearly: res.data.yearly.map((a) => a.Resolved),
                        unresolvedResultDaily: res.data.daily.map((a) => a.Unresolved),
                        unresolvedResultMonthly: res.data.monthly.map((a) => a.Unresolved),
                        unresolvedResultYearly: res.data.yearly.map((a) => a.Unresolved),
                        assignedResultDaily: res.data.daily.map((a) => a.Assigned),
                        assignedResultMonthly: res.data.monthly.map((a) => a.Assigned),
                        assignedResultYearly: res.data.yearly.map((a) => a.Assigned),
                        rejectedResultDaily: res.data.daily.map((a) => a.Rejected),
                        rejectedResultMonthly: res.data.monthly.map((a) => a.Rejected),
                        rejectedResultYearly: res.data.yearly.map((a) => a.Rejected),
                        activeResultDaily: res.data.daily.map((a) => a.Active),
                        activeResultMonthly: res.data.monthly.map((a) => a.Active),
                        activeResultYearly: res.data.yearly.map((a) => a.Active),
                        labelForYearly: res.data.yearly.map((a) => a.year),
                    });


                    // console.log("charts",res.data);
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status === 401 || err.response.status === 403) {
                            handleLogoutAutomatically();
                        } else if (
                            err.response.status === 503 ||
                            err.response.status === 500
                        ) {
                            setCheckCharts(1)
                        }
                    }
                    setCheckCharts(1)
                    console.error(err);
                });
        }
    }, []);


    // console.log("props from dropdown?" , props)

    useEffect(() => {
        if (props.value === "Total Complaints") {
            setWhichType({
                seriesDaily: allData.totalCountResultDaily,
                seriesMonthly: allData.totalCountResultMonthly,
                seriesYearly: allData.totalCountResultYearly,
            });

            setHighestValue({
                highestValueDaily:
                    Math.max.apply(null, allData.totalCountResultDaily) + 10,
                highestValueMonthly:
                    Math.max.apply(null, allData.totalCountResultMonthly) + 10,
                highestValueYearly:
                    Math.max.apply(null, allData.totalCountResultYearly) + 10,
            });
            // console.log("highest value is coming", highestValue.highestValueDaily);
        } else if (props.value === "Resolved") {
            setWhichType({
                seriesDaily: allData.resolvedResultDaily,
                seriesMonthly: allData.resolvedResultMonthly,
                seriesYearly: allData.resolvedResultYearly,
            });

            setHighestValue({
                highestValueDaily:
                    Math.max.apply(null, allData.resolvedResultDaily) + 10,
                highestValueMonthly:
                    Math.max.apply(null, allData.resolvedResultMonthly) + 10,
                highestValueYearly:
                    Math.max.apply(null, allData.resolvedResultYearly) + 10,
            });
        } else if (props.value === "Unresolved") {
            setWhichType({
                seriesDaily: allData.unresolvedResultDaily,
                seriesMonthly: allData.unresolvedResultMonthly,
                seriesYearly: allData.unresolvedResultYearly,
            });

            setHighestValue({
                highestValueDaily:
                    Math.max.apply(null, allData.unresolvedResultDaily) + 10,
                highestValueMonthly:
                    Math.max.apply(null, allData.unresolvedResultMonthly) + 10,
                highestValueYearly:
                    Math.max.apply(null, allData.unresolvedResultYearly) + 10,
            });
        } else if (props.value === "Assigned") {
            setWhichType({
                seriesDaily: allData.assignedResultDaily,
                seriesMonthly: allData.assignedResultMonthly,
                seriesYearly: allData.assignedResultYearly,
            });

            setHighestValue({
                highestValueDaily:
                    Math.max.apply(null, allData.assignedResultDaily) + 10,
                highestValueMonthly:
                    Math.max.apply(null, allData.assignedResultMonthly) + 10,
                highestValueYearly:
                    Math.max.apply(null, allData.assignedResultYearly) + 10,
            });
        } else if (props.value === "Rejected") {
            setWhichType({
                seriesDaily: allData.rejectedResultDaily,
                seriesMonthly: allData.rejectedResultMonthly,
                seriesYearly: allData.rejectedResultYearly,
            });

            setHighestValue({
                highestValueDaily:
                    Math.max.apply(null, allData.rejectedResultDaily) + 10,
                highestValueMonthly:
                    Math.max.apply(null, allData.rejectedResultMonthly) + 10,
                highestValueYearly:
                    Math.max.apply(null, allData.rejectedResultYearly) + 10,
            });
        } else if (props.value === "Active") {
            setWhichType({
                seriesDaily: allData.activeResultDaily,
                seriesMonthly: allData.activeResultMonthly,
                seriesYearly: allData.activeResultYearly,
            });

            setHighestValue({
                highestValueDaily:
                    Math.max.apply(null, allData.activeResultDaily) + 10,
                highestValueMonthly:
                    Math.max.apply(null, allData.activeResultMonthly) + 10,
                highestValueYearly:
                    Math.max.apply(null, allData.activeResultYearly) + 10,
            });
        }
    }, [props, allData]);

    let delays = 80,
        durations = 500;
    let delays2 = 80,
        durations2 = 500;
    let animated = 0;
    let animatedYearly = 0;
    let animatedMonthly = 0;


    // // // dailyComplaintsChart

    const dailyComplaintsChart = {
        data: {
            labels: ["M", "T", "W", "T", "F", "S", "S"],
            series: [whichType.seriesDaily],
        },
        options: {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0,
            }),
            low: 0,
            high: highestValue.highestValueDaily,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
        // for animation
        animation: {
            draw: function (data) {
                // if (animated <= whichType.seriesDaily.length) {
                    if (data.type === "line") {
                        data.element.animate({
                            d: {
                                begin: 600,
                                dur: 700,
                                from: data.path
                                    .clone()
                                    .scale(1, 0)
                                    .translate(0, data.chartRect.height())
                                    .stringify(),
                                to: data.path.clone().stringify(),
                                easing: Chartist.Svg.Easing.easeOutQuint,
                            },
                        });
                    } else if (data.type === "point") {
                        data.element.animate({
                            opacity: {
                                begin: (data.index + 1) * delays,
                                dur: durations,
                                from: 0,
                                to: 1,
                                easing: "ease",
                            },
                        });
                    }
                    // animated++;

                // }
            },
        },
    };
    // // // monthlyComplaintsChart

    const monthlyComplaintsChart = {
        data: {
            labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
            series: [whichType.seriesMonthly],
        },
        options: {
            axisX: {
                showGrid: true,
            },

            low: 0,
            high: highestValue.highestValueMonthly,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },

        responsiveOptions: [
            [
                "screen and (max-width: 640px)",
                {
                    seriesBarDistance: 5,
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        },
                    },
                },
            ],
        ],
        animation: {
            draw: function (data) {
                // if (animatedMonthly <= whichType.seriesMonthly.length) {

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
                //     animatedMonthly++
                // }
            },
        },
    };
    // // // yearlyComplaintsChart

    const yearlyComplaintsChart = {
        data: {
            labels: allData.labelForYearly,
            series: [whichType.seriesYearly],
        },
        options: {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10,
            }),
            low: 0,
            high: highestValue.highestValueYearly,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },

        animation: {
            draw: function (data) {
                // if (animatedYearly <= whichType.seriesYearly.length) {

                    if (data.type === "line") {
                        data.element.animate({
                            d: {
                                begin: 600,
                                dur: 700,
                                from: data.path
                                    .clone()
                                    .scale(1, 0)
                                    .translate(0, data.chartRect.height())
                                    .stringify(),
                                to: data.path.clone().stringify(),
                                easing: Chartist.Svg.Easing.easeOutQuint,
                            },
                        });
                    } else if (data.type === "point") {
                        data.element.animate({
                            opacity: {
                                begin: (data.index + 1) * delays,
                                dur: durations,
                                from: 0,
                                to: 1,
                                easing: "ease",
                            },
                        });
                    }
                //     animatedYearly++
                // }
            },
        },
    };


    return (
        <div className="graphs">
            <div className="daily-graph">

                {checkCharts === 0 ?
                    <ChartistGraph
                        className="ct-chart-background-daily-complaints"
                        data={dailyComplaintsChart.data}
                        type="Line"
                        options={dailyComplaintsChart.options}
                        listener={dailyComplaintsChart.animation}
                    /> :
                    <div className="no-resolve-time-heading">
                        <p className="resolve-text">Not available</p>
                    </div>
                }

                <div className={classes.line}>
                    <p>Daily Complaints</p>
                </div>
            </div>

            <div className="monthly-graph ">

                {checkCharts === 0 ?

                    <ChartistGraph
                        className="ct-chart-background-monthly-complaints ct-stroke-color1"
                        data={monthlyComplaintsChart.data}
                        type="Bar"
                        options={monthlyComplaintsChart.options}
                        responsiveOptions={monthlyComplaintsChart.responsiveOptions}
                        listener={monthlyComplaintsChart.animation}
                    />
                    :
                    <div className="no-resolve-time-heading">
                        <p className="resolve-text">Not available</p>
                    </div>
                }
                <div className={classes.line}>
                    <p>Monthly Complaints</p>
                </div>
            </div>

            <div className="yearly-graph">

                {checkCharts === 0 ?

                    <ChartistGraph
                        className="ct-chart-background-resolved-complaints"
                        data={yearlyComplaintsChart.data}
                        type="Line"
                        options={yearlyComplaintsChart.options}
                        listener={yearlyComplaintsChart.animation}
                    />

                    :
                    <div className="no-resolve-time-heading">
                        <p className="resolve-text">Not available</p>
                    </div>
                }

                <div className={classes.line}>
                    <p>Yearly Complaints</p>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Charts);
