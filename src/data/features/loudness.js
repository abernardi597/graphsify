import Feature from './feature';

const loudness = new Feature(-60, 0, (track, features) => features.loudness);

export default Object.freeze(loudness);
