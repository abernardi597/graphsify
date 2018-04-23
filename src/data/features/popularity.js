import Feature from './feature';

const popularity = new Feature(0, 100, track => track.popularity);

export default Object.freeze(popularity);
