import React, {useState, useEffect, useRef} from "react";
import "../../assets/css/reportsCss.css";
import "../../ComponentsCss/GenerateReports.css";
import PdfMakeTable from "./PdfMakeTable";
import TextField from "@material-ui/core/TextField";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Paper from "@material-ui/core/Paper";
import Moment from "moment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import Backdrop from "@material-ui/core/Backdrop";
import {ImpulseSpinner} from "react-spinners-kit";

// const ref = React.createRef();
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import FormLabel from "@material-ui/core/FormLabel";

let store = require("store");

const styles = {
    button: {
        marginTop: 20,
        marginRight: 20,
    },
    actionsContainer: {
        marginBottom: 20,
    },
    resetContainer: {
        padding: 20,
    },

    stepperBg: {
        backgroundColor: "transparent",
    },

    step: {
        color: "#008080",
    },
    backdrop: {
        zIndex: 1,
        color: "#fff",
    },
};

const useStyles = makeStyles(styles);

function GenerateReports(props) {
    const classes = useStyles();

    const renderCount = useRef(0)
    const [userData, setUserData] = useState(store.get("userData"));
    const [none, setNone] = useState(false)
    const [noComplaintsFound, setNoComplaintsFound] = useState(false);
    const [nextButtonState, setNextButtonState] = useState(false);
    const [loading, setLoading] = useState(true);
    const [firstDate, setFirstDate] = useState(null);
    const [lastDate, setLastDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [oneDate, setOneDate] = useState(null);
    const [enableToDatePicker, setEnableToDatePicker] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [nextButton, setNextButton] = useState(true);
    const [typeCheckboxCount, setTypeCheckboxCount] = useState(0);
    const [typeValue, setTypeValue] = useState([]);
    const [townsCheckboxCount, setTownsCheckboxCount] = useState(0);
    const [townsValue, setTownsValue] = useState([]);
    const [supervisorCheckboxCount, setSupervisorCheckboxCount] = useState(0);
    const [supervisorValue, setSupervisorValue] = useState([]);
    const [mainData, setMainData] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [radioValue, setRadioValue] = useState("one");
    const [hideOne, setHideOne] = useState(false);
    const [radioValueStepTwo, setRadioValueStepTwo] = useState("complaintType");
    const [radioValueSupervisor, setRadioValueSupervisor] = useState("unresolved");
    const [reportDescription, setReportDescription] = useState("");
    const [sortedData, setSortedData] = useState([]);
    const [hideType, setHideType] = useState(false);
    const [hideTown, setHideTown] = useState(false);
    const [hideSupervisor, setHideSupervisor] = useState(false);
    const [hideStepper, setHideStepper] = useState(false)

    const [reportObject, setReportObject] = useState({
        numberOfRows: 0,
        dateRadioValue: "",
        dateFrom: "",
        dateTo: "",
        dateOne: "",
        sortRadioValue: "",
        description: "",
        complaints: [],
        role: ''
    });

    // const exportPDF = () => {
    //      resume.save();
    //  }

    // const exportPDF = () => {
    //     html2canvas(document.querySelector("#capture")).then(canvas => {
    //         document.body.appendChild(canvas);  // if you want see your screenshot in body.
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf =  jsPDF();
    //         pdf.addImage(imgData, 'PNG', 0, 0);
    //         pdf.save("report.pdf");
    //     });
    // }

    const headers = {
        "Content-Type": "application/json",
        "x-access-token": userData.accessToken,
    };

    const getComplaints = () => {
        let datesObj = [];
        let mainObj = [];

        axios
            .get(
                `https://m2r31169.herokuapp.com/api/getComplaints`,

                {
                    headers: headers,
                }
            )
            .then((res) => {
                // console.log("complaints coming!", res.data);
                console.log(res.data)

                if (res.data[0].complain.id === "" ){
                    setLoading(false)
                    setHideStepper(true)
                    console.log("no data")
                }

                else {

                    if (res.data.length === 1){
                        setNone(true)
                    }
                    else
                        setNone(false)


                    for (let i in res.data) {
                        datesObj[i] = res.data[i].complain.createdAt;

                        let tmpObj = {};
                        tmpObj["id"] = res.data[i].complain.id;
                        tmpObj["description"] = res.data[i].complain.description;
                        tmpObj["longitude"] = res.data[i].complain.Location.longitude;
                        tmpObj["latitude"] = res.data[i].complain.Location.latitude;
                        tmpObj["image"] = res.data[i].complain.image;
                        tmpObj["afterImage"] = res.data[i].complain.resolvedComplaintImage;
                        tmpObj["statusType"] = res.data[i].complain.Status.statusType;
                        tmpObj["statusId"] = res.data[i].complain.Status.id;
                        tmpObj["date"] = Moment(res.data[i].complain.createdAt).format();
                        tmpObj["town"] = res.data[i].complain.Location.town.name;
                        tmpObj["priority"] =
                            res.data[i].complain.noOfRequests > 5
                                ? "high"
                                : res.data[i].complain.noOfRequests > 1
                                ? "medium"
                                : "low";

                        tmpObj["reason"] =
                            res.data[i].complain.Status.statusType === "Rejected"
                                ? res.data[i].complain.reasonForRejection
                                : "";
                        tmpObj["requests"] = res.data[i].complain.noOfRequests;

                        tmpObj["type"] = res.data[i].complain.ComplaintType.typeName;
                        tmpObj["supervisorId"] = res.data[i].complain.assignedTo;

                        tmpObj["supervisorName"] =
                            res.data[i].complain.User && res.data[i].complain.User.name;
                        tmpObj["otherStatus"] = res.data[i].supervisorStatus
                            ? res.data[i].supervisorStatus
                            : res.data[i].adminStatus;
                        mainObj.push(tmpObj);

                    }

                    // console.log("what data is coming of complaints?", mainObj);
                    // console.log("dates", datesObj);
                    setFirstDate(datesObj[0]);
                    setLastDate(datesObj[datesObj.length - 1]);
                    setToDate(lastDate);


                    setMainData(mainObj);
                    setReportData(mainObj);
                    setLoading(false);
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
                        setLoading(false);
                        props.handleError(err.response.status);
                    }
                    setLoading(false);
                    console.log("CORS error.")
                    props.handleError(err.response.status);
                }

            });
    };


    useEffect(() => {
        getComplaints();

    }, [userData,props.notifs]);

    // useEffect(() => {
    //     if (reportData.length === 0) {
    //         setNone(true)
    //     } else setNone(false)
    // }, [reportData])

    const handleLogoutAutomatically = () => {
        store.remove("userData");
        store.clearAll();
        setUserData({});
        window.location = "/";
    };

    const steps = getSteps();

    function getSteps() {
        return [
            "Select the dates",
            "Choose how you want to sort the complaints",
            "Report Description",
            "Generate your report",
        ];
    }

    function getStepContent(stepIndex) {

        switch (stepIndex) {
            case 0:
                return (
                    <div>
                        <p>
                            You can choose to generate a one day report or multiple days
                            report.
                        </p>

                        <RadioGroup
                            row
                            aria-label="position"
                            name="position"
                            defaultValue={radioValue}
                            onChange={handleRadioChange}

                        >
                            <FormControlLabel
                                value="one"
                                control={<Radio color="primary"/>}
                                label="One day"
                                labelPlacement="end"
                                // disabled={none}
                            />
                            <FormControlLabel
                                value="multiple"
                                control={<Radio color="primary"/>}
                                label="Multiple Days"
                                labelPlacement="end"
                                disabled={none}
                            />
                        </RadioGroup>

                        {hideOne ? (
                            <div>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        defaultValue="20 Jul 2020"
                                        id="date-picker-dialog-from"
                                        label="From"
                                        format="dd MMM yyyy"
                                        error={false}
                                        disabled={none}
                                        minDate={firstDate}
                                        maxDate={Moment(lastDate).add(-1, "days")}
                                        value={fromDate}
                                        onChange={handleFromDateChange}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                        }}
                                        TextFieldComponent={TextFieldComponent}
                                    />
                                </MuiPickersUtilsProvider>

                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="date-picker-dialog-to"
                                        label="To"
                                        error={false}
                                        format="dd MMM yyyy"
                                        minDate={Moment(fromDate).add(1, "days")}
                                        maxDate={lastDate}
                                        value={toDate}
                                        disabled={enableToDatePicker}
                                        onChange={handleToDateChange}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                        }}
                                        TextFieldComponent={TextFieldComponent}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                        ) : (
                            <div>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        defaultValue="20 Jul 2020"
                                        id="date-picker-dialog-one"
                                        label="Select Date"
                                        format="dd MMM yyyy"
                                        error={false}
                                        minDate={firstDate}
                                        maxDate={lastDate}
                                        value={oneDate}
                                        onChange={handleOneDateChange}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                        }}
                                        TextFieldComponent={TextFieldComponent}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                        )}
                    </div>
                );
            case 1:
                return (
                    <div>
                        {userData.Role === "ADMIN" ? (
                            <div>
                                <RadioGroup
                                    row
                                    aria-label="position"
                                    name="position"
                                    defaultValue={radioValueStepTwo}
                                    onChange={handleRadioChangeStepTwo}
                                >
                                    <FormControlLabel
                                        value="complaintType"
                                        control={<Radio color="primary"/>}
                                        label="Type Wise"
                                        labelPlacement="end"
                                    />
                                    {/*<FormControlLabel*/}
                                    {/*    value="towns"*/}
                                    {/*    control={<Radio color="primary"/>}*/}
                                    {/*    label="Town Wise"*/}
                                    {/*    labelPlacement="end"*/}
                                    {/*/>*/}

                                    <FormControlLabel
                                        value="supervisors"
                                        control={<Radio color="primary"/>}
                                        label="Supervisor Wise"
                                        labelPlacement="end"
                                    />
                                </RadioGroup>

                                {hideType === true && (
                                    <FormControl component="fieldset">
                                        <FormGroup aria-label="position" column>
                                            {sortedData.map((obj, index) => {
                                                return (
                                                    <FormControlLabel
                                                        value="type"
                                                        control={<Checkbox color="primary"/>}
                                                        label={obj}
                                                        name={obj}
                                                        onChange={(event) =>
                                                            handleTypeCheckboxChange(event, index)
                                                        }
                                                        labelPlacement="end"
                                                    />
                                                );
                                            })}
                                        </FormGroup>
                                    </FormControl>
                                )}

                                {/*{hideTown === true && (*/}
                                {/*    <FormControl component="fieldset">*/}
                                {/*        <FormGroup aria-label="position" column>*/}
                                {/*            {sortedData.map((obj) => {*/}
                                {/*                return (*/}
                                {/*                    <FormControlLabel*/}
                                {/*                        value="town"*/}
                                {/*                        control={<Checkbox color="primary"/>}*/}
                                {/*                        onChange={handleTownsCheckboxChange}*/}
                                {/*                        label={obj}*/}
                                {/*                        name={obj}*/}
                                {/*                        labelPlacement="end"*/}
                                {/*                    />*/}
                                {/*                );*/}
                                {/*            })}*/}
                                {/*        </FormGroup>*/}
                                {/*    </FormControl>*/}
                                {/*)}*/}

                                {hideSupervisor === true && (
                                    <FormControl component="fieldset">
                                        <FormGroup aria-label="position" column>
                                            {sortedData.map((obj) => {
                                                return (
                                                    <FormControlLabel
                                                        value="supervisor"
                                                        control={<Checkbox color="primary"/>}
                                                        onChange={handleSupervisorsCheckboxChange}
                                                        label={obj}
                                                        name={obj}
                                                        labelPlacement="end"
                                                    />
                                                );
                                            })}
                                        </FormGroup>
                                    </FormControl>
                                )}
                            </div>
                        ) : (
                            <div>
                                <RadioGroup
                                    column
                                    aria-label="position"
                                    name="position"
                                    defaultValue={radioValueSupervisor}
                                    onChange={handleRadioChangeSupervisor}
                                >
                                    <FormControlLabel
                                        value="unresolved"
                                        control={<Radio color="primary"/>}
                                        label="Unresolved"
                                        labelPlacement="end"
                                    />
                                    <FormControlLabel
                                        value="active"
                                        control={<Radio color="primary"/>}
                                        label="Active"
                                        labelPlacement="end"
                                    />

                                    <FormControlLabel
                                        value="resolved"
                                        control={<Radio color="primary"/>}
                                        label="Resolved"
                                        labelPlacement="end"
                                    />
                                </RadioGroup>
                            </div>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div>
                        <p>Please provide a brief description of your report.</p>
                        <TextField
                            id="outlined-multiline-static"
                            multiline
                            value={reportDescription}
                            rows="4"
                            fullWidth={true}
                            defaultValue="Description"
                            variant="outlined"
                            onChange={handleDescriptionChange}
                        />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <p>Click on the button to generate your report.</p>

                        {/*<button className='report-pdf-button' onClick={exportPDF}>Download PDF</button>*/}
                    </div>
                );
            default:
                return "Unknown stepIndex";
        }
    }

    const handleDescriptionChange = (event) => {
        // setNextButton(true);
        setReportDescription(event.target.value);
        if (event.target.value === "") {
            setNextButton(true);
        } else setNextButton(false);
    };

    const handleRadioChange = (event) => {

        setRadioValue(event.target.value);
        setOneDate(null);
        setFromDate(null);
        setToDate(null);
        setHideOne((prev) => !prev);

        if (event.target.value === "one") {
            oneDate === null ? setNextButton(true) : setNextButton(false);
        } else if (event.target.value === "multiple") {
            fromDate === null || toDate === null
                ? setNextButton(true)
                : setNextButton(false);
        }
    };

    const handleRadioChangeStepTwo = (event) => {
        setRadioValueStepTwo(event.target.value);
        setTypeValue([]);
        // setTownsValue([])
        setSupervisorValue([]);
        setTypeCheckboxCount(0);
        // setTownsCheckboxCount(0)
        setSupervisorCheckboxCount(0);

        if (event.target.value === "complaintType") {
            typeCheckboxCount === 0 ? setNextButton(true) : setNextButton(false);
        } else if (event.target.value === "supervisors")
            supervisorCheckboxCount === 0
                ? setNextButton(true)
                : setNextButton(false);
        // if (event.target.value === "complaintType") {
        //     typeCheckboxCount === 0 ? setNextButton(true) : setNextButton(false);
        // } else if (event.target.value === "towns") {
        //     townsCheckboxCount === 0 ? setNextButton(true) : setNextButton(false);
        // } else if (event.target.value === "supervisors")
        //     supervisorCheckboxCount === 0 ? setNextButton(true) : setNextButton(false);
    };

    const handleRadioChangeSupervisor = (event) => {
        setRadioValueSupervisor(event.target.value);
        setReportData(rawData);

    };

    useEffect(() => {
        if (radioValueStepTwo === "complaintType") {
            setHideType(true);
            setHideTown(false);
            setHideSupervisor(false);
        }
            // else if (radioValueStepTwo === "towns") {
            //     setHideType(false);
            //     setHideTown(true);
            //     setHideSupervisor(false);
        // }
        else if (radioValueStepTwo === "supervisors") {
            setHideType(false);
            setHideTown(false);
            setHideSupervisor(true);
        }
    }, [radioValueStepTwo]);

    const handleTypeCheckboxChange = (event, index) => {

        if (event.target.checked) {
            setTypeCheckboxCount((prevState) => prevState + 1);

            setTypeValue([...typeValue, event.target.name]);
        } else {
            setTypeCheckboxCount((prevState) => prevState - 1);

            setTypeValue(typeValue.filter((v) => v !== event.target.name));
        }

    };


    // const handleTownsCheckboxChange = (event) => {
    //     // setTownsValue([event.target.name])
    //
    //
    //     if (event.target.checked) {
    //         setTownsCheckboxCount(prevState => prevState + 1)
    //         setTownsValue([...townsValue, event.target.name])
    //     } else {
    //         setTownsCheckboxCount(prevState => prevState - 1)
    //         setTownsValue(
    //             townsValue.filter( v => v !== event.target.name)
    //         )
    //
    //
    //     }
    // }

    const handleSupervisorsCheckboxChange = (event) => {

        if (event.target.checked) {
            setSupervisorCheckboxCount((prevState) => prevState + 1);
            setSupervisorValue([...supervisorValue, event.target.name]);
        } else {
            setSupervisorCheckboxCount((prevState) => prevState - 1);
            setSupervisorValue(
                supervisorValue.filter((v) => v !== event.target.name)
            );
        }
    };


    useEffect(() => {
        if (userData.Role === "ADMIN") {
            if (typeCheckboxCount === 0 && activeStep === 1) {
                setNextButton(true);
            } else if (typeCheckboxCount !== 0 && activeStep === 1)
                setNextButton(false);
        }
    }, [typeCheckboxCount, activeStep]);

    // useEffect(() => {
    //         if(userData.Role === 'ADMIN'){
    //     if (townsCheckboxCount === 0 && activeStep === 1) {
    //         setNextButton(true)
    //     } else if (townsCheckboxCount !== 0 && activeStep === 1)
    //         setNextButton(false)
    //
    //}
    // }, [townsCheckboxCount, activeStep])

    useEffect(() => {
        if (userData.Role === "ADMIN") {
            if (supervisorCheckboxCount === 0 && activeStep === 1) {
                setNextButton(true);
            } else if (supervisorCheckboxCount !== 0 && activeStep === 1)
                setNextButton(false);
        }
    }, [supervisorCheckboxCount, activeStep]);

    const handleOneDateChange = (date) => {
        setOneDate(date);
        setNextButton(false);
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
        setEnableToDatePicker(false);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
        setNextButton(false);
    };

    // useEffect(() => {
    //     if (oneDate !== null) {
    //         setReportData(
    //             mainData.filter((obj) => {
    //                 // console.log("db date : ",Moment(obj.date).format("DD MMM yyyy"))
    //
    //                 // const format = 'llll'
    //                 //
    //                 // return Moment(obj.date, format).unix() >= Moment(oneDate, format).unix()
    //                 console.log("db date :", Moment(obj.date).format().substr(0, 10));
    //                 console.log(
    //                     "selected onDate :",
    //                     Moment(oneDate).format().substr(0, 10)
    //                 );
    //                 // return new Date(obj.date.substring(0, 14)).getTime() === oneDate.getTime()
    //                 return (
    //                     Moment(obj.date).format().substr(0, 10) ===
    //                     Moment(oneDate).format().substr(0, 10)
    //                 );
    //             })
    //         );
    //
    //         // console.log("selected oneDate use effect : ",Moment(oneDate).format("DD MMM yyyy") )
    //     }
    // }, [oneDate]);

    // useEffect(() => {
    //     if (fromDate !== null && toDate !== null) {
    //         setReportData(
    //             mainData.filter((obj) => {
    //                 // console.log("db date : ",Moment(obj.date).format("DD MMM yyyy"))
    //
    //                 // return Moment(obj.date).format("DD MMM yyyy") >= Moment(fromDate).format("DD MMM yyyy") && Moment(obj.date).format("DD MMM yyyy") <= Moment(toDate).format("DD MMM yyyy")
    //                 return (
    //                     new Date(obj.date.substring(0, 19)).getTime() >=
    //                     fromDate.getTime() &&
    //                     new Date(obj.date.substring(0, 19)).getTime() <= toDate.getTime()
    //                 );
    //             })
    //         );
    //
    //         console.log("from and to date: ", fromDate + toDate);
    //     }
    // }, [toDate]);

    useEffect(() => {
        renderCount.current = renderCount.current + 1
    })

    useEffect(() => {
        if (renderCount.current >= 10) {
            if (reportData.length === 0) {
                setNoComplaintsFound(true)
            } else {
                setNoComplaintsFound(false)
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                if (activeStep === 1)
                    setNextButton(true)

            }
        }


    }, [nextButtonState])

    function handleNext(index) {

        setNextButtonState(prev => !prev)
        switch (index) {
            case 0:
                if (radioValue === "one") {
                    if (oneDate !== null) {
                        setReportData(
                            mainData.filter((obj) => {
                                // console.log(
                                //     "db date :",
                                //     Moment(obj.date).format().substr(0, 10)
                                // );
                                // console.log(
                                //     "selected onDate :",
                                //     Moment(oneDate).format().substr(0, 10)
                                // );

                                return (
                                    Moment(obj.date).format().substr(0, 10) ===
                                    Moment(oneDate).format().substr(0, 10)
                                )
                            })
                        )

                        setRawData(
                            mainData.filter((obj) => {

                                // console.log(
                                //     "db date :",
                                //     Moment(obj.date).format().substr(0, 10)
                                // );
                                // console.log(
                                //     "selected onDate :",
                                //     Moment(oneDate).format().substr(0, 10)
                                // );

                                return (
                                    Moment(obj.date).format().substr(0, 10) ===
                                    Moment(oneDate).format().substr(0, 10)
                                );
                            })
                        );
                    }
                } else {
                    if (fromDate !== null && toDate !== null) {
                        setReportData(
                            mainData.filter((obj) => {
                                return (
                                    new Date(obj.date.substring(0, 19)).getTime() >=
                                    new Date(
                                        fromDate.getFullYear(),
                                        fromDate.getMonth(),
                                        fromDate.getDate(),
                                        0,
                                        0,
                                        0
                                    ).getTime() &&
                                    new Date(obj.date.substring(0, 19)).getTime() <=
                                    new Date(
                                        toDate.getFullYear(),
                                        toDate.getMonth(),
                                        toDate.getDate(),
                                        23,
                                        59,
                                        0
                                    ).getTime()
                                );
                            })
                        );

                        setRawData(
                            mainData.filter((obj) => {
                                return (
                                    new Date(obj.date.substring(0, 19)).getTime() >=
                                    fromDate.getTime() &&
                                    new Date(obj.date.substring(0, 19)).getTime() <=
                                    toDate.getTime()
                                );
                            })
                        );
                    }
                }


                setTypeCheckboxCount(0);
                setTownsCheckboxCount(0);
                setSupervisorCheckboxCount(0);

                break;
            case 1:
                if (userData.Role === "ADMIN") {
                    if (radioValueStepTwo === "complaintType") {
                        if (typeCheckboxCount !== 0) {
                            setReportData(
                                reportData.filter((obj) => typeValue.includes(obj.type))
                            );
                        }
                    }
                        // else if(radioValueStepTwo === 'towns'){
                        //     if (townsCheckboxCount !== 0){
                        //         setReportData(
                        //             reportData.filter( (obj) => townsValue.includes(obj.town))
                        //         )
                        //     }
                    // }
                    else {
                        if (supervisorCheckboxCount !== 0) {
                            setReportData(
                                reportData.filter((obj) =>
                                    supervisorValue.includes(obj.supervisorName)
                                )
                            );
                        }
                    }
                } else {
                    if (radioValueSupervisor === "unresolved") {
                        setReportData(
                            reportData.filter((obj) => obj.statusType === "Unresolved")
                        );
                    } else if (radioValueSupervisor === "active") {
                        setReportData(
                            reportData.filter((obj) => obj.statusType === "Active")
                        );
                    } else if (radioValueSupervisor === "resolved") {
                        setReportData(
                            reportData.filter((obj) => obj.statusType === "Resolved")
                        );
                    }
                }


                break;
            case 2:
                setReportObject({
                    numberOfRows: reportData.length,
                    dateRadioValue: radioValue,
                    dateFrom: fromDate,
                    dateTo: toDate,
                    dateOne: oneDate,
                    sortRadioValue: radioValueStepTwo,
                    description: reportDescription,
                    complaints: reportData,
                    role: userData.Role
                });
                // setActiveStep((prevActiveStep) => prevActiveStep + 1);
                break;
            case 3:
                _exportPdfTable();
                break;
            default:
                return null;
        }
    }

    // console.log("New report data", reportData);

    useEffect(() => {
        if (radioValueStepTwo === "complaintType") {
            setSortedData(
                reportData
                    .map((obj, index) => obj.type)
                    .filter(
                        (type, index) =>
                            reportData.map((obj, index) => obj.type).indexOf(type) === index
                    )
            );
        }
            // else if (radioValueStepTwo === "towns") {
            //     setSortedData(
            //         reportData
            //             .map((obj, index) => obj.town)
            //             .filter(
            //                 (town, index) =>
            //                     reportData.map((obj, index) => obj.town).indexOf(town) === index
            //             )
            //     );
        // }
        else if (radioValueStepTwo === "supervisors") {
            setSortedData(
                reportData
                    .map((obj, index) => obj.supervisorName)
                    .filter(
                        (supervisorName, index) =>
                            reportData
                                .map((obj, index) => obj.supervisorName)
                                .indexOf(supervisorName) === index
                    )
            );
        }
    }, [reportData, radioValueStepTwo]);


    const handleBack = (index) => {
        switch (index) {
            case 1:
                // setHideOne(false)
                setReportData(mainData);
                setNextButton(false);
                break;
            case 2:
                setReportData(rawData);
                setNextButton(false);
                break;
            case 3:
                setNextButton(false);
                break;
            default:
                return null;
        }
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setReportData(mainData)
        setFromDate(null)
        setToDate(null)
        setOneDate(null)
        setReportDescription("")
        setNextButton(true)
    };

    const TextFieldComponent = (props) => {
        return <TextField {...props} disabled={true}/>;
    };
    const [pageSize, setPageSize] = React.useState("A4");


    const handlePageSize = (event) => {
        setPageSize(event.target.value);

        if (pageSize === "A4") {
        } else if (pageSize === "Letter") {
        }
    };

    const _exportPdfTable = () => {
        // change this number to generate more or less rows of data
        PdfMakeTable(reportObject);
    };

    return (
        <div>
            <div>
                <p style={{fontSize: 14, fontWeight: 'bold', marginLeft: 10}}>* Reports can only be generated if there
                    are
                    complaints.</p>
            </div>
            {hideStepper=== true ? null :
                <div>
                    <Stepper
                        className={classes.stepperBg}
                        activeStep={activeStep}
                        orientation="vertical"
                    >
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                <StepContent>
                                    <Typography>{getStepContent(index)}</Typography>
                                    {noComplaintsFound === true ? <p style={{color: 'red'}}>No complaints found.</p> : null}
                                    {/*<p>Render count is {renderCount.current}</p>*/}

                                    <div className={classes.actionsContainer}>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={() => handleBack(index)}
                                                className={classes.button}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleNext(index)}
                                                className={classes.button}
                                                disabled={nextButton}
                                            >
                                                {activeStep === steps.length - 1
                                                    ? "Download Report"
                                                    : "Next"}
                                            </Button>
                                        </div>
                                    </div>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} className={classes.resetContainer}>
                            <Typography>Your report has been generated.</Typography>
                            <Button onClick={handleReset} className={classes.button}>
                                Reset
                            </Button>
                        </Paper>
                    )}
                </div>}


            <Backdrop className={classes.backdrop} open={loading}>
                <ImpulseSpinner size={90} color="#008081"/>
            </Backdrop>


        </div>
    );
}

export default GenerateReports;
