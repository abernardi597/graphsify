import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';

import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  listPaper: {
    width: '100%',
    minHeight: '80%',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    overflow: 'auto'
  },
  listTable: {
    minWidth: '100%'
  }
});

function List(props) {
  const {classes, tracks} = props;
  return (
    <Paper className={classes.listPaper}>
      <Table className={classes.listTable}>
        <TableHead>
          <TableCell>Song</TableCell>
          <TableCell>Artist</TableCell>
          <TableCell>Album</TableCell>
        </TableHead>
        <TableBody>
          {tracks.map(t => (
            <TableRow hover key={t.id}>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.artist}</TableCell>
              <TableCell>{t.album}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

List.propTypes = {
  tracks: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(List);
