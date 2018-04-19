import React from 'react';
import PropTypes from 'prop-types';
import ReactFauxDOM, {withFauxDOM} from 'react-faux-dom';

// Should be: import * as d3 from 'd3'
// But eslint throws a fit...
const d3 = require('d3');

class Visualization extends React.Component {
  componentDidMount() {
    const faux = this.props.connectFauxDOM('svg', 'rd3');
    const {active, suggested} = this.props;
    console.log(active);
    console.log(suggested);
    const txt = new ReactFauxDOM.Element('text', faux);
    txt.setAttribute('x', 0);
    txt.setAttribute('y', 15);
    txt.innerHTML = 'D3 goes here';
    faux.appendChild(txt);
  }

  render() {
    return (
      <div>
        {this.props.rd3}
      </div>
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
