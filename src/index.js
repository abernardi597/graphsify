// TO GET PASSED THE CORS ERROR:
// open windows "run"
// enter command: chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
// the window that opens allow the security to be bypassed

import spotify from './data/spotify';

const allTracks = [];
const allFeatures = [];

spotify.trackNameToTrackInfo('Castle of Glass', 'Linkin Park', info => {
  allTracks.push(info);
});
spotify.trackNameToFeatures('Castle of Glass', 'Linkin Park', features => {
  allFeatures.push(features);
});

spotify.trackNameToTrackInfo('In the End', 'Linkin Park', info => {
  allTracks.push(info);
});
spotify.trackNameToFeatures('In the End', 'Linkin Park', features => {
  allFeatures.push(features);
});

spotify.trackNameToTrackInfo('Livin on a Prayer', 'Bon Jovi', info => {
  allTracks.push(info);
});
spotify.trackNameToFeatures('Livin on a Prayer', 'Bon Jovi', features => {
  allFeatures.push(features);
});

console.log(allTracks);
console.log(allFeatures);
