import Feature from './feature';

const danceability = new Feature(0, 1, (track, features) => features.danceability);

export default Object.freeze(danceability);
