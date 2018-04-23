import Feature from './feature';

const tempo = new Feature(0, 200, (track, features) => features.tempo);

export default Object.freeze(tempo);
