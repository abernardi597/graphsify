import Feature from './feature';

const energy = new Feature(0, 1, (track, features) => features.energy);

export default Object.freeze(energy);
