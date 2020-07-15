import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { useDispatch } from "react-redux";

import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import useStyles from "./App.styles";
import { HOME_URL } from "./util/navigationEndpoints";
import Header from "./components/header/Header.component";
import Notifier from "./components/notifier/Notifier.component";
import { closeSnackbar } from "./redux/notifier/notifier.actions";

const Home = lazy(() => import("./pages/home/Home.page"));

const theme = createMuiTheme({
  palette: {
    primary: { main: "#37474f" },
    secondary: { main: "#1976d2" },
    error: { main: "#b71c1c" },
  },
});

function App() {
  const dispatch = useDispatch();
  const styleClasses = useStyles();

  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      dense
      preventDuplicate
      hideIconVariant
      action={(key) => (
        <IconButton aria-label="close notification" onClick={() => dispatch(closeSnackbar(key))}>
          <ClearIcon />
        </IconButton>
      )}
    >
      <ThemeProvider theme={theme}>
        <Notifier />
        <div className={styleClasses.root}>
          <CssBaseline />
          <Header />
          <Switch>
            <Suspense fallback={<LinearProgress color="secondary" />}>
              <main className={styleClasses.content}>
                <div className={styleClasses.appBarSpacer} />
                <Container maxWidth="xl" className={styleClasses.container}>
                  <Route exact path={HOME_URL} component={Home} />
                </Container>
              </main>
            </Suspense>
          </Switch>
        </div>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
