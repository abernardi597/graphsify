import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';

import Avatar from 'material-ui/Avatar';
import List, {ListItem, ListItemAvatar, ListItemText} from 'material-ui/List';

const styles = {
};

let Track = props => {
  const {track} = props;
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar src={track.art.url} />
      </ListItemAvatar>
      <ListItemText primary={track.name} secondary={track.artists.join(', ')}/>
    </ListItem>
  );
};

Track.propTypes = {
  track: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

Track = withStyles(styles)(Track);

function TrackList(props) {
  const {tracks} = props;
  return (
    <List dense>
      {tracks.map(track => (<Track key={track.id} track={track} />))}
    </List>
  );
}

TrackList.propTypes = {
  tracks: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TrackList);
