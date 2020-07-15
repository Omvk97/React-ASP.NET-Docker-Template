import React from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import useStyles from "./Header.styles";
import { overviewItems } from "./listitems";
import { IRootState } from "../../types/redux/reducerStates.types";

function Header() {
  const [open, setOpen] = React.useState(false);
  const headerTitle = useSelector((store: IRootState) => store.ui.headerTitle);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const styleClasses = useStyles();

  return (
    <React.Fragment>
      <AppBar position="absolute" className={clsx(styleClasses.appBar, open && styleClasses.appBarShift)}>
        <Toolbar className={styleClasses.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(styleClasses.menuButton, open && styleClasses.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={styleClasses.title}>
            {headerTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(styleClasses.drawerPaper, !open && styleClasses.drawerPaperClose),
        }}
        open={open}
      >
        <div className={styleClasses.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{overviewItems}</List>
      </Drawer>
    </React.Fragment>
  );
}

export default Header;
