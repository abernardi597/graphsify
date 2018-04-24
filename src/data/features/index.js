import Feature from './feature';
import * as Features from '.';

export {default as acousticness} from './acousticness';
export {default as danceability} from './danceability';
export {default as energy} from './energy';
export {default as instrumentalness} from './instrumentalness';
export {default as key} from './key';
export {default as liveness} from './liveness';
export {default as loudness} from './loudness';
export {default as mode} from './mode';
export {default as popularity} from './popularity';
export {default as speechiness} from './speechiness';
export {default as tempo} from './tempo';
export {default as valence} from './valence';

export function forEach(func) {
  for (const [name, feature] of Object.entries(Features))
    if (feature instanceof Feature)
      func(feature, name);
}

export function map(transform) {
  const obj = {};
  forEach((feature, name) => {
    obj[name] = transform(feature, name);
  });
  return obj;
}

export function distance(v1, v2, weights) {
  let d = 0;
  forEach((feature, name) => {
    if (name in weights && weights[name] > 0) {
      if (name in v1 && name in v2)
        d += weights[name] * weights[name] * feature.distance(v1[name], v2[name]);
      else d += weights[name] * weights[name];
    }
  });
  return d;
}
