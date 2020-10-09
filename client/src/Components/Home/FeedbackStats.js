import React, {useState, useEffect} from "react";
import axios from "axios";
import "../../ComponentsCss/FeedbackStats.css";
import ChartistGraph from "react-chartist";
import Box from "@material-ui/core/Box";

let store = require("store");

function FeedbackStats(props) {
    const [userData, setUserData] = useState(store.get("userData"));

    const headers = {
        "Content-Type": "application/json",
        "x-access-token": userData.accessToken,
    };

    const [checkFeedback, setCheckFeedback] = useState(0);

    const [feedback, setFeedback] = useState(
        {
            postive: 80,
            negative: 20,
            TotalCount: 0
        }
    );

    const handleLogoutAutomatically = () => {
        store.remove("userData");
        store.clearAll();
        setUserData({});
        window.location = "/";
    };

    useEffect(() => {
        axios
            .get("https://m2r31169.herokuapp.com/api/getFeedbacks", {
                headers: headers,
            })
            .then((res) => {

                if (
                    res.data.Feedback[0].postive !== null &&
                    res.data.Feedback[0].negative !== null
                )
                    setFeedback(res.data.Feedback[0]);
                else {
                    setCheckFeedback(1);
                    // setFeedback(
                    //     ...feedback,
                    //     positive: 0,
                    //     neg: 0,
                    // );
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
                        setCheckFeedback(1);

                    }
                }
                console.error(err);
            });
    }, [feedback]);

    // console.log("feedbacks coming", feedback);


    const piechart = {
        data: {
            series: [feedback.negative, feedback.postive],
        },
        options: {
            labelInterpolationFnc: function (value) {
                if (value === 0) return "";
                else return value + "%";
            },
        },
    };


    return (
        <div
            className={
                props.role === "ADMIN" ? "feedback-main" : "feedback-main-hidden"
            }
        >


            {checkFeedback === 0 ? (
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
            {/*<ChartistGraph*/}
            {/*  data={piechart.data}*/}
            {/*  type="Pie"*/}
            {/*  options={piechart.options}*/}
            {/*  style={{ padding: "10px" }}*/}
            {/*/>*/}

            <div className="feedback-heading">
                <p className="feedback-text">Feedback Summary</p>

                <div style={{display: 'flex', flexDirection: 'row'}}>


                    <div>

                        <Box
                            textAlign="left"
                            color="#43a047"
                            component="span"
                            fontWeight="bold"
                            fontSize="3rem"
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
                            Positive
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
                            Negative
                        </Box>

                    </div>

                    <div
                        style={{
                            marginLeft: 'auto',
                            marginRight: 2,
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            color: '#008080'
                        }}
                    >
                        <p style={{padding: 'none', marginTop: 14}}> Total Feedbacks : {feedback.TotalCount}</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default FeedbackStats;
