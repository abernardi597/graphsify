import React from 'react';
import PropTypes from 'prop-types';
import ReactFauxDOM, {withFauxDOM} from 'react-faux-dom';

// Should be: import * as d3 from 'd3'
// But eslint throws a fit...
const d3 = require('d3');

class Visualization extends React.Component {
  drawChart() {
    const {active, suggested, weights} = this.props;
    const activeList = active.map(el => {
      const o = Object.assign({}, el);
      o.isSuggested = false;
      return o;
    });
    const suggestedList = suggested.map(el => {
      const o = Object.assign({}, el);
      o.isSuggested = true;
      return o;
    });

    const features = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'key', 'liveness', 'mode', 'speechiness', 'tempo', 'valence'];
    let topWeights = features
      .map((item, index) => [weights[index], item]) // Add the clickCount to sort by
      .sort(([count1], [count2]) => count2 - count1) // Sort by the clickCount data
      .map(([, item]) => item); // Extract the sorted items
    topWeights = topWeights.slice(0, 3);

    let maxVal = 0;

    const width = 960;
    const height = 600;
    const radius = 15;

    const data = activeList.concat(suggestedList);
    console.log(data);
    const div = ReactFauxDOM.createElement('div');

    const artists = [];
    for (let i = 0; i < data.length; i++) {
      artists.push(data[i].artists[0]);
    }

    const links = generateLinks(data);

    const graph = {
      nodes: data,
      links
    };

    const svg = d3.select(div).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g');

