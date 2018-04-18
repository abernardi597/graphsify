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

function fetchTracks(ids) {
  const count = ids.length;
  if (count === 0) {
    return Promise.resolve([]);
  } else return fetchAuthHeaders().then(headers => {
    const reqs = [];
    const qstr = ids.join(',');
    reqs.push(axios.get('https://api.spotify.com/v1/tracks/?ids=' + qstr, headers));
    reqs.push(axios.get('https://api.spotify.com/v1/audio-features/?ids=' + qstr, headers));
    return Promise.all(reqs).catch(err => console.log(err.response)).then(resps => {
      const tracks = [];
      for (let i = 0; i < count; ++i) {
        tracks.push(splice(resps[0].data.tracks[i], resps[1].data.audio_features[i]));
      }
      return tracks;
    });
  });
}

function searchTracks(query) {
  return fetchAuthHeaders().then(headers =>
    axios.get('https://api.spotify.com/v1/search/?type=track&q=' + query.replace(' ', '+'), headers)
      .then(resp => fetchTracks(resp.data.tracks.items.map(track => track.id)))
  );
}

const spotify = {};
spotify.fetchTracks = fetchTracks;
spotify.searchTracks = searchTracks;

export default spotify;
