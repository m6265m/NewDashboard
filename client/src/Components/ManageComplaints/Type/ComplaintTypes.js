import React, { useState, useEffect } from "react";
import axios from "axios";
import Type from "./Type";
import AddType from "./AddType";
import Box from "@material-ui/core/Box";
import { ImpulseSpinner } from "react-spinners-kit";
import Backdrop from "@material-ui/core/Backdrop";

export default function ComplaintTypes(props) {
  const { token, loading } = props;
  let store = require("store");
  const [userData, setUserData] = useState(store.get("userData"));
  const [types, setTypes] = useState([]);
  const [edit, setEdit] = useState(null);

  const handleLogoutAutomatically = () => {
    store.remove("userData");
    store.clearAll();
    setUserData({});
    window.location = "/";
  };

  const getTypes = () => {
    loading(true);
    let finalObj = [];
    axios
      .get(
        "https://m2r31169.herokuapp.com/api/dashboard/getComplaintTypeAndImage",
        {
          headers: {
            "x-access-token": token, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        loading(false);
        for (let i in res.data) {
          finalObj.push(res.data);
        }
        setTypes(finalObj[0]);
      })
      .catch((err) => {
        loading(false);
        if (err.response) {
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
        console.log(err);
      });
  };

  useEffect(() => {
    getTypes();
  }, []);

  return (
    <Box display="flex" flexWrap="wrap" alignContent="flex-start">
      {types.map((type) => (
        // <p>{type.typeName}</p>
        <Type
          id={type.id}
          name={type.typeName}
          image={type.image}
          enable={type.isEnable}
          token={token}
          edit={(id) => {
            setEdit(id);
          }}
          allowEdit={edit == type.id ? true : false}
          doneEnable={() => {
            getTypes();
          }}
          done={() => {
            getTypes();
            setEdit(null);
          }}
        />
      ))}
      <AddType key={types} token={token} done={() => getTypes()} />
    </Box>
  );
}
