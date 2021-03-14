import React, {useEffect, useState} from 'react';
import api from '../../http-common';
import {Button, Grid, Typography, TextField, FormHelperText,
        FormControl, FormControlLabel, Radio, RadioGroup} from "@material-ui/core"
import {Link, useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/Styles'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));


export default function RoomPropertiesPage(props){
  const classes = useStyles();
  const [votes, setVotes] = useState(2);
  const [canPause, setCanPause] = useState('false');
  const [editCode, setEditCode] = useState(null);

  const history = useHistory()

  useEffect(()=>{
    (async () => {
      if(props.edit) {
        setVotes(props.room.votes_to_skip)
        setCanPause(props.room.guest_can_pause.toString())
        setEditCode(props.room.code)
      }
    })()
  },[props.edit, props.room])

  const handleConfirmButton = async () => {
    const data = {votes_to_skip:votes, guest_can_pause:canPause};
    if (props.edit) {
      const res = await api.patch(`/rooms/${editCode}`, data);
      if (res && res.status === 200){
        props.roomUpdater(data)
      }
    }
    else {
      const res = await api.post('/rooms/create', data);
      if (res && res.status === 201){
        const code = res.data.code
        history.push(`/rooms/${code}`)
      }
    }
  }

  return(
    <Grid container spacing={1} align='center' className={classes.paper}>
      <Grid item xs={12}>
        <Typography component='h4' variant='h4'>
          {props.edit ? 'Edit' : 'Create'} A Room
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControl component='fieldset'>
          <FormHelperText>
            <div align='center'>
              Guest Control of Playback State
            </div>
          </FormHelperText>
          <RadioGroup row value={canPause} onChange={e => setCanPause(e.target.value)}>
            <FormControlLabel 
                value={'true'}
                control={<Radio color='primary' />}
                label='Play/Pause'
                labelPlacement='bottom'
              />
            <FormControlLabel 
              value={'false'}
              control={<Radio color='secondary' />}
              label='No Control'
              labelPlacement='bottom'
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl>
          <TextField 
            required={true}
            type='number'
            value={votes}
            onChange={e => setVotes(e.target.value)}
            inputProps={{
              min: 1
            }} 
          />
          <FormHelperText>
          <div>
              Votes Required to Skip Song
            </div>
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Button color='primary' variant='contained' onClick={handleConfirmButton}>{props.edit ? 'Save' : 'Create'} Room</Button>
      </Grid>

      <Grid item xs={12}>
        <Button color='secondary' variant='contained' to='/' component={Link}>Back</Button>
      </Grid>
    </Grid>
	);
}