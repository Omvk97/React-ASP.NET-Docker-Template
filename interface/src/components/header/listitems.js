import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import { Link as RouterLink } from "react-router-dom";

import { HOME_URL } from "../../util/navigationEndpoints";

function ListItemLink({ icon, text, link }) {
  const renderLink = React.useMemo(
    () => React.forwardRef((linkProps, ref) => <RouterLink ref={ref} to={link} {...linkProps} />),
    [link]
  );

  return (
    <ListItem button component={renderLink}>
      <ListItemIcon style={{ paddingLeft: "6px" }}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export const overviewItems = (
  <div>
    <ListItemLink icon={<HomeIcon />} text="Overview" link={HOME_URL} />
  </div>
);
