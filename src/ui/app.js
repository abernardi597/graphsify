import React from 'react';
import PropTypes from 'prop-types';
import {createMuiTheme, MuiThemeProvider, withStyles} from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Drawer from 'material-ui/Drawer';

import Library from './library';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#191414'
    },
    secondary: {
      main: '#1db954'
    }
  }
});

const style = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex'
  },
  bar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    position: 'relative',
    width: 400
  },
  toolbar: theme.mixins.toolbar
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      active: [],
      suggested: []
    };
  }

  render() {
    const {classes} = this.props;
    const {active, suggested} = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="absolute" className={classes.bar}>
            <Toolbar>
              <Typography variant="title" color="inherit" noWrap>
                Graphsify
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" classes={{paper: classes.drawer}}>
            <div className={classes.toolbar} />
            <Library active={active} suggested={suggested}/>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(App);
