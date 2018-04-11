// "Request" library
import axios from 'axios';

const clientId = 'ea788a5aa0034d16a33d9d60488f2f45'; // Your client id
const clientSecret = '2a21c40782a34a71bb28701440b287be'; // Your secret

function splice(track, features) {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists.map(artist => artist.name),
    album: track.album.name,
    art: track.album.images[0],
    sample: track.preview_url,
    features: {
      acousticness: features.acousticness,
      danceability: features.danceability,
      energy: features.energy,
      instrumentalness: features.instrumentalness,
      key: features.key,
      liveness: features.liveness,
      loudness: features.loudness,
      mode: features.mode,
      popularity: track.popularity,
      speechiness: features.speechiness,
      tempo: features.tempo,
      valence: features.valence
    }
  };
}

let authTokenPromise;
let authTokenExpires;

function fetchAuthHeaders() {
  if (!authTokenPromise || Date.now() >= authTokenExpires) {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    authTokenPromise = axios.post('https://accounts.spotify.com/api/token', params, {
      withCredentials: true,
      headers: {
        Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      }
    }).then(resp => {
      authTokenExpires = Date.now() + (resp.data.expires_in * 1000);
      console.log('Refreshed auth-token, will expire in ' + resp.data.expires_in + 's');
      return {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + resp.data.access_token
        }
      };
    }, () => console.log('Unable to authenticate'));
  }
  return authTokenPromise;
}

function fetchTrack(id) {
  return fetchAuthHeaders().then(headers => {
    const reqs = [];
    reqs.push(axios.get('https://api.spotify.com/v1/tracks/' + id, headers));
    reqs.push(axios.get('https://api.spotify.com/v1/audio-features/' + id, headers));
    return Promise.all(reqs).then(resps => splice(resps[0].data, resps[1].data));
  });
}

function searchTracks(query) {
  return fetchAuthHeaders().then(headers =>
    axios.get('https://api.spotify.com/v1/search/?type=track&q=' + query.replace(' ', '+'), headers)
      .then(resp => Promise.all(resp.data.tracks.items.map(track => fetchTrack(track.id))))
  );
}

const spotify = {};
spotify.fetchTrack = fetchTrack;
spotify.searchTracks = searchTracks;

export default spotify;