    const tooltip = d3.select('body').append('div')
      .style('position', 'absolute')
      .style('text-align', 'center')
      .style('width', 'auto')
      .style('height', 'auto')
      .style('padding', '5px')
      .style('font', '12px sans-serif')
      .style('background', 'lightsteelblue')
      .style('border', '0px')
      .style('border-radius', '8px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const link = svg.append('g')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('stroke-width', d => {
        return 1.5 * (maxVal - d.value + 1);
      })
      .attr('stroke', d => {
        return d3.interpolateGreys(1 - rescale(0, 0.6, 0, maxVal)(d.value));
      })
      .on('mouseover', d => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html('Most similiar due to: <br/>' + d.similarIn.slice(0, 3).join(', '))
          .style('left', (Math.max(60, Math.min(width - 60, d3.event.pageX))) + 'px')
          .style('top', (Math.max(40, Math.min(height - 40, d3.event.pageY - 28))) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    const node = svg.append('g')
      .selectAll('circle')
      .data(graph.nodes)
      .enter().append('circle')
      .attr('r', d => {
        return d.isSuggested ? radius - 1 : radius;
      })
      .attr('fill', d => {
        return d.isSuggested ? '#fff' : getColor(d.features, d.isSuggested);
      })
      .attr('stroke', d => {
        return d.isSuggested ? getColor(d.features, d.isSuggested) : '#fff';
      })
      .attr('stroke-width', d => {
        return d.isSuggested ? '2px' : '1.5px';
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('mouseover', d => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        if (d.isSuggested) {
          tooltip.html('Suggested Song:<br/>Title: ' + d.name + '<br/>Artist(s): ' + d.artists.join(', '))
            .style('left', (Math.max(50, Math.min(width - 50, d3.event.pageX))) + 'px')
            .style('top', (Math.max(30, Math.min(height - 30, d3.event.pageY - 28))) + 'px');
        } else {
          tooltip.html('Title: ' + d.name + '<br/>Artist(s): ' + d.artists.join(', '))
            .style('left', (Math.max(50, Math.min(width - 50, d3.event.pageX))) + 'px')
            .style('top', (Math.max(30, Math.min(height - 30, d3.event.pageY - 28))) + 'px');
        }
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => {
        return d.id;
      }).distance(d => {
        return d.value * 30;
      }))
      .force('charge', d3.forceManyBody().strength(d => {
        return d.value * -30;
      }).strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(radius + 3))
      .stop();

    simulation
      .nodes(graph.nodes)
      .on('tick', ticked);

    simulation.force('link')
      .links(graph.links);

    for (let i = 0; i < graph.nodes.length * 5; ++i) simulation.tick();

    node
      .attr('cx', d => {
        d.x = Math.max(radius, Math.min(width - radius, d.x));
        return d.x;
      })
      .attr('cy', d => {
        d.y = Math.max(radius, Math.min(height - radius, d.y));
        return d.y;
      });

    link
      .attr('x1', d => {
        return d.source.x;
      })
      .attr('y1', d => {
        return d.source.y;
      })
      .attr('x2', d => {
        return d.target.x;
      })
      .attr('y2', d => {
        return d.target.y;
      });

    function getColor(features, isSuggested) {
      let r = features[topWeights[0]];
      let g = features[topWeights[1]];
      let b = features[topWeights[2]];
      if (topWeights[0] === 'tempo') {
        r /= 200;
      }
      if (topWeights[1] === 'tempo') {
        g /= 200;
      }
      if (topWeights[2] === 'tempo') {
        b /= 200;
      }
      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
      if (isSuggested) {
        return d3.rgb(r, g, b, 1);
      }
      return d3.rgb(r, g, b, 1);
    }

    function ticked() {
      link
        .attr('x1', d => {
          return d.source.x;
        })
        .attr('y1', d => {
          return d.source.y;
        })
        .attr('x2', d => {
          return d.target.x;
        })
        .attr('y2', d => {
          return d.target.y;
        });

      node
        .attr('cx', d => {
          d.x = Math.max(radius, Math.min(width - radius, d.x));
          return d.x;
        })
        .attr('cy', d => {
          d.y = Math.max(radius, Math.min(height - radius, d.y));
          return d.y;
        });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = Math.max(radius, Math.min(width - radius, d3.event.x));
      d.fy = Math.max(radius, Math.min(height - radius, d3.event.y));
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function calcDist(f1, f2) {
      const values = [];
      values.push(Math.abs(f1.acousticness - f2.acousticness));
      values.push(Math.abs(f1.danceability - f2.danceability));
      values.push(Math.abs(f1.energy - f2.energy));
      values.push(Math.abs(f1.instrumentalness - f2.instrumentalness));
      if (f1.key === f2.key) {
        values.push(0);
      } else {
        values.push(1);
      }
      values.push(Math.abs(f1.liveness - f2.liveness));
      if (f1.mode === f2.mode) {
        values.push(0);
      } else {
        values.push(1);
      }
      values.push(Math.abs(f1.speechiness - f2.speechiness));
      values.push(Math.abs(f1.tempo - f2.tempo) / 200);
      values.push(Math.abs(f1.valence - f2.valence));

      // FROM: http://takeip.com/what-is-the-javascript-equivalent-of-numpy-argsort.html
      const similarIn = features
        .map((item, index) => [values[index], item]) // Add the clickCount to sort by
        .sort(([count1], [count2]) => count2 - count1) // Sort by the clickCount data
        .map(([, item]) => item); // Extract the sorted items

      let dist = 0;
      for (let i = 0; i < values.length; i++) {
        dist += values[i] * weights[i];
      }
      return [dist, similarIn];
    }

    function compareLinks(link1, link2) {
      return link1.value - link2.value;
    }

    function generateLinks(nodes) {
      const links = [];
      const linksByNode = [];
      for (let i = 0; i < nodes.length; i++) {
        const thisNodeLinks = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i !== j) {
            const source = nodes[i].id;
            const target = nodes[j].id;
            const result = calcDist(nodes[i].features, nodes[j].features);
            links.push({source, target, value: result[0], similarIn: result[1]});
            thisNodeLinks.push({source, target, value: result[0], similarIn: result[1]});
          }
        }
        linksByNode.push(thisNodeLinks);
      }
      links.sort(compareLinks);
      let toKeep = nodes.length * 3;// Math.ceil(links.length * .2)
      const topLinks = links.splice(0, toKeep);
      let linkList = topLinks;
      for (let i = 0; i < linksByNode.length; i++) {
        toKeep = 1;// Math.ceil(linksByNode[i].length * .1)
        linkList = linkList.concat(linksByNode[i].sort(compareLinks).splice(0, toKeep));
      }
      linkList.sort(compareLinks);
      maxVal = linkList[linkList.length - 1].value;
      return linkList;
    }

    function rescale(newMin, newMax, oldMin, oldMax) {
      return x => (((newMax - newMin) * (x - oldMin)) / (oldMax - oldMin)) + newMin;
    }

    return div.toReact();
  }

  componentDidMount() {
    // Const faux = this.props.connectFauxDOM('svg', 'rd3');
    // const {active, suggested} = this.props;
    // console.log(active);
    // console.log(suggested);
    // const txt = new ReactFauxDOM.Element('text', faux);
    // txt.setAttribute('x', 0);
    // txt.setAttribute('y', 15);
    // txt.innerHTML = 'D3 goes here';
    // faux.appendChild(txt);
    // this.props.animateFauxDOM(2500)
  }

  render() {
    return (this.drawChart()
    // <div>
    //  {this.props.rd3}
    // </div>
    );
  }
}

Visualization.propTypes = {
  rd3: PropTypes.object,
  connectFauxDOM: PropTypes.func,
  active: PropTypes.array.isRequired,
  suggested: PropTypes.array.isRequired,
  weights: PropTypes.array.isRequired
};

export default withFauxDOM(Visualization);
