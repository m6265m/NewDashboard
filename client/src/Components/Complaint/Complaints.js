import "../../ComponentsCss/Complaints.css";
import axios from "axios";
import Box from "@material-ui/core/Box";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import FilterListIcon from "@material-ui/icons/FilterList";
import Moment from "moment";

import SelectFilter from "./Filters/SelectFilter";
import ComplaintDialog from "./ComplaintDialog/ComplaintDialog";
import AssignmentDialog from "./Assignment/AssignmentDialog";

import Status from "./Status";
import Visualize from "./Charts/Visualize";
import PriorityVisualize from "./Charts/PriorityVisualize";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import React from "react";
import PropTypes from "prop-types";
import { Grid, styled, FormControl, Select, MenuItem } from "@material-ui/core";

import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { ImpulseSpinner } from "react-spinners-kit";
import Backdrop from "@material-ui/core/Backdrop";
import AllSelectFilters from "./Filters/AllSelectFilters";

import Paper from "@material-ui/core/Paper";

import { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";

import { Scrollbars } from "react-custom-scrollbars";
import FilterDrawer from "./Filters/FilterDrawer";

let store = require("store");

function descendingComparator(a, b, orderBy) {
  // console.log(
  //   "order by " + orderBy + "aaaa" + a[orderBy] + "bbbb" + b[orderBy]
  // );
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

class EnhancedTableHead extends React.Component {
  render() {
    const headCells = [
      { id: "id", numeric: true, disablePadding: false, label: "Id" },
      {
        id: "type",
        numeric: false,
        disablePadding: false,
        label: "Type",
      },

      { id: "date", numeric: true, disablePadding: false, label: "Date" },
      {
        id: "priority",
        numeric: true,
        disablePadding: false,
        label: "Requests",
      },
      {
        id: "Town",
        numeric: false,
        disablePadding: false,
        label: "Town",
      },
      { id: "status", numeric: false, disablePadding: false, label: "Status" },
    ];
    const {
      classes,

      order,
      orderBy,

      onRequestSort,
    } = this.props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead className="tableHead">
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              padding={headCell.disablePadding ? "none" : "default"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label.toUpperCase()}
                {/* {console.log(orderBy === headCell.id)} */}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,

  onRequestSort: PropTypes.func.isRequired,

  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    // maxHeight:"8n00px",
    overflowY: "auto",

    // maxWidth: "800px",
    // minWidth:"400px",
    backgroundColor: "transparent",
    marginBottom: theme.spacing(2),
  },
  table: {
    // minWidth: "50vw",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  backdrop: {
    zIndex: 1,
    color: "#fff",
  },
}));

