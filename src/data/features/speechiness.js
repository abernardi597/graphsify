import Feature from './feature';

const speechiness = new Feature(0, 1, (track, features) => features.speechiness);

export default Object.freeze(speechiness);
