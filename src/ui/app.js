import React from 'react';
import PropTypes from 'prop-types';
import {createMuiTheme, MuiThemeProvider, withStyles} from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconSettings from 'material-ui-icons/Settings';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Drawer from 'material-ui/Drawer';

import Library from './library';
import TrackAdder from './adder';

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
  flex: {
    flex: 1
  },
  bar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: 400
  },
  toolbar: theme.mixins.toolbar
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      active: [],
      suggested: [],
      adding: false,
      sliding: false
    };
  }

  render() {
    const {classes} = this.props;
    const {active, suggested, adding, sliding} = this.state;
    const add = track => {
      if (!active.includes(track)) {
        active.push(track);
        this.setState({active});
      }
    };
    const open = () => {
      this.setState({adding: true});
    };
    const close = () => {
      this.setState({adding: false});
    };
    const slide = () => {
      this.setState({sliding: !sliding});
    };
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="absolute" className={classes.bar}>
            <Toolbar>
              <Typography variant="title" color="inherit" noWrap className={classes.flex}>
                Graphsify
              </Typography>
              <IconButton onClick={slide}>
                <IconSettings color={sliding ? 'secondary' : 'inherit'}/>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" classes={{paper: classes.drawer}}>
            <div className={classes.toolbar} />
            <Library active={active} suggested={suggested} fabAdd={open}/>
          </Drawer>
          <Drawer variant="persistent" anchor="right" classes={{paper: classes.drawer}} open={sliding}>
            <div className={classes.toolbar} />
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
          </main>
        </div>
        <TrackAdder open={adding} onClose={close} onSelect={add} />
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(App);
