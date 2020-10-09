import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "../../ComponentsCss/Complaints.css";
import "../../ComponentsCss/Supervisor.css";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import DoneIcon from "@material-ui/icons/Done";
import SupervisorAccountRoundedIcon from "@material-ui/icons/SupervisorAccountRounded";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import ClearIcon from "@material-ui/icons/Clear";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import Tooltip from "@material-ui/core/Tooltip";
import { Grid, styled, FormControl, Select, MenuItem } from "@material-ui/core";
import { Scrollbars } from "react-custom-scrollbars";
import Avatar from "@material-ui/core/Avatar";
import { ImpulseSpinner } from "react-spinners-kit";
import Backdrop from "@material-ui/core/Backdrop";
import AddForm from "./AddForm.js";
import EditDialog from "./EditDialog.js";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import { IconButton } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteDialog from "./DeleteDialog.js";
import ResolveTime from "./ResolveTime.js";
import axios from "axios";

let store = require("store");

function descendingComparator(a, b, orderBy) {
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

// const _headCell = [
//   {
//     id: "name",
//     numeric: true,
//     disablePadding: false,
//     label: "Name",
//   },
// ];
const headCells = [
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "phoneNumber",
    numeric: true,
    disablePadding: false,
    label: "Phone Number",
  },
  { id: "town", numeric: false, disablePadding: false, label: "Town" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="tableHead">
      <TableRow
        style={{
          borderBottom: "10px solid #f3f3f3",
        }}
      >
        <TableCell
          style={{
            paddingLeft: "16px",
            paddingRight: "3px",
          }}
        />
        <TableCell
          // colSpan={2}
          key="name"
          align="left"
          padding="none"
          sortDirection={orderBy === "name" ? order : false}
          style={{
            paddingLeft: "2px",
            paddingRight: "7px",
          }}
        >
          <TableSortLabel
            active={orderBy === "name"}
            direction={orderBy === "name" ? order : "asc"}
            onClick={createSortHandler("name")}
          >
            NAME
            {/* {console.log(orderBy === _headCell.id)} */}
            {orderBy === "name" ? (
              <span className={classes.visuallyHidden}>
                {order === "desc" ? "sorted descending" : "sorted ascending"}
              </span>
            ) : null}
          </TableSortLabel>
        </TableCell>
        <Tooltip title="Resolved Complaints">
          <TableCell
            key="statistics"
            align="center"
            style={{
              paddingLeft: "7px",
              paddingRight: "7px",
            }}
          >
            <DoneIcon
              style={{
                color: "#66bb6a",
                width: "30px",
                height: "30px",
              }}
            />{" "}
          </TableCell>
        </Tooltip>
        <Tooltip title="Active Complaints">
          <TableCell
            key="statistics"
            align="center"
            style={{
              paddingLeft: "7px",
              paddingRight: "7px",
            }}
          >
            <HourglassFullIcon
              style={{
                color: "#ab47bc",
                width: "30px",
                height: "30px",
              }}
            />
          </TableCell>
        </Tooltip>
        <Tooltip title="Inactive Complaints">
          <TableCell
            align="center"
            key="statistics"
            style={{
              paddingLeft: "7px",
              paddingRight: "7px",
            }}
          >
            <ClearIcon
              style={{
                color: "#ef5350",
                width: "30px",
                height: "30px",
              }}
            />
          </TableCell>
        </Tooltip>
        <Tooltip title="Rejected Complaints">
          <TableCell
            key="statistics"
            align="center"
            style={{
              paddingLeft: "7px",
              paddingRight: "7px",
            }}
          >
            <PriorityHighIcon
              style={{
                color: "#ffa726",
                width: "30px",
                height: "30px",
              }}
            />
          </TableCell>
        </Tooltip>

        <TableCell
          // colSpan={2}
          key="performance"
          align="center"
          padding="none"
          sortDirection={orderBy === "performance" ? order : false}
          style={{ paddingLeft: "7px", paddingRight: "13px" }}
        >
          <div
            style={{
              whiteSpace: " pre-wrap",
              padding: "0px",
              margin: "0 10% 0 10%",
              lineHeight: "110%",
              textAlign: "center",
            }}
          >
            <TableSortLabel
              style={{ margin: "0px" }}
              active={orderBy === "performance"}
              direction={orderBy === "performance" ? order : "asc"}
              onClick={createSortHandler("performance")}
            >
              <p>
                PERFORMANCE
                <br />
                <span style={{ fontSize: "10px" }}>
                  ComplaintsResolved/week
                </span>
              </p>

              {/* {console.log(orderBy === _headCell.id)} */}
              {orderBy === "performance" ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </div>
        </TableCell>

        {headCells.map((headCell) => (
          <TableCell
            style={{
              paddingLeft: "7px",
              paddingRight: "7px",
            }}
            key={headCell.id}
            align="justify"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {/* .toUpperCase() */}
              {headCell.label.toUpperCase()}
              {/* {console.log(orderBy === headCell.id)} */}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          style={{
            paddingLeft: "0px",
            paddingRight: "1px",
          }}
        />
        <TableCell
          style={{
            paddingLeft: "0px",
            paddingRight: "1px",
          }}
        />
        <TableCell
          style={{
            paddingLeft: "0px",
            paddingRight: "16px",
          }}
        />
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    overflowY: "auto",

    maxWidth: "800px",
    minWidth: "400px",
    backgroundColor: "transparent",
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  // table: {
  //   minWidth: 750,
  // },
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
  _theme: {
    color: theme.palette.getContrastText("#008080"),
    backgroundColor: "#008080",
  },
  backdrop: {
    zIndex: 1,
    color: "#fff",
  },
  // searchIcon: {
  //   padding: theme.spacing(0, 2),
  //   height: "100%",
  //   position: "absolute",
  //   pointerEvents: "none",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },

  margin: {
    margin: theme.spacing(1),
  },
}));

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      { date: "2020-01-05", customerId: "11091700", amount: 3 },
      { date: "2020-01-02", customerId: "Anonymous", amount: 1 },
    ],
  };
}