export default function Complaints(props) {
  const classes = useStyles();

  const search = props.location.search; // returns the URL query String
  const params = new URLSearchParams(search);
  const [complainIdOpen, setComplainIdOpen] = useState(
    params.get("complainIdOpen")
  );
  const { statusFilter, typeFilter, notifFilter, nootifId } = props.location;

  const [filter, setFilter] = useState({
    statusType: [],
    type: [],
    priority: [],
    town: [],
    supervisorName: [],
    otherStatus: [],
  });

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("date");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [clear, setClear] = React.useState(true);
  const [active, setActive] = React.useState(false);
  const [hasError, setErrors] = useState(false);
  const [rows, setRows] = useState([]);
  const [orignalData, setOrignalData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [alreadyOpen, setAlreadyOpen] = React.useState(false);
  const [sel, setSel] = React.useState({});
  const [userData, setUserData] = useState(store.get("userData"));
  const [supervisor, setSupervisor] = React.useState("");
  const [supervisors, setSupervisors] = React.useState([]);
  const [assignDialog, setAssignDialog] = useState(false);
  const [assignSupervisor, setAssignSupervisor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complaintFilter, setComplaintFilter] = useState("all");

  const getSupervisor = () => {
    var finalObj = [];
    // var finalObj1 = [];
    axios
      .get("https://m2r31169.herokuapp.com/api/getSuperVisor_Town", {
        headers: {
          "x-access-token": userData.accessToken, //the token is a variable which holds the token
        },
      })
      .then((res) => {

        for (var i in res.data.supervisors) {
          finalObj.push(res.data.supervisors[i]);
          // finalObj1.push(res.data.supervisors[i].town);
        }

        setSupervisors(finalObj);
        // setTown(finalObj1);
      })
      .catch((err) => {
        console.log("error", err);
        setErrors(err);
      });
  };

  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const assignComplaints = () => {
    const unresolved = orignalData.filter(
      (obj) => obj.statusType === "Unresolved"
    );

    const Assign = supervisors.map((supervisor) => {
      if (unresolved.find((item) => item.town === supervisor.town) != null) {
        return {
          supervisorName: supervisor,
          complaint: unresolved.filter((item) => item.town === supervisor.town),
        };
      }

      // return obj;
    });

    if (Assign.find((obj) => obj != null)) setAssignDialog(true);
    setAssignSupervisor(Assign);

  };
  const handleSupervisorChange = (event) => {
    setSupervisor(event.target.value);
  };

  const handleClickOpen = (row) => {
    // window.location = `/dashboard/complaints?complainIdOpen=${row.id}`;
    window.history.pushState(
      null,
      "",
      `/dashboard/complaints?complainIdOpen=${row.id}`
    );
    setOpen(true);
    setSel(row);
  };

  const handleClose = () => {
    setOpen(false);
    setComplainIdOpen(null);
    window.history.pushState(null, "", "/dashboard/complaints");
    // window.history.back();
    // window.location = `/dashboard/complaints`;
  };

  const handleAssignDialogClose = () => {
    setAssignDialog(false);
  };

  //filter complaints

  const nestedFilter = () => {
    var filterKeys = Object.keys(filter);

    return orignalData.filter(function (eachObj) {
      //  console.log("called length of filter", filterKeys, eachObj);
      return filterKeys.every(function (eachKey) {
        if (!filter[eachKey].length) {
          // console.log("called length of filter");
          return true;
        }
        return filter[eachKey].includes(eachObj[eachKey]);
      });
    });
  };
  useEffect(() => {
    // console.log("complainIdopen", complainIdOpen, orignalData);
    if (mainData.length !== 0) {
      if (complainIdOpen != null && alreadyOpen != complainIdOpen) {
        setOpen(true);
        setSel(mainData.find((x) => x.id == complainIdOpen));
        setAlreadyOpen(complainIdOpen);
      }
    }
  }, [complainIdOpen, mainData]);
  useEffect(() => {
    // console.log("props", statusFilter);

    if (notifFilter != null) {
      filterTable("statusType", [notifFilter]);
    }

    if (typeFilter != null) {
      filterTable("type", [typeFilter]);
    }
    if (statusFilter != null) filterTable("otherStatus", [statusFilter]);
  }, [statusFilter, typeFilter]);
  useEffect(() => {
    if (userData.Role === "ADMIN") assignComplaints();
  }, [mainData, supervisors]);

  useEffect(() => {
    if (complaintFilter === "active") {
      // setFilter({
      //   statusType: ["Assigned", "Unresolved"],
      //   type: [],
      //   priority: [],
      //   town: [],
      //   supervisorName: [],
      // });
      // setOrignalData(mainData);
      setOrignalData(
        mainData.filter(
          (obj) =>
            obj.statusType === "Active" ||
            obj.statusType === "Unresolved" ||
            obj.statusType === "Assigned" ||
            (obj.statusType == "Resolved" && obj.otherStatus != "Resolved")
        )
      );
    } else if (complaintFilter == "inactive") {
      // setFilter({
      //   statusType: ["Resolved", "Rejected"],
      //   type: [],
      //   priority: [],
      //   town: [],
      //   supervisorName: [],
      // });
      // setOrignalData(mainData);
      setOrignalData(
        mainData.filter(
          (obj) =>
            obj.statusType === "Resolved" || obj.statusType === "Rejected"
        )
      );
    } else {
      setOrignalData(mainData);

      // setFilter({
      //   statusType: [],
      //   type: [],
      //   priority: [],
      //   town: [],
      //   supervisorName: [],
      // });
    }
  }, [complaintFilter, mainData]);

  useEffect(() => {
    //console.log("length of filter " + JSON.stringify(filter), userData.role);
    if (
      filter["statusType"].length > 0 ||
      filter["type"].length > 0 ||
      filter["priority"].length > 0 ||
      filter["town"].length > 0 ||
      filter["supervisorName"].length > 0 ||
      filter["otherStatus"].length > 0
    ) {
      setClear(false);
    } else {
      setClear(true);
    }
    var filterArray = nestedFilter();

    setRows(filterArray);
  }, [filter, orignalData]);

  const filterTable = (name, value) => {
    // console.log("filters" + name, value);
    setOrignalData(mainData);
    setFilter((filter) => ({ ...filter, [name]: value }));
    setPage(0);
  };

  const handleChangeFilter = (event) => {
    setComplaintFilter(event.target.value);
  };

  //fetch and simplify object
  async function fetchData() {
    var finalObj = [];
    axios
      .get("https://m2r31169.herokuapp.com/api/getComplaints", {
        headers: {
          "x-access-token": userData.accessToken, //the token is a variable which holds the token
        },
      })
      .then((res) => {
        // console.log("data", res.data);
        for (var i in res.data) {
          // console.log("iiiiiii" + JSON.stringify(res.data[i]));
          var tmpObj = {};
          tmpObj["id"] = res.data[i].complain.id;
          tmpObj["description"] = res.data[i].complain.description;
          tmpObj["longitude"] = res.data[i].complain.Location.longitude;
          tmpObj["latitude"] = res.data[i].complain.Location.latitude;
          tmpObj["image"] = res.data[i].complain.image;
          tmpObj["afterImage"] = res.data[i].complain.resolvedComplaintImage;
          tmpObj["statusType"] = res.data[i].complain.Status.statusType;
          tmpObj["statusId"] = res.data[i].complain.Status.id;
          tmpObj["date"] = res.data[i].complain.createdAt;
          tmpObj["town"] = res.data[i].complain.Location.town.name;
          tmpObj["priority"] =
            res.data[i].complain.noOfRequests > 5
              ? "high"
              : res.data[i].complain.noOfRequests > 1
              ? "medium"
              : "low";

          tmpObj["reason"] =
            res.data[i].complain.Status.statusType == "Rejected"
              ? res.data[i].complain.reasonForRejection
              : "";
          tmpObj["requests"] = res.data[i].complain.noOfRequests;

          tmpObj["type"] = res.data[i].complain.ComplaintType.typeName;
          tmpObj["supervisorId"] = res.data[i].complain.assignedTo;

          tmpObj["supervisorName"] =
            res.data[i].complain.User && res.data[i].complain.User.name;
          // tmpObj["adminStatus"] = res.data[i].complain.adminStatus;
          tmpObj["otherStatus"] = res.data[i].supervisorStatus
            ? res.data[i].supervisorStatus
            : res.data[i].adminStatus;
          // console.log("final" + tmpObj["status"].statusType);
          finalObj.push(tmpObj);
        }

        setRows(finalObj);
        setOrignalData(finalObj);
        setLoading(false);
        setMainData(finalObj);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status == 400) {
            setLoading(false);
          }
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          } else if (
            err.response.status === 503 ||
            err.response.status === 500
          ) {
            console.log(err.response.status);
            props.handleError(err.response.status);
          }
        }

        console.log("complaints not coming", err.response);
        setErrors(err);
      });
  }

  useEffect(() => {
    if (userData.Role === "ADMIN") getSupervisor();
    fetchData();
    // setComplaintFilter("active");
  }, [userData]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="table">
      <Grid container justify="flex-start" alignItems="flex-start">
        <Grid item xs={12} sm={12} md={12} lg={9}>
          <Paper className="filter elevationPaper">
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <div
                style={{
                  minHeight: window.innerWidth < 500 ? "100px" : "50px",
                }}
              >
                {window.innerWidth > 600 ? (
                  <Box
                    textAlign="left"
                    color="#008080"
                    fontWeight="600"
                    fontSize="18"
                    component="span"
                  >
                    Filters
                  </Box>
                ) : (
                  <FilterDrawer
                    key={filter.length}
                    filter={filter}
                    orignalData={orignalData}
                    filterValue={filterTable}
                    userData={userData}
                  />
                )}
                <Box
                  style={{ float: window.innerWidth > 600 ? "right" : "none" }}
                >
                  <FormControl className={classes.formControl}>
                    <Select
                      value={complaintFilter}
                      onChange={handleChangeFilter}
                      displayEmpty
                      // className={classes.selectEmpty}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"active"}>Active Complaints</MenuItem>
                      <MenuItem value={"inactive"}>
                        Inactive Complaints
                      </MenuItem>
                      <MenuItem value={"all"}>All Complaints</MenuItem>
                    </Select>
                  </FormControl>
                  {/* <Button
                  variant="contained"
                  title={"Click to view only complaints that are in progress"}
                  style={{ color: "teal" }}
                  onClick={() => {
                    active
                      ? setFilter({
                          statusType: [],
                          type: [],
                          priority: [],
                          town: [],
                          supervisorName: [],
                        })
                      : setFilter({
                          statusType: ["Assigned", "Unresolved"],
                          type: [],
                          priority: [],
                          town: [],
                          supervisorName: [],
                        });
                  }}
                >
                  {active ? "All Complaints" : "Only Active Complaints"}
                </Button> */}

                  <Button
                    disabled={clear}
                    className="clearButton"
                    onClick={() => {
                      setFilter({
                        statusType: [],
                        type: [],
                        priority: [],
                        town: [],
                        supervisorName: [],
                        otherStatus: [],
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </div>
            </Grid>
            <Grid
              item
              xs={9}
              sm={9}
              md={12}
              lg={12}
              // style={{ display: window.innerWidth > 600 ? "block" : "none" }}
            >
              {window.innerWidth > 600 && (
                <AllSelectFilters
                  key={filter.length}
                  filter={filter}
                  orignalData={orignalData}
                  filterValue={filterTable}
                  userData={userData}
                />
              )}
              {/* <SelectFilter
                key={filter["statusType"][0]}
                orignalData={orignalData}
                label="Status"
                name="statusType"
                value={filter["statusType"]}
                filterValue={filterTable}
              />

              <SelectFilter
                key={filter["priority"][0]}
                orignalData={orignalData}
                label="Priority"
                name="priority"
                value={filter["priority"]}
                filterValue={filterTable}
              />

              <SelectFilter
                name="type"
                orignalData={orignalData}
                label="Type"
                value={filter["type"]}
                key={filter["type"][0]}
                filterValue={filterTable}
              />

              <SelectFilter
                name="town"
                orignalData={orignalData}
                label="Town"
                value={filter["town"]}
                key={filter["town"][0]}
                filterValue={filterTable}
              />

              {userData.Role == "ADMIN" && (
                <SelectFilter
                  name="supervisorName"
                  orignalData={orignalData}
                  label="Supervisor"
                  value={filter["supervisorName"]}
                  key={filter["supervisorName"][0]}
                  filterValue={filterTable}
                />
              )}
              {userData.Role == "ADMIN" && (
                <SelectFilter
                  name="otherStatus"
                  orignalData={orignalData}
                  label="Supervisor Status"
                  value={filter["otherStatus"]}
                  key={filter["otherStatus"][0]}
                  filterValue={filterTable}
                />
              )} */}

              {/* <DateFilter /> */}
            </Grid>
          </Paper>

          <Scrollbars style={{ minWidth: 150, minHeight: 420 }}>
            <Paper className="elevationPaper">
              <TableContainer className="tableContainer">
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  // size={dense ? "small" : "medium"}
                  size="small"
                  aria-label="enhanced table"
                >
                  <EnhancedTableHead
                    classes={classes}
                    //numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    //onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />

                  <TableBody className="tableBody">
                    {stableSort(rows, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            className="tableRow"
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
                          >
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              align="center"
                              padding="none"
                            >
                              {row.id}
                            </TableCell>
                            <TableCell align="left">{row.type}</TableCell>
                            {/* <TableCell align="left">{row.longitude}</TableCell> */}
                            <TableCell align="left">
                              {Moment(row.date).format("DD/MM/YY")}
                            </TableCell>
                            <TableCell align="center">{row.requests}</TableCell>
                            <TableCell align="left">{row.town}</TableCell>
                            <TableCell align="left">
                              {/* {row.Status.statusType} */}
                              <Status
                                name={row.statusType}
                                onFilterTable={filterTable}
                                buttonComp="div"
                              />
                              {row.otherStatus == "Resolved" &&
                              row.statusType != "Resolved" ? (
                                <Box color="red">
                                  <ErrorOutlineOutlinedIcon
                                    style={{ fontSize: "20px" }}
                                  />
                                  {"Please verify"}
                                </Box>
                              ) : (
                                ""
                              )}
                            </TableCell>
                            <TableCell align="left">
                              <MoreHorizIcon
                                style={{
                                  fontSize: "20px",
                                  color: "#8A8A8A",
                                }}
                                onClick={() => handleClickOpen(row)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Scrollbars>

          <TablePagination
            rowsPerPageOptions={[10, 15, 30]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
        {window.innerWidth > 500 && (
          <Grid item xs={12} sm={12} md={12} lg={3}>
            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={12}>
                <Visualize
                  key={mainData.length}
                  resolved={
                    mainData.filter((obj) => obj.statusType === "Resolved")
                      .length
                  }
                  unresolved={
                    mainData.filter((obj) => obj.statusType === "Unresolved")
                      .length
                  }
                  rejected={
                    mainData.filter((obj) => obj.statusType === "Rejected")
                      .length
                  }
                  assigned={
                    userData.Role === "ADMIN"
                      ? mainData.filter((obj) => obj.statusType === "Assigned")
                          .length
                      : mainData.filter((obj) => obj.statusType === "Active")
                          .length
                  }
                  total={mainData.length}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={12}>
                {" "}
                <PriorityVisualize
                  high={mainData.filter((obj) => obj.priority == "high").length}
                  medium={
                    mainData.filter((obj) => obj.priority == "medium").length
                  }
                  low={mainData.filter((obj) => obj.priority == "low").length}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Backdrop key={rows.length} className={classes.backdrop} open={loading}>
        <ImpulseSpinner size={90} color="#008081" loading={loading} />
      </Backdrop>

      {Object.keys(sel).length > 0 && (
        <ComplaintDialog
          key={sel.id}
          role={userData.Role}
          open={open}
          sel={sel}
          dialogClose={handleClose}
          save={fetchData}
          token={userData.accessToken}
          supervisors={supervisors}
        />
      )}
      {/* {Object.keys(assignSupervisor).length > 0 && ( */}
      <AssignmentDialog
        data={assignSupervisor}
        open={assignDialog}
        dialogClose={handleAssignDialogClose}
        role={userData.Role}
        save={fetchData}
        token={userData.accessToken}
      />
    </div>
  );
}
