import React from 'react';
import PropTypes from 'prop-types';
import ReactFauxDOM, {withFauxDOM} from 'react-faux-dom';

// Should be: import * as d3 from 'd3'
// But eslint throws a fit...
const d3 = require('d3');

class Visualization extends React.Component {
  constructor(props) {
    super(props);
  }

  drawChart() {
    const {active, suggested} = this.props;

    var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var maxVal = 0;

    var width = 960;
    var height = 600;
    var radius = 15;

    const data = active
    console.log(data)
    const div = ReactFauxDOM.createElement('div');


    var artists = [];
    for(let i = 0; i < data.length; i++) {
      artists.push(data[i].artists[0]);
    }

    var links = generateLinks(data)

    var graph = {
      "nodes": data,
      "links": links
    }

    let svg = d3.select(div).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var tooltip = d3.select("body").append("div") 
      .style("position", "absolute")     
      .style("text-align", "center")     
      .style("width", "auto")          
      .style("height", "auto")         
      .style("padding", "5px")       
      .style("font", "12px sans-serif")    
      .style("background", "lightsteelblue")
      .style("border", "0px")    
      .style("border-radius", "8px")     
      .style("pointer-events", "none")        
      .style("opacity", 0);

    var link = svg.append("g")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return 1.5*(maxVal - d.value + 1); })
      .attr("stroke", function(d) {return d3.interpolateGreys(1-rescale(d.value, 0, .6, 0, maxVal))})
      .on("mouseover", function(d) {    
          tooltip.transition()    
                 .duration(200)    
                 .style("opacity", .9);    
          tooltip.html("Most similiar due to: <br/>" + d.similarIn.slice(0,3).join(", "))  
                 .style("left", (Math.max(60, Math.min(width - 60, d3.event.pageX))) + "px")   
                 .style("top", (Math.max(40, Math.min(height - 40, d3.event.pageY - 28))) + "px");  
        })          
        .on("mouseout", function(d) {   
          tooltip.transition()    
                 .duration(500)    
                 .style("opacity", 0); 
        });

    var node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", "1.5px")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", radius)
      .attr("fill", function(d) { return color(artists.indexOf(d.artists[0])); })
      .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
      .on("mouseover", function(d) {    
        tooltip.transition()    
               .duration(200)    
               .style("opacity", .9);    
        tooltip.html("Title: " + d.name + "<br/>Artist(s): " + d.artists.join(", "))  
               .style("left", (Math.max(50, Math.min(width - 50, d3.event.pageX))) + "px")   
               .style("top", (Math.max(30, Math.min(height - 30, d3.event.pageY - 28))) + "px");  
      })          
      .on("mouseout", function(d) {   
        tooltip.transition()    
               .duration(500)    
               .style("opacity", 0); 
      });

    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return d.value * 30}))
    .force("charge", d3.forceManyBody().strength(function(d) {return d.value*-30}).strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(15))
    .stop();

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    for (var i = 0; i < 50; ++i) simulation.tick();
          node
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });



    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
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
      var values = []
      values.push(Math.abs(f1.acousticness - f2.acousticness))
      values.push(Math.abs(f1.danceability - f2.danceability))
      values.push(Math.abs(f1.energy - f2.energy))
      values.push(Math.abs(f1.instrumentalness - f2.instrumentalness))
      if(f1.key === f2.key) {
        values.push(0)
      }
      else {
        values.push(1)
      }
      values.push(Math.abs(f1.liveness - f2.liveness))
      if(f1.mode === f2.mode) {
        values.push(0)
      }
      else {
        values.push(1)
      }
      values.push(Math.abs(f1.speechiness - f2.speechiness))
      values.push(Math.abs(f1.tempo - f2.tempo) / 200)
      values.push(Math.abs(f1.valence - f2.valence))

      var features = ["acousticness", "danceability", "energy", "instrumentalness", "key", "liveness", "mode", "speechiness", "tempo", "valence"]

      // FROM: http://takeip.com/what-is-the-javascript-equivalent-of-numpy-argsort.html
      const similarIn = features
      .map((item, index) => [values[index], item]) // add the clickCount to sort by
      .sort(([count1], [count2]) => count2 - count1) // sort by the clickCount data
      .map(([, item]) => item); // extract the sorted items

      var dist = 0;
      for(let i=0; i < values.length; i++) {
        dist += values[i] * weights[i];
      }
      return [dist, similarIn];
    }

    function compareLinks(link1, link2) {
      return link1.value - link2.value
    }

    function generateLinks(nodes) {
      var links = []
      var linksByNode = []
      for(let i = 0; i < nodes.length; i++) {
        var thisNodeLinks = []
        for(var j = 0; j < nodes.length; j++) {
          if(i !== j) {
            var source = nodes[i].id
            var target = nodes[j].id
            var result = calcDist(nodes[i].features, nodes[j].features)
            links.push({source: source, target: target, value: result[0], similarIn: result[1]})
            thisNodeLinks.push({source: source, target: target, value: result[0], similarIn:result[1]})
          }
        }
        linksByNode.push(thisNodeLinks)
      }
      links.sort(compareLinks)
      var toKeep = nodes.length * 3//Math.ceil(links.length * .2)
      var topLinks = links.splice(0, toKeep)
      var linkList = topLinks
      for(let i = 0; i < linksByNode.length; i++) {
        toKeep = 1//Math.ceil(linksByNode[i].length * .1)
        linkList = linkList.concat(linksByNode[i].sort(compareLinks).splice(0, toKeep))
      }
      linkList.sort(compareLinks)
      maxVal = linkList[linkList.length-1].value
      return linkList
    }

    function rescale(x, newMin, newMax, oldMin, oldMax) {
      var newX = ((newMax - newMin) * (x - oldMin)) / (oldMax - oldMin) + newMin
      return newX
    }
    
    return div.toReact()
  }
  componentDidMount() {
    //const faux = this.props.connectFauxDOM('svg', 'rd3');
    //const {active, suggested} = this.props;
    //console.log(active);
    //console.log(suggested);
    // const txt = new ReactFauxDOM.Element('text', faux);
    // txt.setAttribute('x', 0);
    // txt.setAttribute('y', 15);
    // txt.innerHTML = 'D3 goes here';
    // faux.appendChild(txt);
  }

  render() {
    return (this.drawChart()
      //<div>
      //  {this.props.rd3}
      //</div>
    );
  }
}

Visualization.propTypes = {
  rd3: PropTypes.object,
  connectFauxDOM: PropTypes.func,
  active: PropTypes.array.isRequired,
  suggested: PropTypes.array.isRequired
};

export default withFauxDOM(Visualization);
