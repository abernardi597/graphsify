import Feature from './feature';

const instrumentalness = new Feature(0, 1, (track, features) => features.instrumentalness);

export default Object.freeze(instrumentalness);
