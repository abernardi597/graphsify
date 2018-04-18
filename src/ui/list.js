import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';

import Avatar from 'material-ui/Avatar';
import List, {ListItem, ListItemAvatar, ListItemText} from 'material-ui/List';
import Typography from 'material-ui/Typography';

const styles = {
  empty: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

let Track = props => {
  const {track, onClick} = props;
  return (
    <ListItem button onClick={() => onClick ? onClick(track) : null}>
      <ListItemAvatar>
        <Avatar src={track.art.url} />
      </ListItemAvatar>
      <ListItemText primary={track.name} secondary={track.artists.join(', ')}/>
    </ListItem>
  );
};

Track.propTypes = {
  track: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired
};

Track = withStyles(styles)(Track);

function TrackList(props) {
  const {tracks, onClick, classes} = props;
  if (tracks.length === 0) return (
    <div className={classes.empty}>
      <Typography variant="caption" color="textSecondary">
        There is nothing here
      </Typography>
    </div>
  );
  else return (
    <List dense>
      {tracks.map(track => (<Track key={track.id} track={track} onClick={onClick} />))}
    </List>
  );
}

TrackList.propTypes = {
  tracks: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TrackList);
