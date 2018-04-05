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

const active = [
  {
    id: '5Cw6SX4MtdaOvM0GbN5g7j',
    name: '8 Bit Adventure',
    artist: 'AdhesiveWombat',
    album: 'Marsupial Madness',
    art: 'https://i.scdn.co/image/af7dadc5da4ac8a3db7c2757228baf45eab7f63a',
    sample: 'https://p.scdn.co/mp3-preview/f8084b79e16ac3849eb37cf9cf6c2ceafbea931c?cid=774b29d4f13844c495f206cafdad9c86',
    features: {
      danceability: 0.543,
      energy: 0.794,
      key: 1,
      loudness: -7.377,
      mode: 0,
      speechiness: 0.0516,
      acousticness: 0.0344,
      instrumentalness: 0.174,
      liveness: 0.122,
      valence: 0.694,
      tempo: 76.505
    }
  },
  {
    id: '2S4CfxZG29GZWwDeMtBq2R',
    name: 'I Just Wanna Run',
    artist: 'The Downtown Fiction',
    album: 'Best I Never Had',
    art: 'https://i.scdn.co/image/4c78bf7f246502aefb02df7ef50ccce457497933',
    sample: 'https://p.scdn.co/mp3-preview/d16ef491b7bf665198a991fcf81c53f3df6fcd4d?cid=774b29d4f13844c495f206cafdad9c86',
    features: {
      danceability: 0.669,
      energy: 0.667,
      key: 4,
      loudness: -3,
      mode: 1,
      speechiness: 0.0511,
      acousticness: 0.00769,
      instrumentalness: 0,
      liveness: 0.0983,
      valence: 0.69,
      tempo: 128.103
    }
  }
];

const suggested = [];

function App(props) {
  const {classes} = props;
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
      </div>
    </MuiThemeProvider>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(App);
