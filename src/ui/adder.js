import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import spotify from '../data/spotify';
import TrackList from './list';

const styles = {
  results: {
    height: 400,
    overflow: 'auto'
  }
};

class TrackAdder extends React.Component {
  constructor() {
    super();
    this.state = {
      results: []
    };
    this.req = 0;
  }

  render() {
    const {open, onClose, onSelect, classes} = this.props;
    const {results} = this.state;
    const search = event => {
      const txt = event.target.value.trim();
      const req = ++this.req;
      let tracks;
      if (txt.length > 0)
        tracks = spotify.searchTracks(txt);
      else tracks = Promise.resolve([]);
      tracks.then(results => req === this.req ? this.setState({results}) : null);
    };
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Find Songs</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can look up songs by name.
            Including the artist name or album name may help narrow down the results.
          </DialogContentText>
          <TextField autoFocus placeholder="Search..." fullWidth margin="dense" onChange={search} />
          <div className={classes.results}>
            <TrackList tracks={results} onClick={onSelect}/>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

TrackAdder.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TrackAdder);
