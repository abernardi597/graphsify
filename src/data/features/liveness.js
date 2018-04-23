import Feature from './feature';

const liveness = new Feature(0, 1, (track, features) => features.liveness);

export default Object.freeze(liveness);
