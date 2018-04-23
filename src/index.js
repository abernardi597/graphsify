// TO GET PASSED THE CORS ERROR:
// open windows "run"
// enter command: chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
// the window that opens allow the security to be bypassed

import spotify from './data/spotify';

spotify.fetchTracks(['3twNvmDtFQtAd5gMKedhLD']).then(console.log);
spotify.searchTracks('Love').then(console.log);
spotify.fetchTracks(['51RtuCFC02Lx9VgE8M9KCW']).then(tracks => spotify.recommendTracks(tracks[0], {
  energy: 0.8,
  valence: 0.8
}).then(console.log));
