import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Redirect,
  Route,
} from "react-router-dom";
import api from "../http-common";
import JoinRoomPage from "./Room/JoinRoomPage";
import RoomPropertiesPage from "./Room/RoomPropertiesPage";
import RoomPage from "./Room/RoomPage";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/Styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function HomePage(props) {
  const classes = useStyles();

  return (
    <Grid container spacing={3} align="center" className={classes.paper}>
      <Grid item xs={12}>
        <Typography variant="h3" component="h3">
          Spotify House Party
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button to="/rooms/join" component={Link}>
            Join Room
          </Button>
          <Button to="/rooms/create" component={Link} color="secondary">
            Create Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default function LayOut(props) {
  const [userRoomCode, setUserRoomCode] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/user-in-room`);
      const roomCode = res.data.code;
      if (roomCode !== "None") {
        setUserRoomCode(roomCode);
      }
    })();
  }, []);

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return userRoomCode ? (
              <Redirect to={`/rooms/${userRoomCode}`} />
            ) : (
              <HomePage />
            );
          }}
        />
        <Route exact path="/rooms/join" component={JoinRoomPage} />
        <Route exact path="/rooms/create" component={RoomPropertiesPage} />
        <Route exact path="/rooms/:id" component={RoomPage} />
      </Switch>
    </Router>
  );
}
