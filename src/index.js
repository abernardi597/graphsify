// TO GET PASSED THE CORS ERROR:
// open windows "run"
// enter command: chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
// the window that opens allow the security to be bypassed

import spotify from './data/spotify';
import * as Features from './data/features';

spotify.fetchTracks(['3twNvmDtFQtAd5gMKedhLD']).then(console.log);
spotify.searchTracks('Love').then(console.log);

const weights = {
  energy: 0.9,
  valence: 0.8,
  danceability: 0.7,
  tempo: 0.6
};

spotify.fetchTracks(['6rVJfgSjj2jEKkXL5QuXPd']).then(tracks => {
  console.log(tracks[0]);
  const req = spotify.recommendTracks(tracks[0], weights, 10);
  req.then(console.log);
  req.then(suggested => suggested.map(track => Features.distance(tracks[0].features, track.features, weights))).then(console.log);
});
