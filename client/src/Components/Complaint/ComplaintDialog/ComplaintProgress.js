import React, { useState, useEffect } from "react";
import { Paper, Button, DialogActions, TextField } from "@material-ui/core";
import Details from "./Details";
import Status from "../Status";
import axios from "axios";
import Reason from "./Reason";
import SelectStatus from "./Select";
import SelectSupervisor from "./SelectSupervisor";
import Box from "@material-ui/core/Box";
import { Grid, styled, makeStyles } from "@material-ui/core";
import UploadAfterImage from "./UplaodAfterImage";
import { ImpulseSpinner } from "react-spinners-kit";
import Backdrop from "@material-ui/core/Backdrop";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function ComplaintProgress(props) {
  const { sel, dialogClose, save, token, role, supervisors } = props;
  let store = require("store");
  const [userData, setUserData] = useState(store.get("userData"));

  const [Selstatus, setSelStatus] = React.useState("");

  const [StatusId, setStatusId] = React.useState("");
  const [supervisor, setSupervisor] = React.useState([]);
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = useState(false);

  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    setNewImage(null);
  }, []);
  useEffect(() => {
    setStatusId(sel.statusId);
    setSelStatus(sel.statusType);
    setSupervisor(sel.supervisorId);
  }, []);

  const uploadImage = (file) => {
    setNewImage(file);
  };

  const handleSaveClose = (statusOfId, StatusId, ComplainId, supervisorId) => {
    if (role === "SUPERVISOR" && statusOfId === "Resolved" && newImage == null) {
      console.log("error show");
      setError("Choose an image");
    } else if (statusOfId === "Assigned" && supervisor == null) {
      setError("Choose a supervisor");
    } else if (statusOfId === "Rejected" && reason === "") {
      setError("Choose a reason please");
    } else {
      setError("");
      if (sel.statusId !== StatusId || sel.supervisorId !== supervisorId) {
        callApi(statusOfId, StatusId, ComplainId, supervisorId);
      } else {
        dialogClose();
      }
    }

  };

  const updateStatus = (value, name) => {
    setSelStatus(name);
    setStatusId(value);
  };

  const updateSupervisor = (value) => {
    setSupervisor(value);

  };

  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };
  const callApi = (statusType, statusId, complainId, supervisorId) => {
    setLoading(true);
    let api = "";
    if (role === "ADMIN") {
      api = "/api/updateComplainStatus";
    } else {
      api = "/api/updateAssignedComplaintStatus";
    }

    const key =
      statusType === "Rejected"
        ? "reason"
        : statusType === "Assigned"
        ? "supervisor"
        : "";
    const value =
      statusType === "Rejected"
        ? reason
        : statusType === "Assigned"
        ? supervisor
        : "";

    var data = {};
    if (role === "ADMIN") {
      data = {
        StatusId: StatusId,
        id: complainId,
        ...(true && { [key]: value }),
      };
    } else {
      data = new FormData();
      data.set("StatusId", StatusId);
      data.set("id", complainId);

      if (key !== "") {
        data.set(key, value);
      }
      if (newImage != null && Selstatus === "Resolved") {
        data.append("resolvedComplaintImage", newImage);
      }
    }

    const headers =
      role === "ADMIN"
        ? {
            "x-access-token": token,
          }
        : {
            "x-access-token": token,

            "content-type": "multipart/form-data",
          };

    axios
      .post("https://m2r31169.herokuapp.com" + api, data, {
        headers,
      })
      .then((res) => {
        setLoading(false);
        setSelStatus("");

        dialogClose();

        save();
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
        console.log("error here" + err);
        console.log("error here", err.response);
      });
  };

  // const getSupervisorStatus = () => {
  //   console.log("supervisor status ");
  //   axios
  //     .get(
  //       "https://m2r31169.herokuapp.com/api/getSuperVisorStatus?id=" + sel.id
  //     )
  //     .then((res) => {
  //       console.log("supervisor status", res.data);
  //       setOtherStatus(res.data);
  //       // for (var i in res.data.Reasons) {
  //       //   finalObj.push(res.data.Reasons[i]);
  //       // }
  //       // console.log("Reject tags" + finalObj.toString());
  //       // setReason(finalObj);
  //     })
  //     .catch((err) => {
  //       console.log("error ", err);
  //     });
  // };

  // useEffect(() => {
  //   console.log("supervisor status", role, sel.supervisorId);
  //   if (role == "ADMIN" && sel.supervisorId) getSupervisorStatus();
  // }, []);

  return (
    <div>
      <Grid container style={{ height: "100%" }}>
        <Backdrop style={{ zIndex: 1, color: "#fff" }} open={loading}>
          <ImpulseSpinner size={90} color="#008081" loading={loading} />
        </Backdrop>
        <Grid item xs={12} sm={6}>
          <Details
            title="Complaint Status"
            display={
              sel.statusType === "Resolved" ||
              sel.statusType === "Rejected" ||
              sel.otherStatus === "Active"
                ? "block"
                : "none"
            }
          />
          <Status
            name={sel.statusType}
            buttonComp="div"
            display={
              sel.statusType === "Resolved" ||
              sel.statusType === "Rejected" ||
              sel.otherStatus === "Active"
                ? "flex"
                : "none"
            }
          />
          <Details
            title="Reason for Rejection"
            name={sel.reason === "" ? "No reason specified" : sel.reason}
            display={sel.statusType === "Rejected" ? "block" : "none"}
          />

          <Details
            title="Supervisor"
            name={
              sel.supervisorId &&
              supervisors.find((x) => x.supervisorId === sel.supervisorId) &&
              supervisors.find((x) => x.supervisorId === sel.supervisorId).name
            }
            display={
              role === "ADMIN" &&
              sel.supervisorId &&
              (sel.statusType === "Resolved" ||
                sel.statusType === "Rejected" ||
                sel.otherStatus === "Active")
                ? "block"
                : "none"
            }
          />
          <SelectStatus
            role={role}
            display={
              sel.statusType === "Resolved" ||
              sel.statusType === "Rejected" ||
              sel.otherStatus === "Active"
                ? "none"
                : "inline-flex"
            }
            otherStatus={sel.otherStatus}
            token={token}
            disable={
              sel.statusType === "Resolved" ||
              sel.statusType === "Rejected" ||
              sel.otherStatus === "Active"
            }
            role={role}
            name="Status"
            value={sel.statusId}
            changeValue={updateStatus}
          />
          {role === "ADMIN" && (
            <SelectSupervisor
              key={sel.StatusId}
              token={token}
              display={
                Selstatus === "Assigned" && sel.otherStatus !== "Active"
                  ? "inline-flex"
                  : "none"
              }
              disable={!(Selstatus === "Assigned")}
              name={"Supervisor"}
              value={sel.supervisorId ? sel.supervisorId : ""}
              changeValue={updateSupervisor}
            />
          )}
          {role !== "ADMIN" && Selstatus === "Active" && <TextField />}
          <Reason
            value={reason}
            key={reason}
            name="Reason for rejecting"
            display={
              Selstatus === "Rejected" && sel.statusType !== "Rejected"
                ? "inline-flex"
                : "none"
            }
            changeValue={(name) => {
              setReason(name);
            }}
          />
          <Box
            fontWeight="500"
            component="div"
            fontSize="1.2rem"
            color="red"
            m={1}
          >
            {error}
          </Box>
          {role === "ADMIN" && sel.supervisorId != null ? (
            <Details title="Supervisor Status" name={sel.otherStatus} />
          ) : (
            role === "SUPERVISOR" &&
            sel.statusType === "Resolved" && (
              <Details
                title="Admin Status"
                name={
                  sel.otherStatus === "Resolved"
                    ? "Verified"
                    : "Waiting for verification"
                }
                // display={
                //   role == "Supervisor" && sel.statusType == "Resolved"
                //     ? "block"
                //     : "none"
                // }
              />
            )
          )}
          {sel.otherStatus === "Resolved" && sel.statusType !== "Resolved" && (
            <Box color="red">
              <ErrorOutlineOutlinedIcon style={{ fontSize: "20px" }} />
              {"  Please verify this complaint"}
            </Box>
          )}
        </Grid>
        {sel.afterImage != null && (
          <Grid item xs={12} sm={6}>
            <Box
              fontWeight="700"
              component="div"
              fontSize="0.9rem"
              color="black"
              m={1}
            >
              {" Complaint Image - After"}
            </Box>

            <Paper className="image">
              <img
                className="complainImage"
                height="250px"
                alt="Error Loading Image"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={sel.afterImage}
              />
            </Paper>
          </Grid>
        )}
        {role === "SUPERVISOR" &&
          Selstatus === "Resolved" &&
          sel.statusType !== "Resolved" &&
          sel.afterImage === null && (
            <Grid
              item
              xs={12}
              sm={6}
              style={{ display: Selstatus === "Resolved" ? "block" : "none" }}
            >
              <Box
                fontWeight="700"
                component="div"
                fontSize="0.9rem"
                color="black"
                m={1}
              >
                {"Upload Complaint Image"}
              </Box>
              <UploadAfterImage uploadImage={uploadImage} />
            </Grid>
          )}
      </Grid>
      <DialogActions>
        {!(
          sel.statusType === "Resolved" ||
          sel.statusType === "Rejected" ||
          sel.otherStatus === "Active"
        ) && (
          <div>
            <Button
              style={{
                float: "right",
                color: "white",
                backgroundColor: "teal",
                display: loading ? "none" : "block",
              }}
              onClick={() => {
                handleSaveClose(Selstatus, StatusId, sel.id, supervisor);
              }}
            >
              Save
            </Button>
            <CircularProgress
              style={{ display: loading ? "block" : "none", color: "teal" }}
            />
          </div>
        )}
      </DialogActions>
    </div>
  );
}
