import acousticness from './acousticness';
import danceability from './danceability';
import energy from './energy';
import instrumentalness from './instrumentalness';
import key from './key';
import liveness from './liveness';
import loudness from './loudness';
import mode from './mode';
import popularity from './popularity';
import speechiness from './speechiness';
import tempo from './tempo';
import valence from './valence';

const features = Object.freeze({
  acousticness,
  danceability,
  energy,
  instrumentalness,
  key,
  liveness,
  loudness,
  mode,
  popularity,
  speechiness,
  tempo,
  valence
});

export {features};
export function map(transform) {
  const obj = {};
  for (const [name, feature] of Object.entries(features))
    obj[name] = transform(feature, name);
  return obj;
}