function Row(props) {
  const {
    row,
    labelId,
    classes,
    res,
    towns,
    handleUpdatedTown,
    handleDelete,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [supervisorId, setSupervisorId] = React.useState("");

  function handleExpand(id) {
    if (open === false) {
      setSupervisorId(id);
    } else {
      setSupervisorId("");
    }
    setOpen(!open);

    console.log("opn  " + open);
  }

  return (
    <React.Fragment>
      <TableRow hover role="checkbox" tabIndex={-1} key={row.supervisorId}>
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          style={{
            paddingLeft: "16px",
            paddingRight: "3px",
          }}
        >
          <Avatar
            className="gridd"
            alt="Remy Sharp"
            src={row.image}
            className={classes._theme}
          >
            {res}
          </Avatar>{" "}
        </TableCell>
        <TableCell
          align="left"
          style={{
            paddingLeft: "2px",
            paddingRight: "7px",
          }}
        >
          {row.name}
        </TableCell>
        <TableCell
          align="center"
          style={{
            paddingLeft: "7px",
            paddingRight: "7px",
          }}
        >
          {row.Resolved}
        </TableCell>
        <TableCell
          align="center"
          style={{
            paddingLeft: "7px",
            paddingRight: "7px",
          }}
        >
          {row.Active}
        </TableCell>
        <TableCell
          align="center"
          style={{
            paddingLeft: "7px",
            paddingRight: "7px",
          }}
        >
          {row.Unresolved}
        </TableCell>
        <TableCell
          align="center"
          style={{
            paddingLeft: "7px",
            paddingRight: "7px",
          }}
        >
          {row.Rejected}
        </TableCell>
        <TableCell
          align="center"
          style={{
            paddingLeft: "7px",
            paddingRight: "13px",
          }}
        >
          {row.performance}
        </TableCell>
        <TableCell
          align="left"
          style={{
            paddingLeft: "7px",
            paddingRight: "7px",
          }}
        >
          {row.email}
        </TableCell>
        <TableCell
          align="left"
          style={{
            paddingLeft: "7px",
            paddingRight: "7px",
          }}
        >
          {row.phoneNumber}
        </TableCell>
        <TableCell
          align="left"
          style={{
            paddingLeft: "7px",
            paddingRight: "0px",
          }}
        >
          {row.town}
        </TableCell>
        <TableCell
          align="left"
          style={{ paddingLeft: "0px", paddingRight: "1px" }}
        >
          <EditDialog town={towns} rowData={row} onUpdate={handleUpdatedTown} />{" "}
        </TableCell>{" "}
        <TableCell
          align="left"
          style={{
            paddingLeft: "0px",
            paddingRight: "1px",
          }}
        >
          <DeleteDialog superId={row.supervisorId} onDelete={handleDelete} />
          {/* <IconButton style={{ backgroundColor: "transparent" }}>
            <DeleteIcon
              onClick={handleDelete(row.supervisorId)}
              style={{
                color: "#008080",
                fontSize: "20px",
                padding: 0,
                border: 0,
              }}
            />
          </IconButton> */}
        </TableCell>
        <TableCell
          align="left"
          style={{ paddingLeft: "0px", paddingRight: "16px" }}
        >
          <IconButton
            style={{ backgroundColor: "transparent" }}
            aria-label="expand row"
            size="small"
            onClick={() => {
              handleExpand(row.supervisorId);
            }}
          >
            {open ? (
              <KeyboardArrowUpIcon
                style={{
                  color: "#008080",
                  fontSize: "20px",
                  padding: 0,
                  border: 0,
                }}
              />
            ) : (
              <KeyboardArrowDownIcon
                style={{
                  color: "#008080",
                  fontSize: "20px",
                  padding: 0,
                  border: 0,
                }}
              />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className="tableRow2">
        <TableCell
          style={{
            padding: "0px 24px 0px 16px",
          }}
          colSpan={13}
        >
          {" "}
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ResolveTime superId={supervisorId} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  classes: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  labelId: PropTypes.number.isRequired,
  res: PropTypes.string.isRequired,
  towns: PropTypes.object.isRequired,
  handleUpdatedTown: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default function Supervisors() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [userData, setUserData] = useState(store.get("userData"));
  const [supervisor, setSupervisor] = React.useState("");
  const [supervisors, setSupervisors] = React.useState([]);
  const [rows, setRows] = useState([]);
  // const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [clearOpen, setClearOpen] = React.useState(false);
  const [towns, setTowns] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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

  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  function handleDelete(value) {
    console.log("value aiaaaaaa " + value);

    // setLoading(true);
    let body = { id: value };
    axios
      .post("https://m2r31169.herokuapp.com/api/deleteSupervisor", body, {
        headers: {
          "x-access-token": userData.accessToken, //the token is a variable which holds the token
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const newList = rows.filter((item) => item.supervisorId !== value);

          setRows(newList);

          // setLoading(false);
        }

        // setTown(finalObj1);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status == 400) {
            setLoading(false);
            console.log(err.response.status);
          }
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          }
          if (err.response.status === 503 || err.response.status === 500) {
            console.log(err.response.status);
            alert("Something went wrong. Please try again later");
          }
        }
      });
  }

  async function fetchTowns() {
    const townObj = [];
    axios.get("https://m2r31169.herokuapp.com/api/getTowns").then((res) => {
      for (var i in res.data.Towns) {
        if (res.data.Towns[i] !== "Select Town...") {
          townObj.push(res.data.Towns[i]);
        }
        // finalObj1.push(res.data.supervisors[i].town);
      }
      setTowns(townObj);
      // setTown(finalObj1);
    });
  }

  useEffect(() => {
    fetchTowns();
  }, []);

  async function fetchData() {
    var finalObj = [];
    axios
      .get(
        "https://m2r31169.herokuapp.com/api/getAllSupervisorsTownAndStatistics",
        {
          headers: {
            "x-access-token": userData.accessToken, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        console.log("suepr     " + JSON.stringify(userData));
        for (var i in res.data.supervisors) {
          // finalObj.push(res.data);
          finalObj.push(res.data.supervisors[i]);
        }

        setSupervisors(finalObj);
        setRows(finalObj);
        setLoading(false);
        // setTown(finalObj1);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status == 400) {
            setLoading(false);
          }
          if (err.response.status === 401 || err.response.status === 403) {
            handleLogoutAutomatically();
          }
          if (err.response.status === 503 || err.response.status === 500) {
            console.log(err.response.status);
          }
        }
      });
  }

  function handleSetNewRow(value) {
    //    setRows([...rows, value]);
    setRows((o) => [...o, value]);
  }

  function handleUpdatedTown(previous, value) {
    setRows(
      rows.map((o) => {
        if (o === previous) return { ...previous, town: value };
        return o;
      })
    );
  }

  useEffect(() => {
    console.log("yaaa");
    fetchData();
  }, []);

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };
  const handleClear = () => {
    setSearch("");
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(() => {
    setFilteredCountries(
      rows.filter(
        (row) =>
          row.name.toLowerCase().includes(search.toLowerCase()) ||
          row.town.toLowerCase().includes(search.toLowerCase()) ||
          row.phoneNumber.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, rows]);

  return (
    <div>
      <Grid container justify="flex-start" alignItems="flex-start">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Paper
            className="filter elevationPaper1"
            style={{
              position: "-webkit-sticky",
              position: "sticky",
              top: 0,
              bottom: 0,
              zIndex: 1,
            }}
          >
            <Grid container>
              {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box
                  className="box1"
                  textAlign="left"
                  color="#008080"
                  fontWeight="600"
                  fontSize="18px"
                  component="span"
                >
                  Supervisors{" "}
                </Box>
              </Grid> */}

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Box component="span">
                  {" "}
                  <AddForm town={towns} onAdd={handleSetNewRow} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Box
                  flexGrow={1}
                  style={{ float: "right" }}
                  component="span"
                  marginRight="10px"
                >
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      value={search}
                      placeholder="Search"
                      id="input-with-icon-adornment"
                      endAdornment={
                        <InputAdornment position="end">
                          <ClearIcon
                            onClick={handleClear}
                            fontSize="small"
                            style={{
                              color: "#008080",
                              cursor: "pointer",
                            }}
                          />
                        </InputAdornment>
                      }
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon
                            style={{
                              color: "#008080",
                            }}
                          />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>{" "}
              </Grid>
            </Grid>
          </Paper>

          <Paper className="elevationPaper1">
            <TableContainer className="tableContainer">
              <Table
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
                  {stableSort(filteredCountries, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      let _res = row.name;
                      let res = _res.substring(0, 1).toUpperCase();

                      return (
                        <Row
                          key={row.name}
                          row={row}
                          classes={classes}
                          labelId={labelId}
                          res={res}
                          towns={towns}
                          handleUpdatedTown={handleUpdatedTown}
                          handleDelete={handleDelete}
                        />
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* <Paper
            className="filter elevationPaper"
            style={{
              position: "-webkit-sticky",
              position: "sticky",
              borderRadius: "0px 0px 20px 20px",
              bottom: 0,
              zIndex: 1,
              padding: "none",
            }}
          > */}
          <TablePagination
            style={{ bottom: 0 }}
            rowsPerPageOptions={[10, 15, 30]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          {/* </Paper> */}
        </Grid>{" "}
      </Grid>

      <Backdrop key={rows.length} className={classes.backdrop} open={loading}>
        <ImpulseSpinner size={90} color="#008081" loading={loading} />
      </Backdrop>

      {/* {Object.keys(assignSupervisor).length > 0 && ( */}
    </div>
  );
}
