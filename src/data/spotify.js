// "Request" library
import request from 'request';

const clientId = 'ea788a5aa0034d16a33d9d60488f2f45'; // Your client id
const clientSecret = '2a21c40782a34a71bb28701440b287be'; // Your secret

// Application requests authorization
const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
  },
  form: {
    grant_type: 'client_credentials' // eslint-disable-line camelcase
  },
  json: true
};

let id = '0';
let info = null;
let features = null;

function trackNameToID(trackName, artist, callback) {
  const trackNameFormatted = trackName.split(' ').join('+');
  const artistNameFormatted = trackName.split(' ').join('+');
  const query = trackNameFormatted + '+' + artistNameFormatted;
  const requestUrl = 'https://api.spotify.com/v1/search/?q=' + query + '&type=track';
  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // Use the access token to access the Spotify Web API
      const token = body.access_token;
      const options = {
        url: requestUrl,
        headers: {
          Authorization: 'Bearer ' + token
        },
        json: true
      };
      request.get(options, (error, response, body) => {
        id = body.tracks.items[0].id;
        callback(id);
      });
    }
  });
}

function trackNameToTrackInfo(trackName, artist, callback) {
  trackNameToID(trackName, artist, trackID => {
    const requestUrl = 'https://api.spotify.com/v1/tracks/' + trackID;
    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // Use the access token to access the Spotify Web API
        const token = body.access_token;
        const options = {
          url: requestUrl,
          headers: {
            Authorization: 'Bearer ' + token
          },
          json: true
        };
        request.get(options, (error, response, body) => {
          info = body;
          callback(info);
        });
      }
    });
  });
}

function trackNameToFeatures(trackName, artist, callback) {
  trackNameToID(trackName, artist, trackID => {
    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // Use the access token to access the Spotify Web API
        const token = body.access_token;
        const options = {
          url: 'https://api.spotify.com/v1/audio-features/' + trackID,
          headers: {
            Authorization: 'Bearer ' + token
          },
          json: true
        };
        request.get(options, (error, response, body) => {
          features = body;
          callback(features);
        });
      }
    });
  });
}

const spotify = {};
spotify.trackNameToID = trackNameToID;
spotify.trackNameToTrackInfo = trackNameToTrackInfo;
spotify.trackNameToFeatures = trackNameToFeatures;

export default spotify;
