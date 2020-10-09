import React, {useState, useEffect} from "react";
import axios from "axios";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import SupervisorAccountRoundedIcon from "@material-ui/icons/SupervisorAccountRounded";
import PersonIcon from "@material-ui/icons/Person";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import "../ComponentsCss/Menu.css";
import {Link} from "react-router-dom";
import image from "../assets/images/app_icon_without_bg.png";
import {makeStyles} from "@material-ui/core/styles";
import {blackColor, grayColor, whiteColor} from "../assets/jss/material-dashboard-react";
import {teal} from "@material-ui/core/colors";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";

let store = require("store");
const styles = {
    menuList: {
        marginLeft: "10px",
        marginTop: "20px",
        marginRight: "10px"
    },
    menuNames: {
        paddingRight: "20px",
        paddingLeft: "20px",
    },
    // focus: {
    //     borderRadius: "50px",
    //     color: whiteColor,
    //     padding:'0 0 0 8px',
    //
    //     '&:focus': {
    //         backgroundColor:'#f3f3f3',
    //         color:'#008081',
    //     }
    //     },

    focus: {
        borderRadius: "50px",
        color: whiteColor,
        padding: "0 24px 0 8px",
    },

    focusNew: {
        backgroundColor: "#f3f3f3",
        borderRadius: "50px",
        color: "#008081",
        padding: "0 24px 0 8px",
    },

    menuIcon: {
        color: whiteColor,
    },
    paper: {
        background:
            "#008081"
    },
    drawerPaper: {
        background: "none",
        borderRight: "none",
        paddingTop: "110px",
        width: "maxContent",
    },
};

const useStyles = makeStyles(styles);

function Menu(props) {
    const [isDesktop, setDesktop] = useState(window.innerWidth > 900);
    const [showDrawerMenu, setShowDrawerMenu] = useState(false);
    const [userData, setUserData] = useState(store.get("userData"));

    const [buttonActive, setButtonActive] = useState("");

    const updateMedia = () => {
        setDesktop(window.innerWidth > 900);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    useEffect(() => {
        setButtonActive(window.location.pathname.split("/").pop());
    }, []);

    const headers = {
        "Content-Type": "application/json",
        "x-access-token": userData.accessToken,
    };

    // const handleFocus = () => {
    //   if (buttonColor === true) setButtonColor(false);
    //   else if (buttonColor === false) setButtonColor(true);
    // };

    const handleDrawerToggle = () => {
        setShowDrawerMenu(!showDrawerMenu);
    };

    const handleLogout = (event) => {
        event.preventDefault();

        axios
            .post(
                `https://m2r31169.herokuapp.com/api/logout`,
                {},
                {
                    headers: headers,
                }
            )
            .then((res) => {
                store.set("logoutEvent", "logout" + Math.random());
                // console.log(res.data);
                store.remove("userData");
                store.clearAll();
                setUserData({});
                window.location = "/";
            })
            .catch((err) => {
                console.error(err);
                console.log("not working");
            });
    };

    const showDrawer = () => {
        setShowDrawerMenu(true);
    };

    const classes = useStyles();

    const drawer = (
        <MenuList className={classes.menuList}>
            <Link to={"/dashboard/home"}>
                <MenuItem
                    key="home"
                    className={buttonActive === "home" ? classes.focusNew : classes.focus}
                    //autoFocus
                    onClick={() => {
                        setButtonActive("home")
                        handleDrawerToggle()
                    }}
                >
                    <HomeRoundedIcon className={classes.menuNames} fontSize="small"/>
                    <p>Home</p>
                </MenuItem>
            </Link>
            <Link to={"/dashboard/complaints"}>
                <MenuItem
                    key="complaint"
                    className={
                        buttonActive === "complaints" ? classes.focusNew : classes.focus
                    }
                    onClick={() => {
                        setButtonActive("complaints")
                        handleDrawerToggle()
                    }}
                >
                    <AssignmentRoundedIcon
                        className={classes.menuNames}
                        fontSize="small"
                    />
                    <p>Complaints</p>
                </MenuItem>
            </Link>
            {props.role === "ADMIN" && (
                <Link to={"/dashboard/supervisors"}>
                    <MenuItem
                        className={
                            buttonActive === "supervisors" ? classes.focusNew : classes.focus
                        }
                        onClick={() => {
                            setButtonActive("supervisors")

                            handleDrawerToggle()
                        }}
                    >
                        <SupervisorAccountRoundedIcon
                            className={classes.menuNames}
                            fontSize="small"
                        />
                        <p>Supervisors</p>
                    </MenuItem>
                </Link>
            )}
            {/* {props.role === "SUPERVISOR" && (
        <Link to={"/dashboard/employees"}>
          <MenuItem
            className={
              buttonActive === "employees" ? classes.focusNew : classes.focus
            }
            onClick={() => setButtonActive("employees")}
          >
            <SupervisorAccountRoundedIcon
              className={classes.menuNames}
              fontSize="small"
            />
            <p>Employees</p>
          </MenuItem>
        </Link>
      )} */}
            <Link to={"/dashboard/reports"}>
                <MenuItem
                    className={
                        buttonActive === "reports" ? classes.focusNew : classes.focus
                    }
                    onClick={() => {
                        setButtonActive("reports")
                        handleDrawerToggle()
                    }}
                >
                    <LibraryBooksIcon className={classes.menuNames} fontSize="small"/>
                    <p>Generate Report</p>
                </MenuItem>
            </Link>
            <Link to={"/dashboard/profile"}>
                <MenuItem
                    className={
                        buttonActive === "profile" ? classes.focusNew : classes.focus
                    }
                    onClick={() => {
                        setButtonActive("profile")
                        handleDrawerToggle()
                    }}
                >
                    <PersonIcon className={classes.menuNames} fontSize="small"/>
                    <p>Profile</p>
                </MenuItem>
            </Link>
            {props.role === "ADMIN" && (
                <Link to={"/dashboard/manage"}>
                    <MenuItem
                        className={
                            buttonActive === "manage" ? classes.focusNew : classes.focus
                        }
                        onClick={() => {
                            setButtonActive("manage")
                            handleDrawerToggle()
                        }}
                    >
                        <SettingsIcon className={classes.menuNames} fontSize="small"/>
                        <p>Manage Complaints</p>
                    </MenuItem>
                </Link>
            )}
            <MenuItem className={classes.focus} onClick={handleLogout}>
                <ExitToAppRoundedIcon className={classes.menuNames} fontSize="small"/>
                <p>Logout</p>
            </MenuItem>
        </MenuList>
    );

    return (

        <div className="menu">
            {isDesktop ? (
                <div className={"menu-div"}>
                    <img alt="" className={"logo"} src={image}/>
                    <p className={"menu-heading-main"}>Sindh Solid Waste Management</p>
                </div>
            ) : (
                <IconButton color="inherit" onClick={showDrawer}>
                    <MenuIcon className={classes.menuIcon}/>
                </IconButton>
            )}

            <div>
                {isDesktop ? (
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                ) : (
                    <Drawer
                        open={showDrawerMenu}
                        classes={{paper: classes.paper}}
                        onClose={handleDrawerToggle}
                    >
                        <div className={"menu-div"}>
                            <img alt="" className={"logo"} src={image}/>
                            <p className={"menu-heading-main"}>
                                Sindh Solid Waste Management
                            </p>
                        </div>
                        <Divider/>
                        {drawer}
                    </Drawer>
                )}
            </div>
        </div>

        // for drawer
    );
}

export default Menu;
