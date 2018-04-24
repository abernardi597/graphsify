import React from 'react';
import PropTypes from 'prop-types';

import {ForceGraph2D} from 'react-force-graph';

import * as Features from '../data/features';

function makeGraph(active, suggested, weights) {
  const nodes = [];
  active.forEach(track => nodes.push(track));
  suggested.forEach(track => nodes.push(track));

  const links = [];
  for (let i = 0; i < active.length; ++i) {
    const neighbors = [];
    for (let j = 0; j < active.length; ++j)
      if (i !== j) {
        const distance = Features.distance(active[i].features, active[j].features, weights);
        neighbors.push({
          source: active[i],
          target: active[j],
          distance
        });
      }
    neighbors.sort((e1, e2) => e1.distance - e2.distance);
    neighbors.slice(0, 2).forEach(e => links.push(e));
  }

  for (let i = 0; i < suggested.length; ++i) {
    let best = null;
    for (let j = 0; j < active.length; ++j) {
      const distance = Features.distance(suggested[i].features, active[j].features, weights);
      if (best === null || distance < best.distance)
        best = {
          source: active[j],
          target: suggested[i],
          distance
        };
    }
    if (best !== null)
      links.push(best);
  }
  return {nodes, links};
}

function normalize(name, value) {
  const f = Features[name];
  return (value - f.min) / (f.max - f.min);
}

function Graph(props) {
  const {active, suggested, weights} = props;
  const coloredWeights = Object.entries(weights).sort((e1, e2) => normalize(e2[0], e2[1]) - normalize(e1[0], e1[1]))
    .slice(0, 3).map(e => e[0]);
  return <ForceGraph2D width={window.innerWidth} height={window.innerHeight}
    graphData={makeGraph(active, suggested, weights)}
    nodeColor={node => {
      const rgb = [128, 128, 128];
      for (let i = 0; i < coloredWeights.length; ++i)
        rgb[i] = Math.floor(255 * normalize(coloredWeights[i], node.features[coloredWeights[i]]));
      return 'rgb(' + rgb.join(',') + ')';
    }}
    linkDirectionalParticles={2}
  />;
}

Graph.propTypes = {
  active: PropTypes.array.isRequired,
  suggested: PropTypes.array.isRequired,
  weights: PropTypes.object.isRequired
};

export default Graph;
