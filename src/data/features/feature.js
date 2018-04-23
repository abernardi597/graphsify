export default class Feature {
  constructor(min, max, extractor) {
    this.min = min;
    this.max = max;
    this.extract = extractor;
  }

  normalize(value) {
    return value;
  }

  distance(v1, v2) {
    const diff = (v2 - v1) / (this.max - this.min);
    return diff * diff;
  }

  threshold(weight) {
    return (this.max - this.min) * (1 - weight);
  }
}
