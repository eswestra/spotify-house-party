import React, { useState } from "react";
import api from "../../http-common";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function JoinRoomPage(props) {
  const history = useHistory();
  const classes = useStyles();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleEnterClick = async () => {
    try {
      await api.post(`/rooms/join/${roomCode}`);
      history.push(`/rooms/${roomCode}`);
    } catch (error) {
      setRoomCode("");
      setError("Room Not Found");
    }
  };

  return (
    <Grid container spacing={1} align="center" className={classes.paper}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={error && error !== "" ? true : false}
          label="code"
          placeholder="Enter A Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          helperText={error}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleEnterClick}>
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
