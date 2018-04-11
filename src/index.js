// TO GET PASSED THE CORS ERROR:
// open windows "run"
// enter command: chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
// the window that opens allow the security to be bypassed

import spotify from './data/spotify';

spotify.fetchTrack('3twNvmDtFQtAd5gMKedhLD').then(console.log);
spotify.searchTracks('Love').then(console.log);
