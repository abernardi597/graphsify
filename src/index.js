// TO GET PASSED THE CORS ERROR:
// open windows "run"
// enter command: chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
// the window that opens allow the security to be bypassed
import React from 'react';
import {render} from 'react-dom';

import Visualization from './ui/vis';

import spotify from './data/spotify';

Promise.all([spotify.searchTracks('Love'), spotify.searchTracks('Hate')]).then(res =>
  render(<Visualization active={res[0]} suggested={res[1]}/>, document.querySelector('#root'))
);
