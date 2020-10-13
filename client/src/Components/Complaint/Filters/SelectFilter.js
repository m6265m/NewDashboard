import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: window.innerWidth > 600 ? 120 : "95%",
    maxWidth: 250,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
    color: "white",
    backgroundColor: "teal",
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectFilter(props) {
  const theme = useTheme();
  const { name, value, filterValue, orignalData, label } = props;
  const classes = useStyles();

  const [hasError, setErrors] = useState(false);

  const [status, setStatus] = useState([]);
  const [values, setValues] = useState(value);

  useEffect(() => {
    // if (name == "statusType")
    setStatus([...new Set(orignalData.map((item) => item[name]))]);
    // else if (name == "priority") {
    //   setStatus([...new Set(orignalData.map((item) => item.priority))]);
    // } else if (name == "type") {
    //   setStatus([...new Set(orignalData.map((item) => item.type))]);
    // } else if (name == "town") {
    //   setStatus([...new Set(orignalData.map((item) => item.town))]);
    // }
  }, [orignalData]);

  const handleChange = (event) => {
    setValues(event.target.value);
    filterValue(props.name, event.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel className="label" id="demo-mutiple-chip-label">
        {label}
      </InputLabel>
      <Select
        labelId="demo-mutiple-chip-label"
        id="demo-mutiple-chip"
        multiple
        value={values}
        onChange={handleChange}
        input={<Input id="select-multiple-chip" />}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
        MenuProps={MenuProps}
      >
        {status.map(
          (statusName) =>
            statusName != null && (
              <MenuItem
                key={statusName}
                value={statusName}
                style={getStyles(statusName, values, theme)}
              >
                {statusName}
              </MenuItem>
            )
        )}
      </Select>
    </FormControl>
  );
}

SelectFilter.propTypes = {
  orignalData: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,

  filterValue: PropTypes.func.isRequired,
};
