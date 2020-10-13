import React from "react";
import { Box } from "@material-ui/core";
import SelectFilter from "./SelectFilter";

export default function Details(props) {
  const { filterValue, orignalData, filter, userData } = props;
  return (
    <div>
      <SelectFilter
        key={filter["statusType"][0]}
        orignalData={orignalData}
        label="Status"
        name="statusType"
        value={filter["statusType"]}
        filterValue={filterValue}
      />

      <SelectFilter
        key={filter["priority"][0]}
        orignalData={orignalData}
        label="Priority"
        name="priority"
        value={filter["priority"]}
        filterValue={filterValue}
      />

      <SelectFilter
        name="type"
        orignalData={orignalData}
        label="Type"
        value={filter["type"]}
        key={filter["type"][0]}
        filterValue={filterValue}
      />

      <SelectFilter
        name="town"
        orignalData={orignalData}
        label="Town"
        value={filter["town"]}
        key={filter["town"][0]}
        filterValue={filterValue}
      />

      {userData.Role === "ADMIN" && (
        <SelectFilter
          name="supervisorName"
          orignalData={orignalData}
          label="Supervisor"
          value={filter["supervisorName"]}
          key={filter["supervisorName"][0]}
          filterValue={filterValue}
        />
      )}
      {userData.Role === "ADMIN" && (
        <SelectFilter
          name="otherStatus"
          orignalData={orignalData}
          label="Supervisor Status"
          value={filter["otherStatus"]}
          key={filter["otherStatus"][0]}
          filterValue={filterValue}
        />
      )}
    </div>
  );
}
