// "Request" library
import axios from 'axios';

import * as Features from './features';

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
    features: Features.map(feature => feature.extract(track, features))
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
        const track = resps[0].data.tracks[i];
        const features = resps[1].data.audio_features[i];
        if (track && features)
          tracks.push(splice(track, features));
      }
      return tracks;
    });
  });
}

function searchTracks(query) {
  query = query.trim();
  let url = 'https://api.spotify.com/v1/search/?type=track&q=' + query.replace(' ', '+');
  if (query.length <= 0)
    return Promise.resolve([]);
  else if (query.length > 5)
    url += '*';
  return fetchAuthHeaders().then(headers => axios.get(url, headers)
    .then(resp => fetchTracks(resp.data.tracks.items.map(track => track.id)))
  );
}

function recommendTracks(track, weights) {
  let url = 'https://api.spotify.com/v1/recommendations?seed_tracks=' + track.id;
  for (const feature of Object.keys(track.features)) {
    url += '&target_' + feature + '=' + (track.features[feature]);
    if (feature in weights && weights[feature] > 0) {
      const delta = Features.features[feature].threshold(weights[feature]) / 2;
      url += '&min_' + feature + '=' + (track.features[feature] - delta);
      url += '&max_' + feature + '=' + (track.features[feature] + delta);
    }
  }
  return fetchAuthHeaders().then(headers => axios.get(url, headers)
    .then(resp => fetchTracks(resp.data.tracks.filter(t => t.id !== track.id).map(track => track.id)))
  );
}

const spotify = {};
spotify.fetchTracks = fetchTracks;
spotify.searchTracks = searchTracks;
spotify.recommendTracks = recommendTracks;

export default spotify;
