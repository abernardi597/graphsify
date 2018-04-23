import Feature from './feature';

const acousticness = new Feature(0, 1, (track, features) => features.acousticness);

export default Object.freeze(acousticness);
