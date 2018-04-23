import Feature from './feature';

const mode = new Feature(0, 1, (track, features) => features.mode);

export default Object.freeze(mode);
