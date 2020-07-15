import React from "react";
import { useDispatch } from "react-redux";

import Button from "@material-ui/core/Button";

import { enqueueSnackbar } from "../../redux/notifier/notifier.actions";

function Home() {
  const dispatch = useDispatch();

  function onButtonClick(event: any) {
    dispatch(
      enqueueSnackbar({
        message: "Hello human!",
        options: { persist: false, variant: "success" },
      })
    );
  }

  return (
    <Button variant="contained" color="primary" onClick={onButtonClick}>
      Hello human!
    </Button>
  );
}

export default Home;
