import Feature from './feature';

const valence = new Feature(0, 1, (track, features) => features.valence);

export default Object.freeze(valence);
