import React, { useState, useEffect } from 'react';
import api from '../../http-common';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/Styles'
import RoomPropertiesPage from './RoomPropertiesPage'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function Settings(props){
  return (
    <Grid container spacing={1} align='center'>
      <Grid item xs={12}>
        <RoomPropertiesPage />
      </Grid>
    </Grid>
  )
}

export default function RoomPage (props) {
  const {id} = useParams();
  const classes = useStyles();
  const history = useHistory();

  const [room, setRoom] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  useEffect(() => {
    (async () => {
      const room = await api.get(`/rooms/${id}`)
      setRoom(room.data)
    })()
  }, [id]);
  
  const handleLeaveClick = async () => {
    try {
      await api.post('/leave-room')
      setRoom(null)
      history.push('/')
    }
    catch (error) {
      console.log(error)
    }
  }

  const roomUpdater = (data) => {
    setRoom({
      ...room, 
      guest_can_pause : data.guest_can_pause === 'true' ? true : false,
      votes_to_skip:data.votes_to_skip
    })
    setShowSettings(false)
  }

  return(
    <><Grid container spacing={1} align='center' className={classes.paper}>
      {room ? <>
        <Grid item xs={12}>
          <Typography variant='h4' component='h4'>
            Code: {id}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6' component='h6'>
            Votes to Skip: {room.votes_to_skip}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6' component='h6'>
            Guest Can Pause: {room.guest_can_pause ? 'Yes' : 'No'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6' component='h6'>
            User is Host: {room.isHost ? 'Yes' : 'No'}
          </Typography>
        </Grid>
        {room.isHost ? 
          <Grid item xs={12} variant='contained'>
            <Button 
              variant='contained' 
              color='primary' 
              onClick={()=>setShowSettings(true)}
            >
              Settings
            </Button>
          </Grid> : null  
        }
        <Grid item xs={12}>
          <Button color='secondary' variant='contained' onClick={handleLeaveClick}>
            Leave Room
          </Button>
        </Grid>
      </> : <>
        <Grid item xs={12}>
          <Typography variant='h4' component='h4'>
            Room Not Found!
          </Typography>
          <Button 
            color='primary' 
            to='/' 
            variant='contained' 
            component={Link}
          >
            Click to Return
          </Button>
        </Grid>
      </>}
    </Grid>
    {
      showSettings ? 
        <Grid container spacing={1} align='center'>
          <Grid item xs={12}>
            <RoomPropertiesPage edit room={room} roomUpdater={roomUpdater}/>
          </Grid>        
        </Grid>
        : null
    }</>
  )
}
